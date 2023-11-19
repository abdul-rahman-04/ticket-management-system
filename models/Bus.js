// This file defines the Mongoose model for the Bus entity, which will be stored in the MongoDB database.

const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  source: String,
  destination: String,
  schedule: [
    { date: String,
      busName: String,
      price: Number, 
      departureTime: String,
      arrivalTime: String,
      duration: String, 
      seatsAvailable: Number
    }]
});

busSchema.methods.checkAvailability = function(date) {
  const scheduleEntry = this.schedule.find(entry => entry.date === date);
  return scheduleEntry ? scheduleEntry.seatsAvailable : 0;
};

busSchema.methods.updateOccupancy = function(date, seatsBooked) {
  const scheduleEntry = this.schedule.find(entry => entry.date === date);
  if (scheduleEntry) {
    scheduleEntry.seatsAvailable -= seatsBooked;
    this.save();
  }
};

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
