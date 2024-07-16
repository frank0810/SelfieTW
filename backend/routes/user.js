const router = require('express').Router();
const { updateLastPomodoro, getUserPomodoro } = require('../controllers/userController'); // Assicurati che il percorso del controller sia corretto

router.put('/updateLastPomodoro', updateLastPomodoro);
router.get('/getUserPomodoro', getUserPomodoro);

module.exports = router;