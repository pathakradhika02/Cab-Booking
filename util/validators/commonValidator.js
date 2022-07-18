// function to check any data field is missing or has no value
const isMissingOrEmpty = function (value) {
    if (typeof (value) === 'undefined' || typeof (value) === 'null') return false
    else if (typeof (value) === 'string' && value.trim().length > 0) return true
    else if (typeof (value) === 'object' && Object.keys(value).length > 0) return true
}


// function to check email is valid email 
const isValidEmail = function (email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return true
}





module.exports.isMissingOrEmpty = isMissingOrEmpty
module.exports.isValidEmail = isValidEmail