const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth.js');

const pokerlyticsController = require('../controllers/pokerlyticsController');
const userController = require('../controllers/userController');
const sessionsController = require('../controllers/sessionsController');
const statsController = require('../controllers/statsController');



// User routes - protected
// router.post('/sync-user', authenticateUser, userController.syncUser);   // Ensures backend has the latest user data from Supabase. Use right after login or signup to sync user data from Supabase to your database.
router.get('/user-profile', authenticateUser, userController.getProfile);   // fetch user info
router.put('/user-profile', authenticateUser, userController.updateProfile); // update user info
// router.post('/logout', userController.logout);

// Session routes - protected
router.post('/sessions', authenticateUser, sessionsController.createSession);
router.get('/sessions', authenticateUser, sessionsController.getSessions);
// router.get('/sessions/:Id', authenticateUser, sessionsController.getGameById);

module.exports = router;