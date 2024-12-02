const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// MongoDB Connection (Updated)
mongoose.connect('mongodb://localhost:27017/login-auth')
    .then(() => {
        console.log('Connected to MongoDB'); // Log when MongoDB connection is successful
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err); // Log if there is an error connecting to MongoDB
    });

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Model
const User = mongoose.model('User', userSchema);

// Register Route
app.post('/register', async (req, res) => {
    console.log("Registering new user..."); // Log the registration process
    const { username, password } = req.body;

    // Log username and password to confirm the request
    console.log("Received registration request: ", { username, password });

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, password: hashedPassword });

        await user.save();
        console.log("User successfully registered:", username); // Log successful registration
        res.status(201).send('User registered');
    } catch (err) {
        console.log("Error registering user:", err); // Log any errors during registration
        res.status(400).send('Error registering user: ' + err.message);
    }
});

// Login Route
app.post('/login', async (req, res) => {
    console.log("Attempting login..."); // Log the login attempt
    const { username, password } = req.body;

    // Log username and password to confirm the login attempt
    console.log("Received login request for user:", username);

    try {
        const user = await User.findOne({ username });

        if (!user) {
            console.log("User not found: ", username); // Log if the user is not found
            return res.status(401).send('Invalid credentials');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log("Login successful for user:", username); // Log successful login
            res.status(200).send('Login successful');
        } else {
            console.log("Incorrect password for user:", username); // Log incorrect password
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.log("Error during login attempt:", err); // Log any errors during login
        res.status(500).send('Error logging in: ' + err.message);
    }
});

// Secured Route (Only accessible if logged in)
app.get('/secured', (req, res) => {
    // Normally, you would check for session or JWT here
    console.log("Accessing secured route..."); // Log when this route is accessed
    res.send('Welcome to the secured page!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
