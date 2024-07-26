const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.post('/create', noteController.createNote);
router.delete('/delete/:noteId', noteController.deleteNote);
router.put('/update/:noteId', noteController.updateNote);


module.exports = router;