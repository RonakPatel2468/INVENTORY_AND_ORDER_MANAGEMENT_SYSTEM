const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
    });
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const getUserProfile = async (req, res) => {
    // Get the user ID from the authenticated request
    const userId = req.user._id;

    // Find the user by ID
    const user = await User.findById(userId).select('-password'); // Exclude password from the result

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Send user data as response
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // Add other fields as necessary
    });
};


module.exports = { registerUser, loginUser, getUserProfile };
