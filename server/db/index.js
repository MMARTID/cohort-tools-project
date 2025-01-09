// conectarnos a la DB
const mongoose = require("mongoose")

mongoose
.connect('mongodb://127.0.0.1:27017/cohort-tools-api')
.then(response => console.log(`Connected to Database: "${response.connections[0].name}"`))
.catch(error => console.log("Error connecting to MongoDB", error));