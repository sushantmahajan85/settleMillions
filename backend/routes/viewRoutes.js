const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authControllers');
const router = express.Router();
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
router.get('/verification', viewController.getVerificationForm);
router.get('/recruitments', authController.protect, viewController.getRecruitmentsData);
router.get('/main', viewController.mainPage);
module.exports = router;