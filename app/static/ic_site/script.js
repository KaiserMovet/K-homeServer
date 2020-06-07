function startTime() {
    document.getElementById('time').innerHTML =
        moment().format('YYYY.MM.DD HH:mm:ss');
    var t = setTimeout(startTime, 1000);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

