const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;
console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
    .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error(`Connection Error: ${error.name}: ${error.message}`);
        if (error.codeName) console.error(`CodeName: ${error.codeName}`);
        console.error(error);
        process.exit(1);
    });
