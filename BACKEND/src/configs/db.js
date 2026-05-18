const mongoose = require("mongoose");

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, { family: 4 })
        console.log("Connected to MongoDb")
    }catch(err){
        console.log("Error connecting to MongoDb",err)
        process.exit(1);
    }

}

module.exports = connectDb ;
