
class icStatusRange {
    constructor(start, end, status) {
        this.start = start.clone();
        this.end = end.clone();
        this.status = status;
    }
    getStr() {
        return this.start.format() + " " + this.end.format();
    }
    splitByMonth() {
        if (this.start.isSame(this.end, 'month')) {
            return [this];
        } else {
            var rangeCollection = [];
            var cend = this.end;
            var cstart = cend.clone().startOf('month');
            var i = 20;
            while (true) {
                if (this.start.isSame(cend.clone().add(-1, 'miliseconds'), 'month')) {
                    break;
                }
                if (cstart < this.start) {
                    cstart = this.start.clone();
                }


                let rangeObj = new icStatusRange(cstart, cend, this.status);
                rangeCollection.push(rangeObj);
                cstart.add(-1, 'months');
                cend = cstart.clone().add(1, 'months').startOf('month');
            }
            return rangeCollection;
        }
    }
    merge(rangeStatus) {
        var startDate;
        var endDate;
        if (this.start < rangeStatus.start) {
            startDate = this.start;
        } else {
            startDate = rangeStatus.start;
        }
        if (this.end > rangeStatus.end) {
            endDate = this.end;
        } else {
            endDate = rangeStatus.end;
        }
        return new icStatusRange(startDate, endDate, this.status);
    }
    getDuration() {
        return moment.duration(this.end.diff(this.start));
    }
}


var icStatusTable = {
    getTable: function () {
        return $("#status_table").find("tbody");
    },

    addRow: function (data, index) {
        row = $('<tr></tr>');
        row.attr('id', index);
        for (key in data) {
            cell = $('<td></td>');
            cell.attr('id', key);
            row.append(cell);
        }
        icStatusTable.getTable().append(row);
    },

    createRow: function (index, data) {
        var row = icStatusTable.getTable().find('#' + index);
        if (row.length == 0) {
            row = icStatusTable.addRow(data, index);
        }
        return row;
    },

    updateRow(data, index) {
        var row = icStatusTable.getTable().find('#' + index);
        row.remo
        if (data['status']) {
            row.addClass("table-success");
        }
        else {
            row.addClass("table-danger");
        }
        for (key in data) {
            let cell = row.find('#' + key);
            htmlStr = data[key];
            if (key == "status") {
                htmlStr = data['status'] ? "Connection" : "No connection";
            }
            cell.html(htmlStr);
        }
    },

    prepareDataFormRange(rangeStatus) {
        var duration = rangeStatus.getDuration();
        var dataDict = {
            "from": icMain.dateToFullStr(rangeStatus.start),
            "to": icMain.dateToFullStr(rangeStatus.end),
            "status": rangeStatus.status,
            "days": Math.floor(duration.as('days')),
            "hours": duration.hours(),
            "minutes": duration.minutes(),
        }
        return dataDict;
    },

    updateData(rangeCollection) {
        for (let i = 0; i < rangeCollection.length; i++) {
            let data = icStatusTable.prepareDataFormRange(rangeCollection[i]);
            icStatusTable.createRow(i, data);
            icStatusTable.updateRow(data, i);
        }
    },

    main: function (rangeCollection) {
        icStatusTable.updateData(rangeCollection);
    },
}

