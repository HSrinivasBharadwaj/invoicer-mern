require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const AuthRouter = require('./routes/auth');
const ProfileRouter = require('./routes/profile');
const ClientRouter = require('./routes/client');
const InvoiceRouter = require('./routes/invoices');
const connectToDb = require('./config/database');

app.use(express.json())
app.use(cookieParser())
app.use("/",AuthRouter);
app.use("/",ProfileRouter);
app.use("/",ClientRouter);
app.use("/",InvoiceRouter);

connectToDb().then(() => {
    app.listen(process.env.PORT,() => {
        console.log("Database successfully connected and Listening on port",process.env.PORT)
    })
})
.catch((error) => {
    console.log("error",error)
})

