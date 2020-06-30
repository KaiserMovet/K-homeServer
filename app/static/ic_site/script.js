

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

    setStatus: function (status, last_date) {
        main_msg = document.getElementById("main_msg");
        last_speed = document.getElementById("last_speed");
        status_msg = document.getElementById("current_status");
        document.getElementById("last_time").innerHTML = Utils.dateToFullStr(last_date);
        document.getElementById("last_time").setAttribute("updated", true);

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
var TableGenerator = {
    get_id_of_row: function (date) {
        year = date.year();
        month = date.month();
        return year + "_" + month;
    },
    get_max: function (data_list) {
        return Math.max.apply(Math, data_list)
    },

    get_avg: function (data_list) {
        return (data_list.reduce((a, b) => a + b, 0) / data_list.length);
    },
    addRow: function (table, id, background = false, name_button = false, parent_row = false) {
        row = $('<tr></tr>');
        row.attr('id', id);
        row.attr("onClick", "SpeedStatus.zoomChart('" + id + "')")
        if (background) {
            row.addClass("table-primary");
        }
        if (parent_row) {
            parent_id = parent_row.attr("id");
            row.addClass("collapse_" + parent_id);
            row.addClass("collapse");

        }

        cell = $('<td></td>');
        row.append(cell);
        if (name_button) {
            button = $('<button></button>');
            button.attr('id', "name");
            button.addClass("btn btn-info btn-sm");
            button.attr("data-toggle", "collapse");
            collapse_id = "collapse_" + id;
            button.attr("data-target", "." + collapse_id);

            cell.append(button);

        } else {
            cell.attr('id', "name");
        }

        for (const name of ["start_date", "end_date", "max_upload", "max_download", "avg_upload", "avg_download"]) {
            cell = $('<td></td>');
            cell.attr('id', name);
            row.append(cell);
        }
        table.append(row);
        return row;
    },

    getOrCreateRow: function (table, id, background = false, name_button = false, parent_row = NaN) {
        row = table.find('#' + id);
        if (row.length == 0) {
            this.addRow(table, id, background, name_button, parent_row);
            row = table.find('#' + id);
        }
        return row;
    },

    addCollapseFunc: function (row) {

    },

    setValueOfCell: function (table, row_id, cell_id, value) {
        table_id = table.getAttribute("id");
        $("#" + table_id).find('#' + row_id).find('#' + cell_id).html(value);
    },

    drawTable: function (js_data) {
        table = $("#speed_table").find("tbody");
        //All
        this.getOrCreateRow(table, "today", background = true);
        this.getOrCreateRow(table, "all", background = true);

        for (const year of Object.keys(js_data["months"]).reverse()) {
            //Year
            parent_row = this.getOrCreateRow(table, year, background = true, name_button = true);
            for (const month of Object.keys(js_data["months"][year]).reverse()) {
                //Month
                id = this.get_id_of_row(js_data["months"][year][month]["start_date"]);
                this.getOrCreateRow(table, id, background = false, name_button = false, parent_row = parent_row);
            }
        }
    },

    saveValuesToRow: function (table, id, js_data, name) {
        this.setValueOfCell(table, id, "name", name);
        for (const date of ["start_date", "end_date"]) {
            this.setValueOfCell(table, id, date, Utils.dateToShortStr(js_data[date]));
        }
        for (const speed_val of ["max_upload", "max_download", "avg_upload", "avg_download"]) {
            this.setValueOfCell(table, id, speed_val, js_data[speed_val].toFixed(1));
        }
    },

    updateTable: function (js_data) {
        table = document.getElementById("speed_table");
        //All
        this.saveValuesToRow(table, "today", js_data["today"], "Today");
        this.saveValuesToRow(table, "all", js_data["all"], "All");

        for (const year of Object.keys(js_data["months"]).reverse()) {
            //Year
            year_name = js_data["years"][year]["start_date"].year();
            this.saveValuesToRow(table, year, js_data["years"][year], year_name);
            for (const month of Object.keys(js_data["months"][year]).reverse()) {
                //Month
                month_name = js_data["months"][year][month]["start_date"].format('MMMM');
                month_id = this.get_id_of_row(js_data["months"][year][month]["start_date"]);
                this.saveValuesToRow(table, month_id, js_data["months"][year][month], month_name);
            }
        }

    },
    divide_data: function (js_data) {
        divided_data = { "upload": {}, "download": {}, "start_date": {}, "end_date": {} };
        year = js_data["upload"][0]["x"].year();
        month = js_data["upload"][0]["x"].month();
        //Year loop
        for (let i = 0; i < js_data["upload"].length; i++) {
            year = js_data["upload"][i]["x"].year();
            month = js_data["upload"][i]["x"].month();
            if (!(year in divided_data["upload"])) {
                divided_data["upload"][year] = {};
                divided_data["download"][year] = {};
                divided_data["start_date"][year] = {};
                divided_data["end_date"][year] = {};

            }
            if (!(month in divided_data["upload"][year])) {
                divided_data["upload"][year][month] = [];
                divided_data["download"][year][month] = [];
                divided_data["start_date"][year][month] = moment("01-01-2100", "MM-DD-YYYY");
                divided_data["end_date"][year][month] = moment("01-01-1900", "MM-DD-YYYY");
            }
            divided_data["upload"][year][month].push(js_data["upload"][i]["y"]);
            divided_data["download"][year][month].push(js_data["download"][i]["y"]);
            if (js_data["upload"][i]["x"] > divided_data["end_date"][year][month]) {
                divided_data["end_date"][year][month] = js_data["upload"][i]["x"];
            }
            if (js_data["upload"][i]["x"] < divided_data["start_date"][year][month]) {
                divided_data["start_date"][year][month] = js_data["upload"][i]["x"];
            }
        }
        divided_data["today"] = { "start_date": moment().startOf('day'), "end_date": moment().startOf('day'), "upload": [], "download": [] };
        for (let i = 0; i < js_data["upload"].length; i++) {
            if (js_data["upload"][i]["x"] < divided_data["today"]["end_date"] && js_data["upload"][i]["x"] >= divided_data["today"]["start_date"]) {
                divided_data["today"]["upload"].push(js_data["upload"][i]["y"]);
                divided_data["today"]["download"].push(js_data["download"][i]["y"]);
            } else {
                break;
            }
        }
        return divided_data;
    },

    calculateStatsForMonth: function (year, month, data, data_year, stats) {
        row_data = {};
        row_data["start_date"] = data["start_date"][year][month];
        row_data["end_date"] = data["end_date"][year][month];

        row_data["max_upload"] = this.get_max(data["upload"][year][month]);
        row_data["max_download"] = this.get_max(data["download"][year][month]);
        row_data["avg_upload"] = this.get_avg(data["upload"][year][month]);
        row_data["avg_download"] = this.get_avg(data["download"][year][month]);

        if (data_year["start_date"] > row_data["start_date"]) {
            data_year["start_date"] = row_data["start_date"];
        }
        if (data_year["end_date"] < row_data["end_date"]) {
            data_year["end_date"] = row_data["end_date"];
        }
        data_year["max_upload"].push(row_data["max_upload"]);
        data_year["max_download"].push(row_data["max_download"]);
        data_year["avg_upload"].push(row_data["avg_upload"]);
        data_year["avg_download"].push(row_data["avg_download"]);
        stats["months"][year][month] = row_data;
    },
    calculateStatsForYear: function (data_year, stats, year, data_all) {
        year_row = {};
        year_row["start_date"] = data_year["start_date"];
        year_row["end_date"] = data_year["end_date"];
        year_row["max_upload"] = this.get_max(data_year["max_upload"]);
        year_row["max_download"] = this.get_max(data_year["max_download"]);
        year_row["avg_upload"] = this.get_avg(data_year["avg_upload"]);
        year_row["avg_download"] = this.get_avg(data_year["avg_download"]);

        if (data_all["start_date"] > year_row["start_date"]) {
            data_all["start_date"] = year_row["start_date"];
        }
        if (data_all["end_date"] < year_row["end_date"]) {
            data_all["end_date"] = year_row["end_date"];
        }
        data_all["max_upload"].push(year_row["max_upload"]);
        data_all["max_download"].push(year_row["max_download"]);
        data_all["avg_upload"].push(year_row["avg_upload"]);
        data_all["avg_download"].push(year_row["avg_download"]);

        stats["years"][year] = year_row;
    },


    calculateStatsForAll: function (stats, data_all) {
        all_row = {};
        all_row["start_date"] = data_all["start_date"];
        all_row["end_date"] = data_all["end_date"];
        all_row["max_upload"] = this.get_max(data_all["max_upload"]);
        all_row["max_download"] = this.get_max(data_all["max_download"]);
        all_row["avg_upload"] = this.get_avg(data_all["avg_upload"]);
        all_row["avg_download"] = this.get_avg(data_all["avg_download"]);
        stats["all"] = all_row;
    },

    calculateStatsForToday: function (stats, data_all) {
        stats["today"]["max_upload"] = this.get_max(data_all["today"]["upload"]);
        stats["today"]["max_download"] = this.get_max(data_all["today"]["download"]);
        stats["today"]["avg_upload"] = this.get_avg(data_all["today"]["upload"]);
        stats["today"]["avg_download"] = this.get_avg(data_all["today"]["download"]);
    },
    calculate_statistics: function (data) {
        stats = {};
        stats["today"] = { "start_date": moment().startOf('day'), "end_date": moment().startOf('day').add(1, "days") };
        stats["all"] = {};
        stats["years"] = {};
        stats["months"] = {};
        data_all = { "start_date": moment("01-01-2100", "MM-DD-YYYY"), "end_date": moment("01-01-1900", "MM-DD-YYYY"), "max_upload": [], "max_download": [], "avg_upload": [], "avg_download": [] };
        for (const year of Object.keys(data["upload"])) {
            stats["months"][year] = {};
            data_year = { "start_date": moment("01-01-2100", "MM-DD-YYYY"), "end_date": moment("01-01-1900", "MM-DD-YYYY"), "max_upload": [], "max_download": [], "avg_upload": [], "avg_download": [] };
            for (const month of Object.keys(data["upload"][year])) {
                this.calculateStatsForMonth(year, month, data, data_year, stats);
            }
            this.calculateStatsForYear(data_year, stats, year, data_all);
        }
        this.calculateStatsForToday(stats, data);
        this.calculateStatsForAll(stats, data_all);
        return stats;
    },

    init: function (js_data) {
        el = document.getElementById("speed_table")
        if (el.rows > 0) {

        }
        divided_data = this.divide_data(js_data);
        stats = this.calculate_statistics(divided_data);
        this.drawTable(stats);
        this.updateTable(stats);
    }
}

var SpeedStatus = {



    strToMoment: function (date) {
        return moment(date,
            'YYYY.MM.DD HH:mm:ss').seconds(0);
    },

    getPluginZoom: function () {
        return {
            pan: {
                enabled: true,
                mode: 'x',
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
    },

    getPluginAnnotation: function (data_collection) {
        dates = [];
        dates.push(data_collection['download'][0]['x'].clone().add(1, 'month').startOf('month'));
        last_date = data_collection['download'].slice(-1)[0]['x'].clone().startOf('month');
        next_check = data_collection['download'][0]['x'].clone().add(1, "hour")
        while (true) {
            cur_date = dates.slice(-1)[0].clone().add(-1, 'month');
            dates.push(cur_date);
            if (last_date.isSame(cur_date)) {
                break;
            }
        }
        annotations = [];
        for (const date of dates) {
            annotation = {
                type: 'line',

                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: date,
                borderColor: 'green',
                borderWidth: 1,
                label: {
                    enabled: true,
                    position: "center",
                    content: date.format("MMMM YYYY"),
                    position: "right",
                    xAdjust: 35,
                }
            };
            annotations.push(annotation);
        }
        now_anno = {
            type: 'line',

            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: moment(),
            borderColor: 'red',
            borderWidth: 1,
            label: {
                enabled: true,
                position: "center",
                content: "Now",
                position: "right",
                xAdjust: 25,
                yAdjust: 30,

            }
        };
        next_anno = {
            type: 'line',

            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: next_check,
            borderColor: 'blue',
            borderWidth: 1,
            label: {
                enabled: true,
                position: "center",
                content: "Next Check",
                position: "right",
                xAdjust: 40,
                yAdjust: 60,
            }
        };
        annotations.push(now_anno);
        annotations.push(next_anno);


        return {
            drawTime: 'afterDatasetsDraw',
            annotations: annotations
        }
    },

    getPlugin: function () {
        plugins = {
            zoom: this.getPluginZoom(),
        };
        return plugins;
    },

    createChartObj: function (ctx, data_collection, start_date, end_date) {
        return new Chart(ctx, {
            type: 'line',
            label: "MB",
            options: {

                responsive: true,
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

                },
                annotation: {},//this.getPluginAnnotation(data_collection),
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
                        borderColor: 'rgba(126, 64, 0, 1)',
                        backgroundColor: 'rgba(255, 126, 0, 0.5)',
                        pointBackgroundColor: 'rgba(0, 0, 0, 1)',

                    }
                ]
            }
        });
    },

    getChart: function () {
        return $('#myChart');
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
        var ctx = document.getElementById("myChart");
        ctx = ctx.getContext('2d');
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

    prepareBoundries: function () {
        var boundry_id = this.getData("boundry_mode");
        if (boundry_id == "") {
            boundry_id = "all";
        }
        target_row = $("#speed_table").find("#" + boundry_id);

        start_date = moment(target_row.find("#start_date").html(), "YYYY.MM.DD");
        end_date = moment(target_row.find("#end_date").html(), "YYYY.MM.DD");
        end_date.add(1, 'days');
        return { "start_date": start_date, "end_date": end_date };
    },


    drawChar: function (data_collection) {
        var ctx = this.getChart();
        //Dates
        data_values = this.prepareBoundries();
        start_date = data_values["start_date"];
        end_date = data_values["end_date"];
        var graph = ctx.data('graph');
        if (graph) {
            graph.data.datasets[0].data = data_collection["upload"];
            graph.data.datasets[1].data = data_collection["download"];
            graph.update();

        } else {
            graph = this.createChartObj(ctx, data_collection, start_date, end_date);
            this.resizeCanvas();
            ctx.data('graph', graph);
        }
        graph.options.annotation = this.getPluginAnnotation(data_collection);
        graph.update();

    },

    get_avg: function (data_list) {
        return (data_list.reduce((a, b) => a + b, 0) / data_list.length).toFixed(1);
    },

    refresh: function () {
        var data_collection = this.getJsonData();
        MainMsg.setSpeed(data_collection["upload"][0]["y"], data_collection["download"][0]["y"]);
        TableGenerator.init(data_collection);
        this.drawChar(data_collection);
    },

    zoomChart: function (id = "all") {
        var graph = $('#myChart').data('graph');
        if (!graph) {
            return;
        }
        this.setData("boundry_mode", id);
        bounds = this.prepareBoundries()
        graph.options.scales['xAxes'][0]['ticks']['min'] = bounds["start_date"];
        graph.options.scales['xAxes'][0]['ticks']['max'] = bounds["end_date"];
        graph.update();
        //this.refresh()
    }

}

var TableStatusGenerator = {
    get_id_of_row: function (date) {
        year = date.year();
        month = date.month();
        return year + "_" + month;
    },

    getTable: function () {
        return $("#status_table");
    },

    addRow: function (table, id, background = false, name_button = false, parent_row = false) {
        row = $('<tr></tr>');
        row.attr('id', id);

        if (parent_row) {
            parent_id = parent_row.attr("id");
            row.addClass("collapse_" + parent_id);
            row.addClass("collapse");

        }

        cell = $('<td></td>');
        row.append(cell);
        if (name_button) {
            button = $('<button></button>');
            button.attr('id', "name");
            button.addClass("btn btn-info btn-sm");
            button.attr("data-toggle", "collapse");
            collapse_id = "collapse_" + id;
            button.attr("data-target", "." + collapse_id);

            cell.append(button);

        } else {
            cell.attr('id', "name");
        }
        if (background) {
            cell.addClass("table-primary");
        }

        for (const status of [true, false]) {
            for (const name of ["days", "hours", "minutes"]) {
                cell = $('<td></td>');
                if (status) {
                    cell.addClass("table-success");
                }
                else {
                    cell.addClass("table-danger");
                }
                cell.attr('id', status + "_" + name);
                row.append(cell);
            }
        }
        table.append(row);
        return row;
    },

    getOrCreateRow: function (table, id, background = false, name_button = false, parent_row = NaN) {
        row = table.find('#' + id);
        if (row.length == 0) {
            this.addRow(table, id, background, name_button, parent_row);
            row = table.find('#' + id);
        }
        return row;
    },

    getOrCreateRowBar: function (table, id, parent_row = NaN, background = false) {
        row = table.find('#' + id + "_bar");
        if (row.length) {
            return;
        }
        if (row.length == 0) {
            row = $('<tr></tr>');
            if (background) {
                row.addClass("table-primary");
            }
            row.attr('id', id + "_bar");
            if (parent_row) {
                parent_id = parent_row.attr("id");
                row.addClass("collapse_" + parent_id);
                row.addClass("collapse");
            }
            cell = $('<td></td>');
            cell.attr("colspan", 7);
            bars = $('<div></div>');
            bars.attr("class", "progress");
            true_bar = $('<div></div>');
            true_bar.attr("id", id + "_bar_true");
            true_bar.attr("class", "progress-bar bg-success");
            true_bar.attr("style", "width: 50%");
            false_bar = $('<div></div>');
            false_bar.attr("id", id + "_bar_false");
            false_bar.attr("class", "progress-bar bg-danger");
            false_bar.attr("style", "width: 50%");
            bars.append(true_bar);
            bars.append(false_bar);
            cell.append(bars);
            row.append(cell);
            table.append(row);
        }
        return row;
    },

    drawTable: function (js_data) {
        table = this.getTable();
        //All
        this.getOrCreateRow(table, "all", background = true);
        this.getOrCreateRowBar(table, "all", NaN, true);

        for (const year of Object.keys(js_data["months"]).reverse()) {
            //Year
            parent_row = this.getOrCreateRow(table, year, background = true, name_button = true);
            this.getOrCreateRowBar(table, year, NaN, true);

            for (const month of Object.keys(js_data["months"][year]).reverse()) {
                //Month
                id = this.get_id_of_row(moment().year(year).month(month));
                this.getOrCreateRow(table, id, background = false, name_button = false, parent_row = parent_row);
                this.getOrCreateRowBar(table, id, parent_row);

            }
        }
    },

    setValueOfCell: function (table, row_id, cell_id, value) {
        table.find('#' + row_id).find('#' + cell_id).html(value);
    },

    saveValuesToRow: function (table, id, js_data, name) {
        this.setValueOfCell(table, id, "name", name);
        for (const status of [true, false]) {
            duration = moment.duration(js_data[status]);
            days = Math.floor(duration.as('days'));
            hours = duration.hours();
            minutes = duration.minutes();
            this.setValueOfCell(table, id, status + "_days", days);
            this.setValueOfCell(table, id, status + "_hours", hours);
            this.setValueOfCell(table, id, status + "_minutes", minutes);

        }
    },

    updateBar(table, id, js_data) {
        all_duration = js_data[true] + js_data[false];
        true_percent = Math.round(js_data[true] * 100 / all_duration * 100) / 100;
        false_percent = 100 - true_percent;
        true_bar = table.find("#" + id + "_bar_true");
        true_bar.attr("style", "width: " + true_percent + "%");
        true_bar.html(true_percent + "%");
        false_bar = table.find("#" + id + "_bar_false");
        false_bar.attr("style", "width: " + false_percent + "%");
        false_bar.html(false_percent + "%");

    },

    updateTable: function (js_data) {
        table = this.getTable();
        //All
        this.saveValuesToRow(table, "all", js_data["all"], "All");
        this.updateBar(table, "all", js_data["all"]);
        for (const year of Object.keys(js_data["months"]).reverse()) {
            //Year
            year_name = year;
            this.saveValuesToRow(table, year, js_data["years"][year], year_name);
            this.updateBar(table, year, js_data["years"][year]);

            for (const month of Object.keys(js_data["months"][year]).reverse()) {
                //Month
                month_name = moment().year(year).month(month).format('MMMM')
                month_id = this.get_id_of_row(moment().year(year).month(month));
                this.saveValuesToRow(table, month_id, js_data["months"][year][month], month_name);
                this.updateBar(table, month_id, js_data["months"][year][month]);

            }
        }
    },

    init: function (json_table) {
        this.drawTable(json_table);
        this.updateTable(json_table);
    }
}
var InternetStatus = {

    getMsgFromDuration: function (duration) {
        days = Math.floor(duration.as('days'));
        hours = Math.floor(duration.hours());
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
        duration_msg = this.getMsgFromDuration(duration);
        MainMsg.setCurrentLength(duration_msg, json_data["status"][0]);
        //Logs
        for (let i = 0; i < json_data["status"].length; i++) {
            logs.innerHTML += "\n" + this.generate_log(json_data["start_date"][i], json_data["end_date"][i], json_data["status"][i])
        }
    },

    calculateData: function (json_data) {
        calculated_data = { "all": { true: 0, false: 0 }, "years": {}, "months": {} };
        collection = [];

        for (i = 0; i < json_data['end_date'].length; i++) {
            end_date = json_data['end_date'][i].clone();
            start_date = json_data['start_date'][i].clone();
            status = json_data['status'][i];
            repeat = false;
            do {
                year = end_date.clone().add(-1, "minute").year();
                month = end_date.clone().add(-1, "minute").month();
                if (end_date.clone().add(-1, "minute").isSame(start_date, 'month')) {
                    current_start = start_date;
                    repeat = false;
                } else {
                    current_start = end_date.clone().add(-1, "minute").startOf('month');
                    repeat = true;
                }
                if (!(year in calculated_data["months"])) {
                    calculated_data["months"][year] = {};
                    calculated_data["years"][year] = { true: 0, false: 0 };
                }
                if (!(month in calculated_data["months"][year])) {
                    calculated_data["months"][year][month] = { true: 0, false: 0 };
                }

                //duration
                calculated_data["months"][year][month][status] += end_date.diff(current_start);
                calculated_data["years"][year][status] += end_date.diff(current_start);
                calculated_data["all"][status] += end_date.diff(current_start);

                end_date = end_date.clone().add(-1, "minute").startOf('month');
            } while (repeat);
        }

        return calculated_data;
    },

    refresh: function () {
        json_data = this.getJsonData();
        calculate_data = this.calculateData(json_data);
        TableStatusGenerator.init(calculate_data);
        last_duration_msg = json_data["status"][0];
        MainMsg.setStatus(json_data["status"][0], json_data["end_date"][0]);
        this.generate_logs(json_data);
        //this.prepare_table(json_data);
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
        //local = "http://nanopi:5000"
        url_internet_status = local + "/api/internet_status";
        url_internet_speed = local + "/api/internet_speed";

        var client = new this.HttpClient();
        client.get(url_internet_status, function (response) {
            InternetStatus.setData("data_json", response);
            InternetStatus.refresh();
        });
        client.get(url_internet_speed, function (response) {
            SpeedStatus.setData("data_json", response);
            //SpeedStatus.zoomChart();
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

    refreshDuration: function () {
        last_date = moment(document.getElementById("last_time").innerHTML, "YYYY.MM.DD - HH:mm:ss");
        if (last_date.isValid()) {
            last_date.add(6, "minutes");
        } else {
            last_date = moment().add(5, "seconds");
        }
        duration = moment.duration(moment().diff(last_date));
        sec_dur = duration.asSeconds();
        sec_dur = -sec_dur;
        if (sec_dur <= 0) {
            sec_dur = 5;
        }
        sec_dur = Math.round(sec_dur);
        bar = document.getElementById("autorefresh_bar");
        bar.setAttribute('aria-valuemax', sec_dur);
        return sec_dur;
    },

    refresh: function () {
        setTimeout(Utils.refresh, 1000);


        bar = document.getElementById("autorefresh_bar");
        //Get sec to next change
        all_sec = bar.getAttribute('aria-valuemax');
        current_sec = bar.getAttribute("data_time");
        current_sec -= 1;
        if (current_sec < 0) {
            if (bar.getAttribute("data_refresh") == 'false') {
                return;
            }
            DataProvider.refresh();
            //Block refreshing until duration will be updated
            current_sec = 1;

        }
        //Refresh duration time, after api get data about last check
        if (document.getElementById("last_time").getAttribute("updated") == "true") {
            document.getElementById("last_time").setAttribute("updated", false);
            all_sec = Utils.refreshDuration();
            current_sec = all_sec;
        }

        bar.setAttribute("data_time", current_sec);
        bar.innerHTML = current_sec + "s"
        percent = (all_sec - current_sec) * 100 / all_sec
        bar.style.width = percent + "%";
        bar.aria_valuenow = all_sec - current_sec;
    },

    onLoad: function () {
        Utils.startTime();
        //InternetStatus.setStaticMsg();
        Utils.refresh();
    }
}

window.onload = Utils.onLoad;
