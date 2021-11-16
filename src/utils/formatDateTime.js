function formatDate(date = new Date()) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatToHours(date = new Date(), seconds = true) {
    let h = new Date(date)

    let hour = h.getHours()
    let minute = h.getMinutes()
    let second = h.getSeconds()

    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = '0' + second;

    if(seconds) return [hour, minute, second].join(':');
    if(!seconds) return [hour, minute].join(':');
}

module.exports = { formatDate, formatToHours }