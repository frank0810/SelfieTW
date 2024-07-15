const router = require('express').Router();
const { updateLastPomodoro } = require('../controllers/updateUserController'); // Assicurati che il percorso del controller sia corretto

router.put('/updateLastPomodoro', updateLastPomodoro);

module.exports = router;