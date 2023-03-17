const mongoose = require("mongoose")
const express = require("express")
const app = express()


const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config();

//DB
mongoose.connect(process.env.DATABASE, {
}).then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log("Unable to connect to DB " + err)
})

//Use parsing middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//Importing routes
const userRoutes = require("./routes/user")
const profileRoutes = require("./routes/profile")
const loanRoutes = require("./routes/loan")
const cibilRoutes = require( "./routes/cibil" )

//Using routes
app.use('/api/auth', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/loan', loanRoutes)
app.use('/api/cibil' , cibilRoutes)


const port = process.env.PORT || 8000

//Starting a server
app.listen(port, () => {
    console.log(`App is running at ${port}`)
})

