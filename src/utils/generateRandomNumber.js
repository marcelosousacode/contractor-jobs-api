const crypto = require('crypto');

function generateRandomNumber() {
    return crypto.randomBytes(21)
        .toString('base64')
        .replace(/[^a-z0-9]/gi, "")
        .slice(0, 6);
}

module.exports = { generateRandomNumber }