var icTable = {

    getTable: function () {
        return $("#speed_table").find("tbody");
    },

    getRowId: function (year, month = -1) {
        var id_str = year.toString();
        if (month > -1) {
            id_str += "_" + month.toString();
        }
        return id_str;
    },

    addRow: function (year, month = -1) {
        var row_id = icTable.getRowId(year, month);
        var row = $('<tr></tr>');
        row.attr('id', row_id);
        var cell;
        if (month == -1) {
            // Add background for years row
            row.addClass("table-primary");
        }
        if (month > -1) {
            // Collapsing month rows
            let parent_id = icTable.getRowId(year);
            row.addClass("collapse_" + parent_id);
            row.addClass("collapse");
        }
        if (month == -1) {
            // Add button to collapse months row instead of name
            cell = $('<td></td>');
            button = $('<button></button>');
            button.attr('id', "name");
            button.html(year)
            button.addClass("btn btn-info btn-sm");
            button.attr("data-toggle", "collapse");
            collapse_id = "collapse_" + row_id;
            button.attr("data-target", "." + collapse_id);
            cell.append(button);
            row.append(cell);
        } else {
            //Name cell
            cell = $('<td></td>');
            row.append(cell);
        }
        // Date and speed cells
        for (const name of ["max_download", "avg_download", "max_upload", "avg_upload"]) {
            cell = $('<td></td>');
            cell.attr('id', name);
            row.append(cell);
        }
        // Status cells
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

        // Append row
        icTable.getTable().append(row);
        return row;
    },

    addRowBar: function (year, month = -1) {
        var row_id = icTable.getRowId(year, month) + "_bar";
        var row = $('<tr></tr>');
        var cell;
        if (month == -1) {
            // Add background for years row
            row.addClass("table-primary");
        }
        if (month > -1) {
            // Collapsing  month rows
            let parent_id = icTable.getRowId(year);
            row.addClass("collapse_" + parent_id);
            row.addClass("collapse");
        }
        cell = $('<td></td>');
        cell.attr("colspan", 13);
        var bars = $('<div></div>');
        bars.attr("class", "progress");
        var true_bar = $('<div></div>');
        true_bar.attr("id", row_id + "_true");
        true_bar.attr("class", "progress-bar bg-success");
        true_bar.attr("style", "width: 50%");
        var false_bar = $('<div></div>');
        false_bar.attr("id", row_id + "_false");
        false_bar.attr("class", "progress-bar bg-danger");
        false_bar.attr("style", "width: 50%");
        bars.append(true_bar);
        bars.append(false_bar);
        cell.append(bars);
        row.append(cell);
        icTable.getTable().append(row);
    },

    getOrCreateRow: function (year, month = - 1) {
        var row_id = icTable.getRowId(year, month);
        var row = icTable.getTable().find('#' + row_id);
        if (row.length == 0) {
            row = icTable.addRow(year, month);
            row_bar = icTable.addRowBar(year, month);
        }
        return [row, row_bar];
    },

    updateBar: function (true_percent, year, month = -1) {
        var false_percent = 100 - true_percent;
        var row_id = icTable.getRowId(year, month);
        var table = icTable.getTable();
        var true_bar = table.find("#" + row_id + "_bar_true");
        true_bar.attr("style", "width: " + true_percent + "%");
        true_bar.html(true_percent + "%");
        var false_bar = table.find("#" + row_id + "_bar_false");
        false_bar.attr("style", "width: " + false_percent + "%");
        false_bar.html(false_percent + "%");
    },

    updateRow: function (dataDict, year, month = - 1) {
        var resp = icTable.getOrCreateRow(year, month);
        var row = resp[0];
        var row_bar = resp[1];
        var allData = dataDict["all_data"];
        for (var key in allData) {
            let cell = row.find('#' + key);
            cell.html(allData[key]);
        }
        icTable.updateBar(dataDict['true_percent'], year, month);
    },

    prepareDataEntry: function (true_duration, false_duration) {
        var all_duration = true_duration.as('ms') + false_duration.as('ms');
        var true_duration_percent = true_duration * 100 / all_duration;
        true_duration_percent = Math.round((true_duration_percent + Number.EPSILON) * 100) / 100;

        var dataDict = {
            "max_download": NaN,
            "avg_download": NaN,
            "max_upload": NaN,
            "avg_upload": NaN,
            "true_days": Math.floor(true_duration.as('days')),
            "true_hours": true_duration.hours(),
            "true_minutes": true_duration.minutes(),
            "false_days": Math.floor(false_duration.as('days')),
            "false_hours": false_duration.hours(),
            "false_minutes": false_duration.minutes(),
        }
        return { "all_data": dataDict, 'true_percent': true_duration_percent };
    },

    updateData: function (durationCollection, yearlyDurationCollection) {
        for (var year of Object.keys(yearlyDurationCollection).sort(function (a, b) { return b - a })) {
            let true_duration = yearlyDurationCollection[year][true];
            let false_duration = yearlyDurationCollection[year][false];
            let dataDict = icTable.prepareDataEntry(true_duration, false_duration);
            icTable.updateRow(dataDict, year);
            for (var month of Object.keys(durationCollection[year]).sort(function (a, b) { return b - a })) {
                let true_duration = durationCollection[year][month][true];
                let false_duration = durationCollection[year][month][false];
                let dataDict = icTable.prepareDataEntry(true_duration, false_duration);
                icTable.updateRow(dataDict, year, month);
            }
        }

    },

    main: function (durationCollection, yearlyDurationCollection) {
        icTable.updateData(durationCollection, yearlyDurationCollection);

    },
}

