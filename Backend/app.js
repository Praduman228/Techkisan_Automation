const express =require('express');

const app = express();
const cors = require('cors');
const path=require('path');
const cookieParser=require('cookie-parser');
const expressSession = require('express-session');
const db=require('./configs/mongoose-connection')
const indexRoute=require("./routes/indexRoute")
const employeesRoute=require("./routes/employeeRoute")
require('dotenv').config()
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cookieParser())
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,

}))
app.use(express.static(path.join(__dirname,"public")));

app.use("/",indexRoute);
app.use("/employees",employeesRoute);


app.listen(8000);