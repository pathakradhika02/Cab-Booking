const drivers = [];

const bcrypt = require('bcrypt')
const commonValidator = require("../util/validators/commonValidator")
const driverValidator = require("../util/validators/driverValidator")
const {encryptPassword} = require("../util/sideHandlers/sideHandler")


//  Register driver 
const registerDriver = async (req, res) => {
    try{
        const reqBody = req.body 

        // Check : reqBody should not be empty
        if(Object.keys(reqBody).length == 0) return res.status(400).send({status:"failed", message:"Please provide driver details in body"});

        const {name,vehicle, driverUniqueName, email, password, location, status} = reqBody

        // Any data field is missing or empty (has no value)
        if(!commonValidator.isMissingOrEmpty(name)) return res.status(400).send({status:"failed", message:"Please provide driver's full name"});
        if(!commonValidator.isMissingOrEmpty(vehicle)) return res.status(400).send({status:"failed", message:"Please provide driver's vehicle"});
        if(!commonValidator.isMissingOrEmpty(driverUniqueName)) return res.status(400).send({status:"failed", message:"Please provide driver's driverUniqueName"});
        if(!commonValidator.isMissingOrEmpty(email)) return res.status(400).send({status:"failed", message:"Please provide driver's emailId"});
        if(!commonValidator.isMissingOrEmpty(password)) return res.status(400).send({status:"failed", message:"Please provide driver's password"});
        if(!commonValidator.isMissingOrEmpty(location)) return res.status(400).send({status:"failed", message:"Please provide driver's location"});

        const {latitude, longitude} = location
        if(!commonValidator.isMissingOrEmpty(latitude)) return res.status(400).send({status:"failed", message:"Please provide driver's location's latitude"});
        if(!commonValidator.isMissingOrEmpty(longitude)) return res.status(400).send({status:"failed", message:"Please provide driver's location's longitude"});

        // Check provided email is valid email and unique
        if(!commonValidator.isValidEmail(email)) return res.status(400).send({status:"failed", message:"Please provide valid emailId"});
        if(!driverValidator.isUniqueEmail(email)) return res.status(400).send({status:"failed", message:"This emailId is already in use, please provide another emailId"});

        // Check provided username is valid email and unique
        if(!driverValidator.isUniquedrivername(driverUniqueName)) return res.status(400).send({status:"failed", message:"This username is already in use, please provide another username"});

        // Encrypting Password
        const encryptedPassword = await encryptPassword(password)

        const driverToBeSave = {
            name: name,
            vehicle: vehicle,
            driverUniqueName: driverUniqueName,
            status: "free",
            email: email,
            password: encryptedPassword,
            location: {
                latitude: latitude,
                longitude: longitude
            },
            totalEarning: {
                earning : 0,
                unit : "$"
            }
        }

        //  saving driver 
        drivers.push(driverToBeSave);
        
        res.status(201).send({status:"success", message:"User registered successfully", data: driverToBeSave});
    }
    catch(error) {
        console.log(error);
        res.status(500).send({status: "failed", message: error.message})
    }
}

//  Update driver's location
const updateDriverLocation = async (req, res) => {
    try{
        const reqBody = req.body 

        // Check : reqBody should not be empty
        if(Object.keys(reqBody).length == 0) return res.status(400).send({status:"failed", message:"Please provide driver's details in body"});        const {driverUniqueName, destination} = reqBody

        //  userName, location must be provided
        if(!commonValidator.isMissingOrEmpty(driverUniqueName)) return res.status(400).send({status:"failed", message:"Please provide driver's unique name"});
        if(!commonValidator.isMissingOrEmpty(destination)) return res.status(400).send({status:"failed", message:"Please provide driver's location"});
        const {latitude, longitude} = destination
        if(!commonValidator.isMissingOrEmpty(latitude)) return res.status(400).send({status:"failed", message:"Please provide driver's location's latitude"});
        if(!commonValidator.isMissingOrEmpty(longitude)) return res.status(400).send({status:"failed", message:"Please provide driver's location's longitude"});

        // updating driver details 
        let isUserExist = false
        for(var i=0 ; i<drivers.length ; i++) {
            if(drivers[i].driverUniqueName == driverUniqueName) {
                isUserExist = true;
                drivers[i].location = destination
                break;
            }
        }
        if(isUserExist == false) return res.status(400).send({status:"failed", message:"driver doesn't exist"})

        res.status(200).send({status:"success", message:"driver's location updated successfully", data: drivers[i]})
    }
    catch(error) {
        console.log(error)
        res.status(500).send({status: "failed", message: error.message})
    }
}

//  Update driver's location
const updateDriverStatus = async (req, res) => {
    try{
        const reqBody = req.body 

        // Check : reqBody should not be empty
        if(Object.keys(reqBody).length == 0) return res.status(400).send({status:"failed", message:"Please provide driver's details in body"});

        const {driverUniqueName, status} = reqBody

        //  userName, location must be provided
        if(!commonValidator.isMissingOrEmpty(driverUniqueName)) return res.status(400).send({status:"failed", message:"Please provide driver's unique Name"});
        if(!commonValidator.isMissingOrEmpty(status)) return res.status(400).send({status:"failed", message:"Please provide driver's status"});
        // Check : valid status
        if(!(status == "free" || status == "booked"))return res.status(400).send({status:"failed", message:"Please provide valid status(available/unavailable)"});

        // updating driver details 
        let isUserExist = false
        for(var i=0 ; i<drivers.length ; i++) {
            if(drivers[i].driverUniqueName == driverUniqueName) {
                isUserExist = true;
                drivers[i].status = status
                break;
            }
        }
        if(isUserExist == false) return res.status(400).send({status:"failed", message:"driver doesn't exist"})

        res.status(200).send({status:"success", message:"driver's location updated successfully", data: drivers[i]})
    }
    catch(error) {
        console.log(error)
        res.status(500).send({status: "failed", message: error.message})
    }
}



module.exports.drivers = drivers
module.exports.registerDriver = registerDriver
module.exports.updateDriverLocation = updateDriverLocation
module.exports.updateDriverStatus = updateDriverStatus