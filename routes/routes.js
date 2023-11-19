// This file defines the API routes for your application using the Express Router.
// It imports controller functions to handle specific route actions (e.g., getting routes, updating schedules).
const express = require('express');
const router = express.Router();
const {
  getSourceDestinations,
  getSchedule,
  checkSeatAvailability,
  updateSchedule,
  manageSeatOccupancy
} = require('../controllers/controller');

// Define routes
// fetching available routes, schedules, checking seat availability, updating schedules, and managing seat occupancy.
router.get('/source-destinations', getSourceDestinations);
router.get('/schedule/:sourceDestination', getSchedule);
router.get('/availability/:busId/:date', checkSeatAvailability);
router.put('/update-schedule/:busId', updateSchedule);
router.put('/manage-occupancy/:busId', manageSeatOccupancy);

module.exports = router;