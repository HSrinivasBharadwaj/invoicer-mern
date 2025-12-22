require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const AuthRouter = require('./routes/auth');
const connectToDb = require('./config/database');


app.use(express.json())
app.use(cookieParser())
app.use("/",AuthRouter)

connectToDb().then(() => {
    app.listen(process.env.PORT,() => {
        console.log("Database successfully connected and Listening on port",process.env.PORT)
    })
})
.catch((error) => {
    console.log("error",error)
})

