// DECLARING MODULES
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');
const morgan = require(`morgan`);
const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);
const expressValidator = require(`express-validator`);
dotenv.config();


// IMPORT USER ROUTE
const authRoutes = require(`./routes/auth`);
const userRoutes = require(`./routes/user`)



const app = express()

// DATABASE
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(chalk.yellow('The Database is Connected!!')));

mongoose.connection.on(`error`, err => {
  console.log(chalk(`DB connection error : ${err.message}`))
})

// MIDDLEWARE
app.use(expressValidator())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

// ROUTES MIDDLEWARE
app.use("/api", authRoutes);
app.use("/api", userRoutes);


// PORT
const port = process.env.PORT || 8000

app.listen(8000, () => {
  console.log('App listening on port 8080!');
});