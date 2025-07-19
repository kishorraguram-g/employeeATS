
const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/UserController');
const router = express.Router();
router.post('/create', authController.staffProtect, authController.signup);
router.post('/login', authController.login);
router.get('/me', authController.protect, authController.getMe);
router.post('/updatepassword', authController.protect, authController.updatePassword);
router.patch('/employees/:id', authController.protect, authController.updateUser);
router.delete('/employees/:id', authController.protect, userController.deleteUser);
module.exports = router;
