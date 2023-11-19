// This file contains the controller functions that handle the business logic for each route.
// Controller functions interact with the MongoDB database through Mongoose models (e.g., Bus model).

const Bus = require('../models/Bus');

// Controller functions
async function getSourceDestinations(req, res) {
  const sourceDestinations = await Bus.find().select('source destination').exec();
  res.json({ sourceDestinations });
}

async function getSchedule(req, res) {
  const { sourceDestination } = req.params;
  const [source, destination] = sourceDestination.split('-');
  const busRoute = await Bus.find({ source, destination });

  if (busRoute.length === 0) {
    // Return a 404 response with a meaningful message
    res.status(404).json({ error: 'Schedule not found for the provided source-destination.' });
  } else {
    const filterSchedule = busRoute[0].schedule.filter(obj => obj.date == req.query.date);
    res.json(filterSchedule);
  }
}

async function getRoutes(req, res) {
  const routes = await Bus.find().distinct('source destination');
  res.json({ routes });
}

async function checkSeatAvailability(req, res) {
  const { busId, date } = req.params;
  const bus = await Bus.findById(busId);
  const seatsAvailable = bus.checkAvailability(date);
  res.json({ seatsAvailable });
}

async function updateSchedule(req, res) {
  const { busId } = req.params;
  const { newSchedule } = req.body;
  await Bus.findByIdAndUpdate(busId, { schedule: newSchedule });
  res.json({ message: 'Schedule updated successfully' });
}

async function manageSeatOccupancy(req, res) {
  const { busId } = req.params;
  const { date, seatsBooked } = req.body;
  const bus = await Bus.findById(busId);
  bus.updateOccupancy(date, seatsBooked);
  res.json({ message: 'Seat occupancy updated successfully' });
}

module.exports = {
  getSourceDestinations,
  getRoutes,
  getSchedule,
  checkSeatAvailability,
  updateSchedule,
  manageSeatOccupancy
};
