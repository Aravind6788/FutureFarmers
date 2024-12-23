const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const { User, Post, Land } = require('./config');

require("dotenv").config();
// E:\Programming\Web\Real-Time-Projects\Future-Farmers\backend\src\index.js

const { getSuggestionsFromChatGPT } = require('./services/chatgpt');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add session middleware
app.use(
  session({
    secret: '-i&)2(eh1tvf$-4k_6lp$x)!1_2hil%y9dmr7pmto6y@nslm',
    resave: true,
    saveUninitialized: true,
  })
);

// Middleware to set local variables for views
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

// Set up storage using Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  try {
    const usernameToCheck = req.body.username.toLowerCase(); // Convert the entered username to lowercase

    const existingUser = await User.findOne({ name: usernameToCheck });

    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const data = {
      name: usernameToCheck, // Store the lowercase username in the database
      password: hashedPassword,
    };

    const userdata = await User.create(data);
    console.log('User data inserted:', userdata);

    res.redirect('/');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Error during signup');
  }
});


app.post('/login', async (req, res) => {
  try {
    const enteredUsername = req.body.username.toLowerCase(); // Convert the entered username to lowercase for comparison

    const existingUser = await User.findOne({ name: enteredUsername });

    if (!existingUser) {
      return res.status(400).send('User not found');
    }

    const passwordMatch = await bcrypt.compare(req.body.password, existingUser.password);

    if (!passwordMatch) {
      return res.status(400).send('Wrong password');
    }

    // Set the username in the session
    req.session.username = existingUser.name;

    res.render('home', { username: existingUser.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Error during login');
  }
});


app.get('/post', (req, res) => {
  res.render('post');
});

app.post('/post', async (req, res) => {
  try {
    const loggedInUser = req.session.username;

    if (!req.body.postData) {
      return res.status(400).send('Post data cannot be empty');
    }

    const postData = {
      user: loggedInUser,
      data: req.body.postData,
    };

    const postedData = await Post.create(postData);
    console.log('Posted data:', postedData);

    res.redirect('/posts');
  } catch (error) {
    console.error('Post data error:', error);
    res.status(500).send('Error during data posting');
  }
});

app.get('/copy', async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.render('copy', { allPosts });
  } catch (error) {
    console.error('Retrieve posts error:', error);
    res.status(500).send('Error during posts retrieval');
  }
});

//post comments
app.post('/post/:postId/comment', async (req, res) => {
  try {
    const loggedInUser = req.session.username;
    const postId = req.params.postId;

    const commentData = {
      user: loggedInUser,
      comment: req.body.comment,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: commentData } },
      { new: true }
    );

    res.redirect('/posts');
  } catch (error) {
    console.error('Comment data error:', error);
    res.status(500).send('Error during comment posting');
  }
});

//end post comments

app.get('/posts', async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.render('posts', { allPosts });
  } catch (error) {
    console.error('Retrieve posts error:', error);
    res.status(500).send('Error during posts retrieval');
  }
});
app.post("/post/:postId/comment", async (req, res) => {
  try {
    const loggedInUser = req.session.username;
    const postId = req.params.postId;

    const commentData = {
      user: loggedInUser,
      comment: req.body.comment,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: commentData } },
      { new: true }
    );

    // Return the new comment
    res.json(commentData);
  } catch (error) {
    console.error("Comment data error:", error);
    res.status(500).send("Error during comment posting");
  }
});

//lands
app.get('/land', (req, res) => {
  res.render('land');
});

// ... (previous code)

app.post('/land', upload.single('image'), async (req, res) => {
  try {
    console.log('Received form data:', req.body);
    
    const loggedInUser = req.session.username;
    const user = await User.findOne({ name: loggedInUser });

    if (!user) {
      return res.status(400).send('User not found');
    }

    const landData = {
      user: user._id,
      district: req.body.district,
      landType: req.body.landType,
      soilType: req.body.soilType,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      ownerName: req.body.ownerName,
      leasePrice: req.body.leasePrice,
      size: req.body.size,
      irrigationFacilities: req.body.irrigationFacilities,
    };

    if (!req.file) {
      return res.status(400).send('Image not uploaded');
    }

    const image = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    landData.image = image;

    const postedLand = await Land.create(landData);
    console.log('Posted land data:', postedLand);

    res.redirect('/land-posts');
  } catch (error) {
    console.error('Post land data error:', error);
    res.status(500).send('Error during land data posting');
  }
});

// ... (rest of the code)// Modify the /land-posts route
app.get('/land-posts', async (req, res) => {
  try {
    // Ensure that the User model is registered before using it in populate
    const allLandDetails = await Land.find().populate('user', 'name').exec();
    console.log('All Land Details:', allLandDetails);
    res.render('land-posts', { allLandDetails });
  } catch (error) {
    console.error('Retrieve land details error:', error);
    res.status(500).send('Error during land details retrieval');
  }
});
app.get("/land-details/:id", async (req, res) => {
  try {
    const landId = req.params.id;
    const land = await Land.findById(landId).populate("user");

    if (!land) {
      return res.status(404).send("Land not found");
    }

    res.render("land-detail", { land });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
// Serve image data
app.get('/land/:id/image', async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land || !land.image) {
      return res.status(404).send('Image not found');
    }

    res.set('Content-Type', land.image.contentType);
    res.send(land.image.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});
app.post("/api/get-suggestions", async (req, res) => {
  try {
    const { landType, soilType } = req.body;
    console.log("Received request for suggestions:", { landType, soilType }); // Debug log
    const suggestions = await getSuggestionsFromChatGPT(landType, soilType);
    res.json(suggestions);
  } catch (error) {
    console.error("Error in get-suggestions route:", error);
    res.status(500).json({
      crops: "Error fetching recommendations",
      fertilizers: "Error fetching recommendations",
    });
  }
});
const port = 8080;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
