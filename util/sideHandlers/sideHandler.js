const bcrypt = require("bcrypt")

// function to encrypt password 
const encryptPassword = async function (password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
}


module.exports.encryptPassword = encryptPassword