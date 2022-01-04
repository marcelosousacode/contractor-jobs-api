function formatPhoneNumber(oldPhone) {
    let formattedPhone = oldPhone.replace(/[() -]/g, '');
    if (!formattedPhone.match(/[+55]/g)) {
        formattedPhone = `+55${formattedPhone}`
    }

    return formattedPhone;
}

module.exports = { formatPhoneNumber }