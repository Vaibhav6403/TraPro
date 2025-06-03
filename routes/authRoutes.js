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
router.post('/add-location',addLocation);
router.post('/get-locations',getLocations);
router.post('/create-group',createGroup);
router.post('/add-friend',addFriend);
// router.post('/get-friends-location',getFriendLocations)




module.exports = router;