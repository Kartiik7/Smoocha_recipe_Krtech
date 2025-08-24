const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const refreshRoutes = require('./routes/refresh');
const recipeFilter = require('./routes/recipe');
const authRoutes = require("./routes/authRoutes");
const suggestionRoutes = require("./routes/suggestionRoutes");
const recipeRoutes = require("./routes/recipeRoutes");

require('dotenv').config();

const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Import the Recipe model
const Recipe = require('./models/Recipe');

// Middlewares
// Allow credentials and flexible origin to support frontend served from this app
app.use(cors({ origin: true, credentials: true }));
// Serve the frontend static files under /frontend so existing links like
// /frontend/views/index.html continue to work without changing markup.
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/refresh', refreshRoutes);
app.use('/api/auth', authRoutes); // keep only for other auth endpoints if needed
app.use('/api/recipesFilter', recipeFilter);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/recipes", recipeRoutes);


// Test route
app.get('/', (req, res) => {
    res.send("Recipe backend running");
});

// API endpoint to get a recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
