

var MainMsg = {
    setEmoji: function (status) {
        emoji = document.getElementById("emoji");
        if (status) {
            emoji_code = '<svg class="bi bi-emoji-laughing" width="2em" height="2em" viewBox="0 0 16 16"fill = "currentColor" xmlns = "http://www.w3.org/2000/svg" ><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path fill-rule="evenodd" d="M12.331 9.5a1 1 0 0 1 0 1A4.998 4.998 0 0 1 8 13a4.998 4.998 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5z" /><path d="M7 6.5c0 .828-.448 0-1 0s-1 .828-1 0S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 0-1 0s-1 .828-1 0S9.448 5 10 5s1 .672 1 1.5z" /></svg > ';
        } else {
            emoji_code = '<svg class="bi bi-emoji-frown" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path fill-rule="evenodd" d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683z" /><path d="M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" /></svg>'
        }
        emoji.innerHTML = emoji_code;
    },

    setSpeed: function (upload, download) {
        document.getElementById("last_download").innerHTML = download + " Mb/s";
        document.getElementById("last_upload").innerHTML = upload + " Mb/s";
    },

    setCurrentLength: function (duration_msg, status) {
        el = document.getElementById("current_length_msg");
        msg = "For ";
        msg += duration_msg;
        el.innerHTML = msg;
    },

    setStatus: function (status) {
        main_msg = document.getElementById("main_msg");
        last_speed = document.getElementById("last_speed");
        status_msg = document.getElementById("current_status");
        this.setEmoji(status);
        if (status) {
            main_msg.classList.remove("alert-danger");
            main_msg.classList.add("alert-success");
            last_speed.classList.remove("invisible");
            last_speed.classList.add("visible");
            status_msg.innerHTML = "OK!"
        } else {
            main_msg.classList.remove("alert-success");
            main_msg.classList.add("alert-danger");
            last_speed.classList.remove("visible");
            last_speed.classList.add("invisible");
            status_msg.innerHTML = "No connection"
        }
    },

}

