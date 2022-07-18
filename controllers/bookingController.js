const userModel = require("../controllers/userController")
const users = userModel.users
const driverModel = require("../controllers/driverController")
const drivers = driverModel.drivers

const commonValidator = require("../util/validators/commonValidator")
const axios = require("axios")


// find drivers
const findAvailableDrivers = async (req, res) => {
    try {
        const reqBody = req.body;

        // Check : reqBody should not be empty
        if (Object.keys(reqBody).length == 0) return res.status(400).send({ status: "failed", message: "Please provide user details in body" });
        const { userName, source, destination } = reqBody

        //  userName, location must be provided
        if (!commonValidator.isMissingOrEmpty(userName)) return res.status(400).send({ status: "failed", message: "Please provide user's userName" });
        if (!commonValidator.isMissingOrEmpty(source)) return res.status(400).send({ status: "failed", message: "Please provide user's source" });
        if (!commonValidator.isMissingOrEmpty(destination)) return res.status(400).send({ status: "failed", message: "Please provide user's destination" });
        if (!commonValidator.isMissingOrEmpty(source.latitude)) return res.status(400).send({ status: "failed", message: "Please provide user's source's latitude" });
        if (!commonValidator.isMissingOrEmpty(source.longitude)) return res.status(400).send({ status: "failed", message: "Please provide user's source's longitude" });
        if (!commonValidator.isMissingOrEmpty(destination.latitude)) return res.status(400).send({ status: "failed", message: "Please provide user's destination's latitude" });
        if (!commonValidator.isMissingOrEmpty(destination.longitude)) return res.status(400).send({ status: "failed", message: "Please provide user's destination's longitude" });

        let isUserExist = false
        // user must be present
        for (var i = 0; i < users.length; i++) {
            if (users[i].userName == userName) {
                isUserExist = true
                break;
            }
        }
        if (isUserExist == false) return res.status(400).send({ status: "failed", message: "user doesn't exist" });

        const availableDrivers = []
        // finding available drivers
        for (let i = 0; i < drivers.length; i++) {
            let x1 = source.latitude
            let y1 = source.longitude
            let x2 = drivers[i].location.latitude
            let y2 = drivers[i].location.longitude

            let distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))

            if (distance <= 5 && drivers[i].status == "free") availableDrivers.push(drivers[i])
        }

        if (availableDrivers.length == 0) return res.status(200).send({ status: "failed", message: "No driver available near your location" })
        res.status(200).send({ status: "failed", message: "Available driver's information", data: availableDrivers })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: "failed", message: error.message })
    }
}

// choosse ride
const chooseRide = async (req, res) => {
    try {
        const reqBody = req.body
        const user = reqBody.userName
        const driver = reqBody.driverUniqueName

        //  Check : user and driver must be present 
        if (!commonValidator.isMissingOrEmpty(user)) return res.status(400).send({ status: "failed", message: "Please provide user's userName" });
        if (!commonValidator.isMissingOrEmpty(driver)) return res.status(400).send({ status: "failed", message: "Please provide driver's uniqueName" });

        let isUserExist = false
        // user must be present
        for (var i = 0; i < users.length; i++) {
            if (users[i].userName == user) {
                isUserExist = true
                break;
            }
        }
        if (isUserExist == false) return res.status(400).send({ status: "failed", message: "user doesn't exist" })
        // driver must be present if present update its status
        let isDriverExist = false
        for (var i = 0; i < drivers.length; i++) {
            if (drivers[i].driverUniqueName == driver) {
                isDriverExist = true
                break;
            }
        }
        //  Upadate driver's status as booked
        axios.post('http://localhost:3000/driver/updatestatus', {
            driverUniqueName: driver, status: "booked"
        }).then((response) => { }).catch((error) => { console.log(error); })

        if (isDriverExist == false) return res.status(400).send({ status: "failed", message: "driver doesn't exist" })

        res.status(200).send({ status: "success", message: "Ride Started" })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: "failed", message: error.message });
    }
}

// calculate bill
const calculateBill = async (req, res) => {
    try {
        const reqBody = req.body

        // Check : reqBody should not be empty
        if (Object.keys(reqBody).length == 0) return res.status(400).send({ status: "failed", message: "Please provide user details in body" });
        const { userName, driverUniqueName, source, destination } = reqBody

        //  userName, location must be provided
        if (!commonValidator.isMissingOrEmpty(userName)) return res.status(400).send({ status: "failed", message: "Please provide user's userName" });
        if (!commonValidator.isMissingOrEmpty(driverUniqueName)) return res.status(400).send({ status: "failed", message: "Please provide drivers's unique name" });
        if (!commonValidator.isMissingOrEmpty(source)) return res.status(400).send({ status: "failed", message: "Please provide user's source" });
        if (!commonValidator.isMissingOrEmpty(destination)) return res.status(400).send({ status: "failed", message: "Please provide user's destination" });
        if (!commonValidator.isMissingOrEmpty(source.latitude)) return res.status(400).send({ status: "failed", message: "Please provide user's source's latitude" });
        if (!commonValidator.isMissingOrEmpty(source.longitude)) return res.status(400).send({ status: "failed", message: "Please provide user's source's longitude" });
        if (!commonValidator.isMissingOrEmpty(destination.latitude)) return res.status(400).send({ status: "failed", message: "Please provide user's destination's latitude" });
        if (!commonValidator.isMissingOrEmpty(destination.longitude)) return res.status(400).send({ status: "failed", message: "Please provide user's destination's longitude" });

        // user must be present
        let isUserExist = false
        for (var i = 0; i < users.length; i++) {
            if (users[i].userName == userName) {
                isUserExist = true
                break;
            }
        }
        if (isUserExist == false) return res.status(500).send({ status: "failed", message: "user doesn't exist" })
        // driver must be present
        let isDriverExist = false
        for (var i = 0; i < drivers.length; i++) {
            if (drivers[i].driverUniqueName == driverUniqueName) {
                isDriverExist = true
                break;
            }
        }
        if (isDriverExist == false) return res.status(500).send({ status: "failed", message: "driver doesn't exist" })

        // calculate bill
        const x1 = source.latitude
        const y1 = source.longitude
        const x2 = destination.latitude
        const y2 = destination.longitude

        const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
        const totalBill = distance

        //  Update driver's and user's location to its destination after billing

        axios.post('http://localhost:3000/user/updatelocation', reqBody).then((response) => { }).catch((error) => { console.log(error); })
        axios.post('http://localhost:3000/driver/updatelocation', reqBody).then((response) => { }).catch((error) => { console.log(error); })

        //  Upadate driver's status
        axios.post('http://localhost:3000/driver/updatestatus', {
            driverUniqueName: driverUniqueName, status: "free"
        }).then((response) => { }).catch((error) => { console.log(error); })

        // Update driver's earning
        for (var i = 0; i < drivers.length; i++) {
            if (drivers[i].driverUniqueName == driverUniqueName) {
                drivers[i].totalEarning.earning += totalBill
                break;
            }
        }

        res.status(200).send({ status: "failed", message: "Total bill", data: { bill: "$"+totalBill} })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: "failed", message: error.message })
    }
}


module.exports.findAvailableDrivers = findAvailableDrivers
module.exports.chooseRide = chooseRide
module.exports.calculateBill = calculateBill