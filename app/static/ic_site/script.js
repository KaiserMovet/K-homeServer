

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

        start_date = data_collection["upload"].slice(-1)[0]['x'].clone();
        if (boundry_mode == "month" && start_date.diff(start_date.clone().add(-1, 'month')) < 0) {
            start_date.add(-1, 'month');
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
        console.log(data_collection)
        for (let i = 0; i < data_collection["upload"].length; i++) {
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
        //Dates
        document.getElementById("all_start_date").innerHTML = table_data["all_start_date"].format("YYYY-MM-DD");
        document.getElementById("all_end_date").innerHTML = table_data["all_end_date"].format("YYYY-MM-DD");
        document.getElementById("month_start_date").innerHTML = table_data["month_start_date"].format("YYYY-MM-DD");
        document.getElementById("month_end_date").innerHTML = table_data["month_end_date"].format("YYYY-MM-DD");
        //Max and avg
        document.getElementById("all_max_upload").innerHTML = Math.max.apply(Math, all_values['upload']) + " Mb/s";
        document.getElementById("all_max_download").innerHTML = Math.max.apply(Math, all_values['download']) + " Mb/s";
        document.getElementById("all_avg_upload").innerHTML = this.get_avg(all_values['upload']) + " Mb/s";
        document.getElementById("all_avg_download").innerHTML = this.get_avg(all_values['download']) + " Mb/s";
        document.getElementById("month_max_upload").innerHTML = Math.max.apply(Math, month_values['upload']) + " Mb/s";
        document.getElementById("month_max_download").innerHTML = Math.max.apply(Math, month_values['download']) + " Mb/s";
        document.getElementById("month_avg_upload").innerHTML = this.get_avg(month_values['upload']) + " Mb/s";
        document.getElementById("month_avg_download").innerHTML = this.get_avg(month_values['download']) + " Mb/s";


    },

    refresh: function () {
        var data_collection = this.getJsonData();
        this.resizeCanvas();
        this.drawChar(data_collection);
        this.refreshTable(data_collection);
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


var DataProvider = {
    refresh: function () {
        url_internet_status = "http://localhost:5000/api/internet_status";
        url_internet_speed = "http://localhost:5000/api/internet_speed";

        var client = new Utils.HttpClient();
        client.get(url_internet_status, function (response) {

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
            moment().format('YYYY.MM.DD HH:mm:ss');
        var t = setTimeout(Utils.startTime, 1000);
    },

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

    getData: function (url) {
        var client = new Utils.HttpClient();
        var response;
        client.get(url, function (response) {
            res = response;
        });
        return res;
    },

    refresh: function () {
    },

    onLoad: function () {
        Utils.startTime();
        DataProvider.refresh();
    }
}

window.onload = Utils.onLoad;