var SpeedStatus = {

    strToMoment: function (date) {
        return moment(date,
            'YYYY.MM.DD HH:mm:ss').seconds(0);
    },

    getPlugin: function () {
        plugins = {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                    // TODO: Add Boundries
                    rangeMin: {
                        x: null,
                        y: null
                    },
                    rangeMax: {
                        x: null,
                        y: null
                    },
                    speed: 20,
                    threshold: 10,
                },
                zoom: {
                    enabled: true,
                    drag: false,
                    mode: 'x',
                    // TODO: Add Boundries
                    rangeMin: {
                        x: null,
                        y: null
                    },
                    rangeMax: {
                        x: null,
                        y: null
                    },
                    speed: 0.1,
                    threshold: 2,
                    sensitivity: 3,
                }
            }
        };
        return plugins;
    },

    createChartObj: function (ctx, data_collection, start_date, end_date) {
        new Chart(ctx, {
            type: 'line',
            label: "MB",
            options: {
                plugins: SpeedStatus.getPlugin(),
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function (value, index, values) {
                                return value + " Mb/s";
                            }
                        }
                    }],
                    xAxes: [{

                        type: 'time',
                        ticks: {
                            max: end_date,
                            min: start_date,
                        },
                        time: {


                            displayFormats: {
                                quarter: 'MMM YYYY',
                                hour: 'MMM DD HH:mm'
                            }
                        }
                    }],

                }
            },
            data: {
                datasets: [

                    {
                        data: data_collection["upload"],
                        label: "Upload",
                        borderColor: 'rgba(0, 0, 128, 1)',
                        backgroundColor: 'rgba(0, 0, 128, 0.5)',
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                    },
                    {
                        data: data_collection["download"],
                        label: "Download",
                        borderColor: 'rgba(200, 200, 0, 1)',
                        backgroundColor: 'rgba(200, 200, 0, 0.5)',
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',

                    }
                ]
            }
        });
    },

    getChart: function () {
        return document.getElementById('myChart');
    },

    setData: function (name, data) {
        el = document.getElementById('internet_speed_data');
        el.setAttribute(name, data);
    },

    getData: function (name) {
        el = document.getElementById('internet_speed_data');
        if (el.hasAttribute(name)) {
            return el.getAttribute(name);
        }
        else {
            return "";
        }
    },

    resizeCanvas: function () {
        var ctx = SpeedStatus.getChart();
        ctx.width = window.innerWidth * 90 / 100;
        ctx.height = window.innerHeight * 40 / 100;
    },

    getJsonData: function () {
        var data_collection = JSON.parse(SpeedStatus.getData("data_json"));
        var parsed_data = {};
        parsed_data["upload"] = [];
        parsed_data["download"] = [];
        for (let i = 0; i < data_collection["date"].length; i++) {
            let date = SpeedStatus.strToMoment(data_collection["date"][i]);
            parsed_data["upload"].push(
                { x: date, y: data_collection["upload"][i] });
            parsed_data["download"].push(
                { x: date, y: data_collection["download"][i] });

        }
        return parsed_data;
    },

    prepareBoundries: function (data_collection) {
        var boundry_mode = this.getData("boundry_mode");

        if (boundry_mode == "month") {
            start_date = moment(document.getElementById("month_start_date").innerHTML, "YYYY.MM.DD")
        } else {
            start_date = moment(document.getElementById("all_start_date").innerHTML, "YYYY.MM.DD")
        }
        end_date = data_collection["upload"][0]['x'].clone();

        start_date.add(-1, 'days');
        end_date.add(1, 'days');
        return { "start_date": start_date, "end_date": end_date };
    },

    drawChar: function (data_collection) {
        var mc = SpeedStatus.getChart();
        var ctx = mc.getContext('2d');

        //Dates
        data_values = this.prepareBoundries(data_collection);
        start_date = data_values["start_date"];
        end_date = data_values["end_date"];

        this.createChartObj(ctx, data_collection, start_date, end_date);
    },

    get_avg: function (data_list) {
        return (data_list.reduce((a, b) => a + b, 0) / data_list.length).toFixed(1);
    },

    saveDataToTable: function (table_data) {
        for (const name of ["all", "month"]) {
            //Dates
            document.getElementById(name + "_start_date").innerHTML = Utils.dateToShortStr(table_data[name + "_start_date"]);
            document.getElementById(name + "_end_date").innerHTML = Utils.dateToShortStr(table_data[name + "_end_date"]);

            //Max and avg
            for (const method of ["upload", "download"]) {
                document.getElementById(name + "_max_" + method).innerHTML = Math.max.apply(Math, table_data[name][method]) + " Mb/s";
                document.getElementById(name + "_avg_" + method).innerHTML = this.get_avg(table_data[name][method]) + " Mb/s";
            }
        }


    },

    refreshTable: function (data_collection) {
        all_values = { 'upload': [], 'download': [] };
        month_values = { 'upload': [], 'download': [] };

        table_data = {};
        table_data["all_start_date"] =
            data_collection["upload"].slice(-1)[0]["x"];
        table_data["all_end_date"] =
            data_collection["upload"][0]["x"];
        table_data["month_start_date"] = table_data["all_end_date"];
        table_data["month_end_date"] = table_data["all_end_date"];
        for (let i = 0; i < data_collection["upload"].length; i++) {
            //If value is newer than one month
            if (table_data["month_start_date"] > data_collection["upload"][i]["x"] && table_data["all_end_date"].clone().add(-1, 'month') < (data_collection["upload"][i]["x"])) {
                table_data["month_start_date"] = data_collection["upload"][i]["x"];
            }
            if (data_collection["upload"][i]["x"] > table_data["all_end_date"].clone().add(-1, 'month')) {
                month_values['upload'].push(data_collection["upload"][i]["y"]);
                month_values['download'].push(data_collection["download"][i]["y"]);
            }
            all_values['upload'].push(data_collection["upload"][i]["y"]);
            all_values['download'].push(data_collection["download"][i]["y"]);
        }
        table_data["all"] = all_values;
        table_data["month"] = month_values;

        this.saveDataToTable(table_data);

    },

    refresh: function () {
        var data_collection = this.getJsonData();
        MainMsg.setSpeed(data_collection["upload"][0]["y"], data_collection["download"][0]["y"]);
        this.refreshTable(data_collection);
        this.resizeCanvas();
        this.drawChar(data_collection);
    },

    zoomChart: function (name) {
        if (name == "") {
            name = "all";
        }
        this.setData("boundry_mode", name);
        if (name == "all") {
            document.getElementById("all_dates").classList.add('table-primary');
            document.getElementById("month_dates").classList.remove('table-primary');

        } else {
            document.getElementById("month_dates").classList.add('table-primary');
            document.getElementById("all_dates").classList.remove('table-primary');
        }

        this.refresh()
    }

}

