const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shortUrl = require('./models/shortUrl');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const shortid = require('shortid');

dotenv.config();

const DB_URI = process.env.CONNECTION_STRING;
const PORT = process.env.PORT || 5000;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the homepage
app.get('/', (req, res) => {
  res.render('index');
});

// Redirect to original URL from short URL
app.get('/uri/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const dburl = await shortUrl.findOne({
      short_url: `/uri/${id}`
    });

    if (dburl) {
      // Increment click count
      dburl.url_clicks += 1;
      await dburl.save();

      return res.redirect(dburl.full_url);  // Redirect the user to the original URL
    } else {
      return res.status(404).send('404-URL not found');
    }
  } catch (error) {
    console.error("Error in /uri/:id:", error);
    return res.status(500).send("General server error");
  }
});

// Handle new URL shortening
app.post('/shortUrls', async (req, res) => {
  try {
    const originalUrl = req.body.fullUrl;
    if (originalUrl) {
      const newShorturl = shortid.generate();
      const newUrl = new shortUrl({ full_url: originalUrl, short_url: `/uri/${newShorturl}`, url_clicks: 0 });

      await newUrl.save();

      // Redirect the user directly to the short URL after shortening
      res.redirect(`/uri/${newShorturl}`);
    } else {
      res.status(400).send('No URL provided');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("General server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error, promise) => {
  console.log(error);
});
