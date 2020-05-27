function startTime() {

    var today = new Date();
    var Y = today.getFullYear();
    var m = checkTime(today.getMonth());
    var d = checkTime(today.getDay());
    var H = today.getHours();
    var M = checkTime(today.getMinutes());
    var S = checkTime(today.getSeconds());

    document.getElementById('time').innerHTML =
        Y + "." + m + "." + d + H + ":" + M + ":" + S;

    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}
window.onload = startTime;