var InternetStatus = {

    getMsgFromDuration: function (duration) {
        days = Math.round(duration.as('days'));
        hours = duration.hours();
        minutes = duration.minutes();
        duration_msg = days + " days, " + hours + " hours and " + minutes + " minutes.";
        return duration_msg;
    },

    setData: function (name, data) {
        el = document.getElementById('internet_status_data');
        el.setAttribute(name, data);
    },

    getData: function (name) {
        el = document.getElementById('internet_status_data');
        if (el.hasAttribute(name)) {
            return el.getAttribute(name);
        }
        else {
            return "";
        }
    },

    getJsonData: function () {
        var data_collection = JSON.parse(this.getData("data_json"));
        for (let i = 0; i < data_collection["status"].length; i++) {
            data_collection["start_date"][i] = moment(data_collection["start_date"][i], "YYYY.MM.DD - HH:mm:ss")
            data_collection["end_date"][i] = moment(data_collection["end_date"][i], "YYYY.MM.DD - HH:mm:ss")
        }
        return data_collection;
    },

    generate_log: function (start_date, end_date, status) {
        end_date_str = "[" + Utils.dateToFullStr(end_date) + "]";
        if (status) {
            class_str = "alert alert-success";
            msg = " There was connection for ";
        } else {
            class_str = "alert alert-danger";
            msg = " There was no connection for "
        }
        duration = moment.duration(end_date.diff(start_date));
        duration_msg = this.getMsgFromDuration(duration);
        return `<div class="` + class_str + `" role="alert">` + end_date_str + msg + duration_msg + `</div>`
    },

    generate_logs: function (json_data) {
        logs = document.getElementById("status_logs");
        logs.innerHTML = "";
        //MainMSG
        duration = moment.duration(json_data["end_date"][0].diff(json_data["start_date"][0]));
        console.log(duration)
        duration_msg = this.getMsgFromDuration(duration);
        MainMsg.setCurrentLength(duration_msg, json_data["status"][0]);
        //Logs
        for (let i = 0; i < json_data["status"].length; i++) {
            logs.innerHTML += "\n" + this.generate_log(json_data["start_date"][i], json_data["end_date"][i], json_data["status"][i])
        }
    },

    getDurationData: function (json_data) {
        duration = { 'all': { true: 0, false: 0 }, 'month': { true: 0, false: 0 } }
        start_last_month = json_data["end_date"][0].clone().add(-1, 'month');
        for (let i = 0; i < json_data["status"].length; i++) {
            start_date = json_data["start_date"][i];
            end_date = json_data["end_date"][i];
            duration['all'][json_data["status"][i]] += end_date.diff(start_date);

            if (end_date > start_last_month) {
                if (start_date < start_last_month) {
                    start_date = start_last_month;
                }
                duration['month'][json_data["status"][i]] += end_date.diff(start_date);
            }

        }

        for (const name of ["all", "month"]) {
            // Values per cent
            duration[name]['percent'] = {}
            for (const status of [true, false]) {
                dur_in_percent = 0;
                if (duration[name][status]) {
                    dur_in_percent = Math.round(duration[name][status] * 100 / (duration[name][true] + duration[name][false]) * 100) / 100;
                }
                duration[name]["percent"][status] = dur_in_percent.toFixed(2);
            }
            //sum
            duration[name]['sum'] = moment.duration(duration[name][true] + duration[name][false]);
            //Duration of statuses
            for (const status of [true, false]) {
                duration[name][status] = moment.duration(duration[name][status])
            }
        }
        return duration;
    },

    setStaticMsg: function () {
        is_connection = "There was connection for ";
        is_no_connection = "There was no connection for ";
        document.getElementById("all_true_entry_msg").innerHTML = is_connection;
        document.getElementById("all_false_entry_msg").innerHTML = is_no_connection;
        document.getElementById("month_true_entry_msg").innerHTML = is_connection;
        document.getElementById("month_false_entry_msg").innerHTML = is_no_connection;
    },

    writeDataToTable: function (duration, json_data) {
        for (const name of ["all", "month"]) {
            document.getElementById(name + "_end").innerHTML = Utils.dateToShortStr(json_data["end_date"][0]);
            document.getElementById(name + "_duration_msg").innerHTML = this.getMsgFromDuration(duration[name]["sum"]);
            for (const status of [true, false]) {
                document.getElementById(name + "_" + status + "_duration_msg").innerHTML = this.getMsgFromDuration(duration[name][status]);
                //Bar
                bar = document.getElementById(name + "_" + status + "_bar");
                bar.innerHTML = duration[name]['percent'][status] + "%";
                bar.style.width = duration[name]['percent'][status] + "%";
                bar.aria_valuenow = duration[name]['percent'][status];
            }
        }

        document.getElementById("all_start").innerHTML = Utils.dateToShortStr(json_data["start_date"].slice(-1)[0]);
        document.getElementById("month_start").innerHTML = Utils.dateToShortStr(json_data["end_date"][0].clone().add(-1, "month"));


    },

    prepare_table: function (json_data) {
        duration = this.getDurationData(json_data);
        this.writeDataToTable(duration, json_data)
    },

    refresh: function () {
        json_data = this.getJsonData();
        last_duration_msg = json_data["status"][0]
        MainMsg.setStatus(json_data["status"][0], "");
        this.generate_logs(json_data);
        this.prepare_table(json_data);
    },
}

