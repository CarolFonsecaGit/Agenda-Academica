const express = require('express');
const router = express.Router();
const eventService = require("../services/eventService");

router.get('/', eventService.getEvents);
router.post('/', eventService.createEvent);
router.put('/:id', eventService.updateEvent);
router.delete('/:id', eventService.deleteEvent);

module.exports = router;