const express = require('express');
const {register,login} = require('../controllers/authController');
const { authenticateToken, authorizeAdmin } = require('../middleware/middleware');
const {createGroup} = require('../controllers/groupController')
const {addLocation,getLocations} = require('../controllers/locationController')
const {addFriend,getFriendLocations} = require('../controllers/friendController')
const router = express.Router();

console.log("inside he auth file")
router.post('/register',register);
router.post('/login',login);
router.post('/add-location',authenticateToken,addLocation);
router.post('/get-locations',authenticateToken,getLocations);
router.post('/create-group',authenticateToken,createGroup);
router.post('/add-friend',authenticateToken,addFriend);
router.post('/get-friends-location',authenticateToken,getFriendLocations)




module.exports = router;