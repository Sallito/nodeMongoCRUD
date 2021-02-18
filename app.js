const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')

const admin = require('./routes/admin')

//Configurations

//Session
app.use(session({
    secret: "password",
    resave: true,
    saveUninitialized: true
}))

//Flash
app.use(flash());

//middleware
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
 })

//Body-parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars',handlebars({defaultLayout: "main" }))
app.set('view engine','handlebars');

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/databaseName',{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Connected to database')
}).catch((error)=>{
    console.log(`Error detected:${error}`);
})

//Routes
app.use('/admin',admin)

//others
const PORT = 8082;
app.listen(PORT,() => {
    console.log('Server running')
})