var DataProvider = {
    HttpClient: function () {
        this.get = function (aUrl, aCallback) {
            var anHttpRequest = new XMLHttpRequest();
            anHttpRequest.onreadystatechange = function () {
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }

            anHttpRequest.open("GET", aUrl, true);
            anHttpRequest.send(null);
        }
    },

    refresh: function () {
        local = window.location.origin;
        url_internet_status = local + "/api/internet_status";
        url_internet_speed = local + "/api/internet_speed";

        var client = new this.HttpClient();
        client.get(url_internet_status, function (response) {
            InternetStatus.setData("data_json", response);
            InternetStatus.refresh();
        });
        client.get(url_internet_speed, function (response) {
            SpeedStatus.setData("data_json", response);
            SpeedStatus.refresh();
        });
    },
}

var Utils = {
    startTime: function () {
        document.getElementById('current_time').innerHTML =
            Utils.dateToFullStr(moment());
        setTimeout(Utils.startTime, 1000);
    },

    dateToShortStr: function (date) {
        return date.format("YYYY.MM.DD");
    },

    dateToFullStr: function (date) {
        return date.format("YYYY.MM.DD - HH:mm:ss");
    },

    clickProgressBar: function () {
        bar = document.getElementById("autorefresh_bar");
        data_refresh = bar.getAttribute("data_refresh");
        if (data_refresh == "true") {
            data_refresh = 'false';
            bar.classList.add("bg-danger");
        } else {
            data_refresh = 'true';
            bar.classList.remove("bg-danger");
        }
        bar.setAttribute("data_refresh", data_refresh);
    },

    refresh: function () {
        setTimeout(Utils.refresh, 1000);
        bar = document.getElementById("autorefresh_bar");
        if (bar.getAttribute("data_refresh") == 'false') {
            return;
        }
        all_sec = 60 * 5;
        current_sec = bar.getAttribute("data_time");
        current_sec -= 1;
        if (current_sec < 0) {
            current_sec = all_sec;
            DataProvider.refresh();
        }
        bar.setAttribute("data_time", current_sec);
        bar.innerHTML = current_sec + "s"
        percent = (all_sec - current_sec) * 100 / all_sec
        bar.style.width = percent + "%";
        bar.aria_valuenow = all_sec - current_sec;
    },

    onLoad: function () {
        Utils.startTime();
        InternetStatus.setStaticMsg();
        Utils.refresh();
    }
}

window.onload = Utils.onLoad;
