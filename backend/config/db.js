const mongoose = require("mongoose")

async function connectDB () {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to database ${conn.connection.host}`.cyan.underline)
    }
    catch(error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB