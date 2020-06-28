var YearlyTable = {

    getTable: function () {
        return $("#yearly_table");
    },

    getRow: function (resp) {
        tr = $("<tr></tr>");
        td = $("<td></td>");
        td.html(moment(resp.date.year + "-" + resp.date.month, "YYYY-MM").format("YYYY-MM"));
        tr.append(td);
        td = $("<td></td>");
        td.html(resp.income);
        tr.append(td);
        td = $("<td></td>");
        td.html(resp.outcome);
        tr.append(td);
        td = $("<td></td>");
        td.html(resp.balanse);
        tr.append(td);
        categories = getCategories();
        for (const cat of Object.keys(categories)) {
            if (cat == 100) {
                continue;
            }
            td = $("<td></td>");
            td.html(resp["cat"][cat] || 0);
            tr.append(td);
        }


        return tr;
    },

    updateData: function (resp) {
        tbody = this.getTable().find("tbody");
        tbody.append(this.getRow(resp));
        this.getTable().trigger("update");
        this.getTable().tablesorter({
            sortList: [[0, 1]]
        });


    },

    getHeader: function () {
        tr = $("<tr></tr>");
        tr.append("<th>Date</th>");
        tr.append("<th>Dochody</th>");
        tr.append("<th>Wydatki</th>");
        tr.append("<th>Bilans</th>");
        categories = getCategories();
        for (const cat of Object.keys(categories)) {
            if (cat == 100) {
                continue;
            }
            th = $("<th></th>");
            th.html(categories[cat].name);
            tr.append(th);
        }
        return tr;
    },

    init: function () {
        thead = this.getTable().find("thead");
        thead.append(this.getHeader());
        this.getTable().tablesorter({
            sortList: [[0, 1]]
        });
        this.getTable().trigger("update");
    },

}

var YearlyChar = {
    resizeCanvas: function () {
        var ctx = document.getElementById('yearly_char');
        ctx = ctx.getContext('2d');
        ctx.canvas.width = window.innerWidth * 90 / 100;
        ctx.canvas.height = window.innerHeight * 40 / 100;
    },
    bgCol: function (cat_data, alpha = 1) {
        rgba = "";
        rgba += "rgba("
        rgba += cat_data["r"] + ', '
        rgba += cat_data["g"] + ', '
        rgba += cat_data["b"] + ', '
        rgba += alpha + ')'
        return rgba
    },
    updateData: function (res) {
        categories = getCategories();
        current_date = moment(res["date"]["year"] + "-" + res["date"]["month"], "YYYY-MM")
        ctx = $("#yearly_char");
        var graph = ctx.data('graph');
        point = { x: current_date, y: res.income }
        graph.data.datasets[0].data.push(point);
        point = { x: current_date, y: res.outcome }
        graph.data.datasets[1].data.push(point);
        point = { x: current_date, y: res.balanse }
        graph.data.datasets[2].data.push(point);
        for (const cat of Object.keys(categories)) {
            if (cat == 100) {
                continue
            }
            point = { x: current_date, y: res["cat"][cat] }
            graph.data.datasets[parseInt(cat) + 3].data.push(point);
        }

        for (const dataset of graph.data.datasets) {
            dataset.data.sort(function (first, second) {
                return first["x"] - second["x"];
            });
        }
        graph.update();
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

    init: function () {
        this.resizeCanvas();
        ctx = $("#yearly_char");
        categories = getCategories();
        datasets = [];
        //INCOME
        dict = {
            data: [],
            label: "Dochody",
            borderColor: 'rgba(0, 125, 0, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            pointBackgroundColor: 'rgba(0, 125, 0, 0.5)',
        };
        //OUTCOME
        datasets.push(dict); dict = {
            data: [],
            label: "Wydatki",
            borderColor: 'rgba(255, 0, 0, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            pointBackgroundColor: 'rgba(255, 0, 0, 0.5)',
        };
        //BALANCE
        datasets.push(dict); dict = {
            data: [],
            label: "Bilans",
            borderColor: 'rgba(255, 125, 0, 0.5)',
            backgroundColor: 'rgba(255, 125, 0, 0.5)',
            pointBackgroundColor: 'rgba(255, 125, 0, 0.5)',
        };
        datasets.push(dict);
        for (const cat of Object.keys(categories)) {
            if (cat == 100) {
                continue;
            };
            dict = {
                data: [],
                label: categories[cat]["name"],
                borderColor: this.bgCol(categories[cat], 1),
                backgroundColor: 'rgba(0, 0, 0, 0)',
                pointBackgroundColor: this.bgCol(categories[cat], 1),
            };
            datasets.push(dict);
        };
        var graph = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets,
            },
            options: {
                plugins: {
                    zoom: this.getPluginZoom(),
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function (value, index, values) {
                                return value + " PLN";
                            }
                        }
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month',
                            unitStepSize: 1,
                            displayFormats: {
                                quarter: 'MMM YYYY',
                                hour: 'MMM YYYY',
                                month: 'MMM YYYY',
                                day: 'MMM YYYY',
                            }
                        }
                    }],

                },
            }
        });
        ctx.data('graph', graph);
        graph.update();
    }
}

var MonthData = {
    getMonthsList: function (border_dates) {
        for (i = 0; i < border_dates.length; i++) {
            border_dates[i] = moment(border_dates[i], "YYYY-MM-DD").startOf('month')
        }
        all_months = [];
        current_date = border_dates[0]
        all_months.push(current_date.clone());
        do {
            current_date.add(-1, "month");
            all_months.push(current_date.clone());
        } while (border_dates[1] < current_date);
        return all_months;
    },

    pushData: function (resp) {
        YearlyChar.updateData(resp);
        YearlyTable.updateData(resp);
    },

    init: function (response) {
        months_list = MonthData.getMonthsList(response);
        Loading(true, months_list.length, text = "Loading month summary...")
        for (const date of months_list) {
            year = date.year();
            month = date.month() + 1;
            MonthSummary.getData(year, month, MonthData.pushData);

        }
    },
}

var DataProvider = {

    getURL: function (url) {
        return window.location.origin + url;
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

    getMonthData: function (year, month) {
        url = this.getURL("/api/wim/trans");
        var client = new this.HttpClient();
        data = { "year": year, "month": month };
        client.post(url, data, function (response) {
            response = JSON.parse(response);
            Loading(false);
            MonthlyData.init(response)
        })
    },

}

var Utils = {
    onLoad: function () {
        YearlyChar.init();
        YearlyTable.init();
        Loading(true, 1, "Loading border dates...");
        DataProviderSummary.getDates(MonthData.init);
    }
}


window.onload = Utils.onLoad;