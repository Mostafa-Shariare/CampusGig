const mongoose = require("mongoose");

const conn = async () => {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("Database connected");
    } catch (error) {
        console.log(error.message);
        console.log("Database not connected");
        
    }
}

conn()