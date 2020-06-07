var IcStatus = {
    refresh: function () {
        IcStatus.getData()
    },
    getData: function () {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', "https://ipinfo.io/json", true);
    }
}

var Utils = {
    startTime: function () {
        document.getElementById('current_time').innerHTML =
            moment().format('YYYY.MM.DD HH:mm:ss');
        var t = setTimeout(Utils.startTime, 1000);
    },

    refresh: function () {
    },

    onLoad: function () {
        Utils.refresh();
        Utils.startTime();
    }
}

window.onload = Utils.onLoad;
