const driverModel = require("../../controllers/driverController")

// function to check emailId is unique or Not
const isUniqueEmail = function (email) {
    let isUnique = true 
    for(let i=0 ; i<driverModel.drivers.length ; i++) {
        if(driverModel.drivers[i].email == email) isUnique = false
        else continue
    }
    return isUnique
} 
   
// function to check emailId is unique or Not
const isUniquedrivername = function (driverUniqueName) {
    let isUnique = true 

    for(let i=0 ; i<driverModel.drivers.length ; i++) {
        if(driverModel.drivers[i].driverUniqueName == driverUniqueName) isUnique = false
        else continue
    }
    return isUnique
} 




module.exports.isUniqueEmail = isUniqueEmail
module.exports.isUniquedrivername = isUniquedrivername