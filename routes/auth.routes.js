const express = require('express');
const { forgotPassword } = require('../controller/authController');

const router = express.Router();




router.put('/forgot-password', forgotPassword);




module.exports = router;
