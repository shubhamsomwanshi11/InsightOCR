const { Router } = require('express');
const fetchFromURL = require('../controllers/FetchfromURL'); // Correct import syntax
const router = Router();

router.get('/getFile', fetchFromURL); // Directly use the function

module.exports = router;
