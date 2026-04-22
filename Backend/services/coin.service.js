// src/services/coin.service.js
const mongoose = require("mongoose");
const { User, Transaction } = require("../models");
const { AppError } = require("../utils/AppError");

/**
 * Deduct stakeAmount from BOTH players when a game is accepted.
 * Uses a MongoDB session (requires Atlas or replica set).
 */
exports.escrowStake = async (player1Id, player2Id, amount, gameId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [p1, p2] = await Promise.all([
      User.findById(player1Id).session(session),
      User.findById(player2Id).session(session),
    ]);

    if (!p1) throw new AppError("Player 1 not found", 404);
    if (!p2) throw new AppError("Player 2 not found", 404);
    if (p1.coinBalance < amount) throw new AppError(`${p1.username} has insufficient coins`, 400);
    if (p2.coinBalance < amount) throw new AppError(`${p2.username} has insufficient coins`, 400);

    await Promise.all([
      User.findByIdAndUpdate(player1Id, { $inc: { coinBalance: -amount } }, { session }),
      User.findByIdAndUpdate(player2Id, { $inc: { coinBalance: -amount } }, { session }),
      Transaction.insertMany(
        [
          {
            user: player1Id, type: "GAME_STAKE", amount,
            status: "PENDING", game: gameId, description: "Stake escrowed for game",
          },
          {
            user: player2Id, type: "GAME_STAKE", amount,
            status: "PENDING", game: gameId, description: "Stake escrowed for game",
          },
        ],
        { session }
      ),
    ]);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Award prize (2× stakeAmount) to winner after moderator decides.
 */
exports.settleStake = async (gameId, winnerId, stakeAmount) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const prize = stakeAmount * 2;

    await Promise.all([
      // Mark both stake transactions as completed
      Transaction.updateMany(
        { game: gameId, type: "GAME_STAKE" },
        { status: "COMPLETED" },
        { session }
      ),
      // Credit winner
      User.findByIdAndUpdate(winnerId, { $inc: { coinBalance: prize } }, { session }),
      // Record win transaction
      Transaction.create(
        [{
          user: winnerId, type: "GAME_WIN", amount: prize,
          status: "COMPLETED", game: gameId,
          description: `Game won — prize: ${prize} coins`,
        }],
        { session }
      ),
    ]);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * Refund both players if a game is cancelled before it starts.
 */
exports.refundStake = async (gameId, player1Id, player2Id, amount) => {
  if (amount <= 0) return;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Promise.all([
      User.findByIdAndUpdate(player1Id, { $inc: { coinBalance: amount } }, { session }),
      User.findByIdAndUpdate(player2Id, { $inc: { coinBalance: amount } }, { session }),
      Transaction.updateMany(
        { game: gameId, type: "GAME_STAKE" },
        { status: "REVERSED" },
        { session }
      ),
    ]);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};