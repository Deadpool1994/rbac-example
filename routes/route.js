const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 
router.post('/signup', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.signup);
 
router.post('/login', userController.login);

router.get('/', userController.greeting);
 
router.get('/deathstar', userController.allowIfLoggedin, userController.getDeathStar);
 
router.get('/darkside', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getDarkSide); 
 
module.exports = router;