const User = require("../models/User")
const Location = require("../models/Location")

const addFriend = async (req, res) => {
    try {
        const { username, friendUsername } = req.body;

        if (username == friendUsername) return res.status(400).json({ error: "You can't add yourself as a friend." });

        const user = await User.findOne({ username: username });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const userId = user._id;

        const friend = await User.findOne({ username: friendUsername });
        if (!friend) return res.status(404).json({ error: 'friend user not found' });
        const friendId = friend._id;

        await User.findByIdAndUpdate(userId,
            { $addToSet: { friends: friendId } },
            { new: true })
        res.status(201).json({ message: "Friend Added successfully" });
    }
    catch (error) {
        console.error("the error occured is", error);
    }
}

const getFriendLocations = async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username: username }).populate('friends');
        if (!user) return res.status(404).json({ error: 'User not found' });

        let userFriends = user.friends;
        userFriends.push(user);
        console.log("the friends are",userFriends)
        const locationsArrays = await Promise.all(
            userFriends.map(friend => Location.find({ User: friend._id })) 
        );
        const locations = locationsArrays.flat();

        return res.json({ locations });

    }
    catch (error) {
        console.error("the error occurred in location is", error)
    }

}

module.exports = { addFriend,getFriendLocations }