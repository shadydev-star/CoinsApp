// src/controllers/coin.controller.js
const mongoose = require("mongoose");
const { User, Transaction } = require("../models");
const AppError = require("../utils/AppError");
const notifService = require("../services/notification.service");

// ── GET /api/coins/balance ────────────────────────────────────────────────────
exports.getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("coinBalance");
    res.status(200).json({
      status: "success",
      data: { coinBalance: user.coinBalance },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/coins/deposit ───────────────────────────────────────────────────
exports.deposit = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount, reference } = req.body;
    if (!amount || amount <= 0) throw new AppError("Amount must be a positive number.", 400);

    const [txn] = await Transaction.create(
      [{
        user: req.user._id,
        type: "DEPOSIT",
        amount,
        status: "COMPLETED",
        reference: reference || new mongoose.Types.ObjectId().toString(),
        description: "Coin deposit",
      }],
      { session }
    );

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { coinBalance: amount } },
      { new: true, session }
    ).select("coinBalance");

    await session.commitTransaction();

    await notifService.send(req.user._id, {
      type:  "COIN_RECEIVED",
      title: "Coins Deposited ✅",
      body:  `${amount} coins have been added to your wallet.`,
    });

    res.status(200).json({
      status: "success",
      data: { transaction: txn, newBalance: updated.coinBalance },
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// ── POST /api/coins/withdraw ──────────────────────────────────────────────────
exports.withdraw = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) throw new AppError("Amount must be a positive number.", 400);

    const user = await User.findById(req.user._id).session(session);
    if (user.coinBalance < amount) throw new AppError("Insufficient coin balance.", 400);

    const [txn] = await Transaction.create(
      [{
        user: req.user._id,
        type: "WITHDRAWAL",
        amount,
        status: "PENDING",   // PENDING until payment processor confirms
        description: "Coin withdrawal",
      }],
      { session }
    );

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { coinBalance: -amount } },
      { new: true, session }
    ).select("coinBalance");

    await session.commitTransaction();

    res.status(200).json({
      status: "success",
      data: { transaction: txn, newBalance: updated.coinBalance },
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// ── POST /api/coins/transfer ──────────────────────────────────────────────────
exports.transfer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { toUserId, amount, note } = req.body;
    if (!toUserId || !amount) throw new AppError("toUserId and amount are required.", 400);
    if (amount <= 0)          throw new AppError("Amount must be a positive number.", 400);
    if (toUserId === req.user._id.toString()) throw new AppError("Cannot transfer to yourself.", 400);

    const [sender, recipient] = await Promise.all([
      User.findById(req.user._id).session(session),
      User.findById(toUserId).session(session),
    ]);
    if (!recipient) throw new AppError("Recipient user not found.", 404);
    if (sender.coinBalance < amount) throw new AppError("Insufficient coin balance.", 400);

    const description = note || null;

    await Transaction.insertMany(
      [
        { user: req.user._id, type: "TRANSFER_OUT", amount, status: "COMPLETED", relatedUser: toUserId,       description: description || `Transfer to ${recipient.username}` },
        { user: toUserId,     type: "TRANSFER_IN",  amount, status: "COMPLETED", relatedUser: req.user._id,   description: description || `Transfer from ${sender.username}` },
      ],
      { session }
    );

    await User.findByIdAndUpdate(req.user._id, { $inc: { coinBalance: -amount } }, { session });
    await User.findByIdAndUpdate(toUserId,      { $inc: { coinBalance:  amount } }, { session });

    const updatedSender = await User.findById(req.user._id).select("coinBalance").session(session);

    await session.commitTransaction();

    await notifService.send(toUserId, {
      type:  "COIN_RECEIVED",
      title: "Coins Received 💰",
      body:  `${sender.username} sent you ${amount} coins.`,
      data:  { fromUserId: req.user._id },
    });

    res.status(200).json({
      status: "success",
      data: { message: "Transfer successful.", newBalance: updatedSender.coinBalance },
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

// ── GET /api/coins/history ────────────────────────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const page  = Math.max(1, Number(req.query.page  || 1));
    const limit = Math.min(100, Number(req.query.limit || 20));
    const skip  = (page - 1) * limit;
    const { type } = req.query;

    const filter = { user: req.user._id, ...(type && { type }) };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("relatedUser", "username photoUrl")
        .populate("game", "gameType status"),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      data: { transactions, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
    });
  } catch (err) {
    next(err);
  }
};