var icStatusData = {
    divideToRanges: function (internet_status) {
        var rangeCollection = [];
        for (var i = 0; i < internet_status['status'].length; i++) {
            let start_date = moment(internet_status['start_date'][i], 'YYYY.MM.DD HH:mm:ss').seconds(0);
            let end_date = moment(internet_status['end_date'][i], 'YYYY.MM.DD HH:mm:ss').seconds(0);
            let rangeObj = new icStatusRange(start_date, end_date, internet_status['status'][i]);
            let rangeObjSplitted = rangeObj.splitByMonth();
            rangeCollection = rangeCollection.concat(rangeObjSplitted);
        }
        return rangeCollection;
    },
    calculateDuration: function (rangeCollection) {
        var durationCollection = {};
        for (const statusRange of rangeCollection) {
            let year = statusRange.start.year();
            let month = statusRange.start.month();
            // Create keys if not exists already
            if (!(year in durationCollection)) {
                durationCollection[year] = {}
            }
            if (!(month in durationCollection[year])) {
                durationCollection[year][month] = { true: moment.duration(), false: moment.duration() }
            }
            let status = statusRange.status;
            durationCollection[year][month][statusRange.status].add(statusRange.getDuration());



        }

        return durationCollection;
    },
    calculateYealryDuration: function (durationCollection) {
        var yearlyDurationCollection = {};
        for (var year in durationCollection) {
            yearlyDurationCollection[year] = { true: moment.duration(), false: moment.duration() }
            for (var month in durationCollection[year]) {
                for (var status in durationCollection[year][month]) {
                    yearlyDurationCollection[year][status].add(durationCollection[year][month][status]);
                }
            }
        }
        return yearlyDurationCollection;
    },

    mergeRanges: function (rangeCollection) {
        var mergedRangeCollection = [];
        mergedRangeCollection.push(rangeCollection[0])
        for (const statusRange of rangeCollection.slice(1)) {
            let lastRange = mergedRangeCollection.pop()
            if (lastRange.status == statusRange.status) {
                let newRange = lastRange.merge(statusRange);
                mergedRangeCollection.push(newRange);
            } else {
                mergedRangeCollection.push(lastRange);
                mergedRangeCollection.push(statusRange);
            }
        }
        return mergedRangeCollection;

    },

    main: function (internet_status) {
        var rangeCollection = icStatusData.divideToRanges(internet_status);
        var mergedRangeCollection = icStatusData.mergeRanges(rangeCollection);
        var durationCollection = icStatusData.calculateDuration(rangeCollection);
        var yearlyDurationCollection = icStatusData.calculateYealryDuration(durationCollection);
        return [rangeCollection, durationCollection, yearlyDurationCollection, mergedRangeCollection];
    },
}

