const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const shortUrl = require('./models/shortUrl');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const shortid = require('shortid')

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
app.use(express.urlencoded({extended: false}))

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});
// express js dynamic routes
app.get('/uri/:id', async (req, res) => {
   const {id} = req.params;
   try{
        const dburl = await shortUrl.findOne({
            short_url: `/uri/${id}`
        });
        if (dburl){
            return res.redirect(dburl.full_url);
        } else {
            return res.status(404).send('404-URL not found');
        }
    }catch (error){
        console.error("Erorr generated from /server.js func app.get('/uri/:id'):", error);
        return res.status(500).send("General server error")
    }
});

app.post('/shortUrls', async (req, res) => {
    try {
        const originalUrl = req.body.fullUrl;
        if (originalUrl) {
            const newShorturl = shortid.generate()
            const newUrl = new shortUrl({full_url: originalUrl, short_url: `/uri/${newShorturl}`});
            await newUrl.save();
            res.status(200).send({msg: `http://localhost:${PORT}/uri/${newShorturl}`});
        } else {
            res.status(400).send('No URL provided');
        }
    } catch(err) {
        console.log(err)
        res.status(500).send("General server error")
    }

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (error, promise ) => {
    console.log(error)
})