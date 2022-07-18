const users = [];

const bcrypt = require('bcrypt')
const commonValidator = require("../util/validators/commonValidator")
const userValidator = require("../util/validators/userValidator")
const {encryptPassword} = require("../util/sideHandlers/sideHandler")

 
//  Register user 
const registerUser = async (req, res) => {
    try{
        const reqBody = req.body 

        // Check : reqBody should not be empty
        if(Object.keys(reqBody).length == 0) return res.status(400).send({status:"failed", message:"Please provide user details in body"});

        const {name, userName, email, password, location} = reqBody

        // Any data field is missing or empty (has no value)
        if(!commonValidator.isMissingOrEmpty(name)) return res.status(400).send({status:"failed", message:"Please provide user's full name"});
        if(!commonValidator.isMissingOrEmpty(userName)) return res.status(400).send({status:"failed", message:"Please provide user's userName"});
        if(!commonValidator.isMissingOrEmpty(email)) return res.status(400).send({status:"failed", message:"Please provide user's emailId"});
        if(!commonValidator.isMissingOrEmpty(password)) return res.status(400).send({status:"failed", message:"Please provide user's password"});
        if(!commonValidator.isMissingOrEmpty(location)) return res.status(400).send({status:"failed", message:"Please provide user's location"});

        const {latitude, longitude} = location
        if(!commonValidator.isMissingOrEmpty(latitude)) return res.status(400).send({status:"failed", message:"Please provide user's location's latitude"});
        if(!commonValidator.isMissingOrEmpty(longitude)) return res.status(400).send({status:"failed", message:"Please provide user's location's longitude"});

        // Check provided email is valid email and unique
        if(!commonValidator.isValidEmail(email)) return res.status(400).send({status:"failed", message:"Please provide valid emailId"});
        if(!userValidator.isUniqueEmail(email)) return res.status(400).send({status:"failed", message:"This emailId is already in use, please provide another emailId"});

        // Check provided username  unique
        if(!userValidator.isUniqueUsername(userName)) return res.status(400).send({status:"failed", message:"This username is already in use, please provide another username"});

        // Encrypting Password
        const encryptedPassword = await encryptPassword(password)

        const userToSave = {
            name: name,
            userName: userName,
            email: email,
            password: encryptedPassword,
            location: {
                latitude: latitude,
                longitude: longitude
            },
            billToPay: 0
        }

        //  saving user 
        users.push(userToSave);
        
        res.status(201).send({status:"success", message:"User registered successfully", data: userToSave});
    }
    catch(error) {
        console.log(error);
        res.status(500).send({status: "failed", message: error.message})
    }
}


//  Update user's profile
const updateUser = async (req, res) => {
    try{
        const reqBody = req.body 

        // Check : reqBody should not be empty
        if(Object.keys(reqBody).length == 0) return res.status(400).send({status:"failed", message:"Please provide user details in body"});

        const {name, userName, email, currentPassword, newPassword} = reqBody
        const updates = {}

        //  userName should be provided
        if(!commonValidator.isMissingOrEmpty(userName)) return res.status(400).send({status:"failed", message:"Please provide user's userName"});

        // Check : name
        if(name != null) {
            if(!commonValidator.isMissingOrEmpty(name)) return res.status(400).send({status:"failed", message:"Please provide user's full name"});
            updates['name'] = name
        }
        //  email
        if(email != null) {
            if(!commonValidator.isMissingOrEmpty(email)) return res.status(400).send({status:"failed", message:"Please provide user's emailId"});
            if(!commonValidator.isValidEmail(email)) return res.status(400).send({status:"failed", message:"Please provide valid emailId"});
            if(!commonValidator.isUniqueEmail(email)) return res.status(400).send({status:"failed", message:"This emailId is already in use, please provide another emailId"});
            updates['email'] = email
        }
        //  password
        if(currentPassword != null) {
            if(!commonValidator.isMissingOrEmpty(currentPassword)) return res.status(400).send({status:"failed", message:"Please provide current password"});
            if(!commonValidator.isMissingOrEmpty(newPassword)) return res.status(400).send({status:"failed", message:"Please provide new password"});
            // Check entered current is correct password
            for(let i=0 ; i<users.length ; i++) {
                if(users[i].userName == userName) {
                    let validPassword = await bcrypt.compare(currentPassword, users[i].password);
                    if (!validPassword) return res.status(400).send({ status: false, message: "Wrong password ,please enter correct password..." });
                }
            }
            updates['password'] = newPassword
        }

        // updating user details 
        let isUserExist = false
        for(var i=0 ; i<users.length ; i++) {
            if(users[i].userName == userName) {
                isUserExist = true
                if(updates['name']) users[i].name = updates['name']
                if(updates['email']) users[i].email = updates['email']
                if(updates['password']) users[i].password = updates['password']
                break;
            }
        }
        if(isUserExist == false) return res.status(400).send({status:"failed", message:"user doesn't exist"})

        res.status(200).send({status:"success", message:"user updated successfully", data: users[i]})
    }
    catch(error) {
        console.log(error)
        res.status(500).send({status: "failed", message: error.message})
    }
}


//  Update user's location
const updateUserLocation = async (req, res) => {
    try{
        let reqBody = req.body 
        // Check : reqBody should not be empty
        if(Object.keys(reqBody).length == 0) return res.status(400).send({status:"failed", message:"Please provide user details in body"});
        const {userName, destination} = reqBody

        //  userName, location must be provided
        if(!commonValidator.isMissingOrEmpty(userName)) return res.status(400).send({status:"failed", message:"Please provide user's userName"});
        if(!commonValidator.isMissingOrEmpty(destination)) return res.status(400).send({status:"failed", message:"Please provide user's location"});
        const {latitude, longitude} = destination
        if(!commonValidator.isMissingOrEmpty(latitude)) return res.status(400).send({status:"failed", message:"Please provide user's location's latitude"});
        if(!commonValidator.isMissingOrEmpty(longitude)) return res.status(400).send({status:"failed", message:"Please provide user's location's longitude"});

        // updating user details 
        let isUserExist = false
        for(var i=0 ; i<users.length ; i++) {
            if(users[i].userName == userName) {
                isUserExist = true;
                users[i].location = destination
                break;
            }
        }
        if(isUserExist == false) return res.status(400).send({status:"failed", message:"user doesn't exist"})

        res.status(200).send({status:"success", message:"user's location updated successfully", data: users[i]})
    }
    catch(error) {
        console.log(error)
        res.status(500).send({status: "failed", message: error.message})
    }
}



module.exports.users = users
module.exports.registerUser = registerUser
module.exports.updateUser = updateUser
module.exports.updateUserLocation = updateUserLocation