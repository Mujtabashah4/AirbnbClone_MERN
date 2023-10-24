const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader')
const multer = require('multer')
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const User = require('./models/User.js')
require('dotenv').config();


const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = 'kasgdgk5431qf@#$%vdajfffkyf'


app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.log(err))


app.get('/test', (req, res) => {
    res.json('test ok')
})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userCreated = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
        res.json(userCreated)
    }
    catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).send(error)
    }
})

app.post('/login', async (req, res) => {

    const { email, password } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        const passCheck = bcrypt.compareSync(password, userExists.password)
        if (passCheck) {

            jwt.sign({
                email: userExists.email,
                id: userExists._id,
                name: userExists.name
            }, jwtSecret, {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).status(StatusCodes.OK).json(userExists);
                })



        } else {
            // res.status(401).json('Password incorrect')
            res.status(StatusCodes.UNAUTHORIZED).send('Password incorrect')
        }
    }
    else {
        res.json('Not Found')
    }

})
// profile api
app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id)


            res.json({ name, email, _id });
        })
    }
    else {
        res.json(null);
    }
})
//logout api

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})

//uploads
app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = "photo" + Date.now() + '.jpg'
    console.log(__dirname);
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,

    });
    res.json(newName)
})
const photosMiddleware = multer({ dest: 'uploads' })
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    console.log(req.files);
    res.json(req.files);
})


app.listen(4000);