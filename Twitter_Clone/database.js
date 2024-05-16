const mongoose = require('mongoose');


const connectionString = "mongodb://localhost:27017/TwitterDB";

class Database {
    constructor(){
        this.connect().then(console.log).catch(console.error);
    }

    async connect(){
        await mongoose.connect(connectionString);
        return 'Connected to twitter database!'
    }
}

module.exports = new Database()