const driverModel = require("../controllers/driverController")
const drivers = driverModel.drivers


//  total earning
const calculateTotalEarningByDrivers = async (req, res) => {
    try{
        const result = [];

        for(let i=0 ; i<drivers.length ; i++) {
            earning = drivers[i].totalEarning.earning
            result.push(`${i+1} .  ` + `${drivers[i].driverUniqueName} earn $${earning}` )
        }
        res.status(200).send({status:"success", message: "Total earnings", data:result});
    }
    catch(error) {
        console.log(error);
        res.status(500).send({status:"failed", message: error.message});
    }
}

module.exports.calculateTotalEarningByDrivers = calculateTotalEarningByDrivers