// DECLARING MODULES
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');
const morgan = require(`morgan`);
const bodyParser = require(`body-parser`);
const cookieParser = require(`cookie-parser`);
const expressValidator = require(`express-validator`);
const cors = require('cors')
dotenv.config();


// IMPORT USER ROUTE
const authRoutes = require(`./routes/auth`);
const userRoutes = require(`./routes/user`);
const categoryRoutes = require(`./routes/category`)
const productRoutes = require(`./routes/product`);



const app = express()

// DATABASE
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(chalk.yellow('DATABASE don connect sha!')));

mongoose.connection.on(`error`, err => {
  console.log(chalk(`DB connection error : ${err.message}`))
})

// MIDDLEWARE
app.use(expressValidator())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// ROUTES MIDDLEWARE
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);


// PORT
const port = process.env.PORT || 8000

app.listen(8000, () => {
  console.log(chalk.yellow('App listening on port 8080!'));
});