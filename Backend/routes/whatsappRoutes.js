const express = require('express');
const { getStatus } = require('../controllers/whatsappController');

const router = express.Router();

router.get('/status', getStatus);

module.exports = router;
