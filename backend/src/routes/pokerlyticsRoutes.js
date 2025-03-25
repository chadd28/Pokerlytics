const express = require('express');
const router = express.Router();
const pokerlyticsController = require('../controllers/pokerlyticsController');

router.get('/sessions', pokerlyticsController.getSessionData);

module.exports = router;