var icStaticMsg = {
    setEmoji: function (status) {
        emoji = document.getElementById("emoji");
        if (status == true) {
            emoji_code = '<svg class="bi bi-emoji-laughing" width="2em" height="2em" viewBox="0 0 16 16"fill = "currentColor" xmlns = "http://www.w3.org/2000/svg" ><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path fill-rule="evenodd" d="M12.331 9.5a1 1 0 0 1 0 1A4.998 4.998 0 0 1 8 13a4.998 4.998 0 0 1-4.33-2.5A1 1 0 0 1 4.535 9h6.93a1 1 0 0 1 .866.5z" /><path d="M7 6.5c0 .828-.448 0-1 0s-1 .828-1 0S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 0-1 0s-1 .828-1 0S9.448 5 10 5s1 .672 1 1.5z" /></svg > ';
        } else {
            emoji_code = '<svg class="bi bi-emoji-frown" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" /><path fill-rule="evenodd" d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683z" /><path d="M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" /></svg>'
        }
        emoji.innerHTML = emoji_code;
    },
    updateMsg: function (internet_speed, internet_status) {
        main_msg = document.getElementById("main_msg");
        last_speed = document.getElementById("last_speed");
        status_msg = document.getElementById("current_status");
        document.getElementById("last_time").innerHTML = internet_status['end_date'][0];
        document.getElementById("last_time").setAttribute("updated", true);
        status = internet_status['status'][0]
        icStaticMsg.setEmoji(status);
        if (status == true) {
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
    getLastDate: function () {
        return moment(document.getElementById("last_time").innerHTML, "YYYY.MM.DD - HH:mm:ss");
    },
}

var icMain = {
    dateToFullStr: function (date) {
        return date.format("YYYY.MM.DD - HH:mm:ss");
    },

    refreshData3: function (internet_speed, internet_status) {
        // Main loop function
        internet_speed = JSON.parse(internet_speed);
        internet_status = JSON.parse(internet_status);
        icStaticMsg.updateMsg(internet_speed, internet_status);
        var res = icStatusData.main(internet_status);
        var rangeCollection = res[0];
        var durationCollection = res[1];
        var yearlyDurationCollection = res[2];
        var mergedRangeCollection = res[3];
        icTable.main(durationCollection, yearlyDurationCollection);
        icStatusTable.main(mergedRangeCollection);



    },
    refreshData2: function (internet_status) {
        RequestManager.getData('/api/internet_speed', icMain.refreshData3, internet_status);
    },
    refreshData: function () {
        RequestManager.getData('/api/internet_status', icMain.refreshData2);
    },

    refreshDuration: function () {
        last_date = icStaticMsg.getLastDate();
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

    automaticRefresh: function () {
        setTimeout(icMain.automaticRefresh, 1000);


        bar = document.getElementById("autorefresh_bar");
        //Get sec to next change
        all_sec = bar.getAttribute('aria-valuemax');
        current_sec = bar.getAttribute("data_time");
        current_sec -= 1;
        if (current_sec < 0) {
            if (bar.getAttribute("data_refresh") == 'false') {
                return;
            }
            icMain.refreshData();
            //Block refreshing until duration will be updated
            current_sec = 1;

        }
        //Refresh duration time, after api get data about last check
        if (document.getElementById("last_time").getAttribute("updated") == "true") {
            document.getElementById("last_time").setAttribute("updated", false);
            all_sec = icMain.refreshDuration();
            current_sec = all_sec;
        }

        bar.setAttribute("data_time", current_sec);
        bar.innerHTML = current_sec + "s"
        percent = (all_sec - current_sec) * 100 / all_sec
        bar.style.width = percent + "%";
        bar.aria_valuenow = all_sec - current_sec;
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

    startTime: function () {
        document.getElementById('current_time').innerHTML =
            icMain.dateToFullStr(moment());
        setTimeout(icMain.startTime, 1000);
    },
    onLoad: function () {
        icMain.startTime();
        icMain.automaticRefresh();

        //InternetStatus.setStaticMsg();
        // Utils.refresh();
    }
}

window.onload = icMain.onLoad;