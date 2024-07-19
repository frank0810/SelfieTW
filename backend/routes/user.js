const router = require('express').Router();
const { updateLastPomodoro, getUserPomodoro, updateBirthday, updateProfilePic, updateUsername, getUserData } = require('../controllers/userController'); // Assicurati che il percorso del controller sia corretto

router.put('/updateLastPomodoro', updateLastPomodoro);
router.get('/getUserPomodoro', getUserPomodoro);
router.put('/updateBirthday', updateBirthday);        
router.put('/updateProfilePic', updateProfilePic);    
router.put('/updateUsername', updateUsername);
router.get('/getUserData', getUserData);

module.exports = router;