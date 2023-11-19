const mongoose = require('mongoose');
const Bus = require('../models/Bus');

async function removeExpiredRecords() {
  try {
    const currentDate = new Date();

    // Find and remove records with expiryDateTime less than the current date and time
    const result = await Bus.updateMany(
      { 'schedule.expiryDateTime': { $lt: currentDate } },
      { $pull: { 'schedule': { expiryDateTime: { $lt: currentDate } } } }
    );

    console.log(`${result.nModified} records removed.`);
  } catch (error) {
    console.error('Error removing expired records:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

module.exports = removeExpiredRecords;