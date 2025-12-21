const mongoose = require('mongoose');

const ConnectToDB = async() => {
    await mongoose.connect(process.env.DATABASE_URI)
}

module.exports = ConnectToDB