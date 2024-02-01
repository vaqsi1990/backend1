const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoute = require('./routes/auth')
const cookieParser = require('cookie-parser')
const app = express();


const DB = "mongodb+srv://vaqsi24:juventus1990@shop.31bo5lw.mongodb.net/anime?w=majority";

app.use(cookieParser())
app.use(express.json())



const allowedOrigins = ['https://capable-medovik-0036f0.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

//midlewares
app.use(cookieParser())
app.use(express.json())

app.use("/", authRoute)


mongoose
  .connect(DB)
  .then(result => {
    app.listen(4500);
    console.log('working');
  })
  .catch(err => {
    console.log(err);
  });
