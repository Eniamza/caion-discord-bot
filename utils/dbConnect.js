const mongoose = require('mongoose');

console.log(process.env.DBUSER);

const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@xurd.ifcmpjv.mongodb.net/caion?retryWrites=true&w=majority&appName=xurd`
const connectDB = async () => {
    try {
        await mongoose.connect(url, {
           
        });
        console.log('Database is connected');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
};

module.exports = connectDB;