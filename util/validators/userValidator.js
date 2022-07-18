const userModel = require("../../controllers/userController")

// function to check emailId is unique or Not
const isUniqueEmail = function (email) {
    let isUnique = true 

    for(let i=0 ; i<userModel.users.length ; i++) {
        if(userModel.users[i].email == email) isUnique = false
        else continue
    }
    return isUnique
} 
   
// function to check emailId is unique or Not
const isUniqueUsername = function (userName) {
    let isUnique = true 

    for(let i=0 ; i<userModel.users.length ; i++) {
        if(userModel.users[i].userName == userName) isUnique = false
        else continue
    }
    return isUnique
} 




module.exports.isUniqueEmail = isUniqueEmail
module.exports.isUniqueUsername = isUniqueUsername