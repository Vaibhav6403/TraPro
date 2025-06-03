const Location = require('../models/Location')
const User = require('../models/User')
const Locations = require('../models/Location')
const mongoose = require('mongoose');

const addLocation = async (req, res) => {
    const { name, latitude, longitude, category, preference, price, persons, username } = req.body;
    try {
        console.log("the username is", username)
        let userExists = await User.findOne({ username });
        console.log(userExists);
        if (!userExists) {
            res.status(400).json({ message: 'The user is not found' });
        }
        const newLocation = await Location.create({
            name, location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            }, category, preference, price, persons, User: userExists._id
        });
        res.status(201).json(newLocation);

    }
    catch (error) {
        console.error("the error occured during location save is", error);
        res.status(500).json({ message: "Something went wrong" })
    }

}
const getLocations = async (req, res) => {
    try {
        let { username } = req.body;
        let userExists = await User.findOne({ username });
        if (!userExists) return res.status(400).json({ message: "User does not Exists" });
        
        const userId = userExists._id;
        const locations = await Locations.find({ User: userId })
        console.log(locations)
        res.json({ locations: locations });
        
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "the error occured is", error })
    }

}
module.exports = { addLocation, getLocations }