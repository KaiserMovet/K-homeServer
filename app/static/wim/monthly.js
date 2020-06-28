var SummaryChar = {
    resizeCanvas: function () {
        var ctx = document.getElementById('summary_char');
        ctx = ctx.getContext('2d');

        ctx.canvas.width = window.innerWidth * 50 / 100;
        ctx.canvas.height = window.innerHeight * 50 / 100;

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
        res = res["cat"]
        categories = getCategories();
        data = {
            datasets: [{
                data: [],
                backgroundColor: [],
                borderColor: [],
            }],
            labels: []
        }
        for (const cat of Object.keys(res)) {
            data.datasets[0].data.push(res[cat]);
            data.datasets[0].backgroundColor.push(this.bgCol(categories[cat], 0.5));
            data.datasets[0].borderColor.push(this.bgCol(categories[cat], 1));
            data.labels.push(categories[cat]["name"]);


        }
        ctx = $("#summary_char");
        var graph = ctx.data('graph');
        graph.data = data;
        graph.update();
    },
    init: function () {
        this.resizeCanvas();
        ctx = $("#summary_char");
        var graph = new Chart(ctx, {
            type: 'pie',
            data: {},
            options: {
                responsive: true,
                plugins: {
                    labels: {
                        render: 'percentage',
                        precision: 0,
                        fontColor: '#000',
                        textShadow: true,
                        shadowColor: 'rgba(255,255,255,1)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                    }
                }
            }
        });
        ctx.data('graph', graph);
        graph.update();
    },
}

var Summary = {

    renderCardBalanse: function (res) {
        $("#summary_card_income").html(res["income"]);
        $("#summary_card_outcome").html(res["outcome"]);
        $("#summary_card_balanse").html(res["balanse"]);
    },

    renderOutcome: function (res) {
        card = $("#summary_outcome_card");
        card.html("");
        categories = getCategories();
        for (const cat of Object.keys(res["cat"])) {
            par = $("<p></p>");
            par.addClass("card-text");
            txt = categories[cat]["name"] + ": " + res["cat"][cat]
            par.html(txt);
            card.append(par);
        }
    },

    generateSummary: function (response) {
        Summary.renderCardBalanse(response);
        Summary.renderOutcome(response);
        SummaryChar.updateData(response);
    },

    init: function (response) {
        Summary.generateSummary(response);
    },
}

var OutcomeTable = {
    getTable: function () {
        return $("#wim_outcome_table");
    },

    enableButton: function (id) {
        tbody = this.getTable();
        row = tbody.find("#" + id);
        button = row.find("td").eq(4).find("button");
        button.attr("disabled", false);
    },

    editCat: function (id) {
        tbody = this.getTable();
        row = tbody.find("#" + id);
        button = row.find("td").eq(4).find("button");
        button.attr("disabled", true);
        cat = row.find("td").eq(3).find("select").children("option:selected").val();
        target_cell = row.find("td").eq(0);
        DataProvider.saveCat(id, cat, target_cell);

    },

    get_button(id) {
        button = $('<button></button>');
        button.attr("onClick", "OutcomeTable.editCat('" + id + "')");
        button.attr("disabled", true);
        button.addClass("btn btn-info btn-sm");
        button.html("Save");
        return button;
    },

    get_list(current_cat, categories, id) {
        select = $('<select></select>');
        select.attr("onchange", "OutcomeTable.enableButton('" + id + "')");
        for (const key of Object.keys(categories)) {
            if (key == 100) {
                continue;
            }
            option = $('<option></option>');
            if (key == current_cat) {
                option.attr("selected", "selected");
            }
            option.attr("value", key);
            option.html(categories[key]["name"]);
            select.append(option);
        }
        return select;
    },

    getRow: function (row_data, categories, index, cat) {
        row = $("<tr></tr>");
        row.addClass("table-" + categories[cat]["color"]);
        row.attr("id", row_data["id"])
        cell_target = $("<td></td>");
        cell_target.html(row_data["target"])

        cell_date = $("<td></td>");
        cell_date.html(row_data["date"])

        cell_value = $("<td></td>");
        cell_value.html(row_data["value"])

        cell_cat = $("<td></td>");
        cell_cat.append(this.get_list(cat, categories, row_data["id"]));

        cell_edit = $("<td></td>");
        cell_edit.html(this.get_button(row_data["id"]));

        row.append(cell_target);
        row.append(cell_date);
        row.append(cell_value);
        row.append(cell_cat);
        row.append(cell_edit);

        return row;

    },

    load: function (income, categories) {
        tbody = this.getTable().find('tbody');
        tbody.html("");
        index = 0;
        for (const cat of Object.keys(income)) {
            for (const row of income[cat]) {
                row_html = this.getRow(row, categories, index, cat);
                tbody.append(row_html);
                index += 1;
            }
        }
        this.getTable().tablesorter({
            sortList: [[1, 1], [0, 0]]
        });

    }
}

var IncomeTable = {
    getTable: function () {
        return $("#wim_income_table");
    },

    getRow: function (row_data) {
        row = $("<tr></tr>");
        cell_target = $("<td></td>");
        cell_target.html(row_data["target"])

        cell_date = $("<td></td>");
        cell_date.html(row_data["date"])

        cell_value = $("<td></td>");
        cell_value.html(row_data["value"])

        row.append(cell_target);
        row.append(cell_date);
        row.append(cell_value);
        return row;

    },

    load: function (income) {
        tbody = this.getTable().find('tbody');
        tbody.html("");
        for (const row of income) {
            row_html = this.getRow(row);
            tbody.append(row_html);
        }
        this.getTable().tablesorter({
            sortList: [[1, 1], [0, 0]]
        });
    }
}

var MonthlyData = {

    prepareData: function (data, categories) {
        income = [];
        outcome = {};
        for (const trans of data) {
            cat = parseInt(trans["cat"]);
            date = trans["date"];
            value = parseFloat(trans["value"]);
            target = trans["target"];
            id = trans["id"];
            row = { "target": target, "value": value, "date": date, "id": id };
            if (cat == 100) {
                income.push(row);
            } else {
                if (!(cat in outcome)) {
                    outcome[cat] = [];
                }
                outcome[cat].push(row);
            }
        }
        res = { "income": income, "outcome": outcome };
        return res
    },

    init: function (data) {
        categories = getCategories();
        res = MonthlyData.prepareData(data, categories);
        IncomeTable.load(res["income"]);
        OutcomeTable.load(res["outcome"], categories);
    }
}


var MonthlyChoose = {

    onChange: function () {
        val = $("#monthly_choose option:selected").val().split("-");
        year = parseInt(val[0]);
        month = parseInt(val[1]);
        Loading(true, counter = 2, text = "Loading month data...")
        DataProvider.getMonthData(year, month, MonthlyData.init);
        MonthSummary.getData(year, month, Summary.init);
    },

    getMonthsList: function (border_dates) {
        all_months = [];
        current_date = border_dates[0]
        all_months.push(current_date.clone());
        do {
            current_date.add(-1, "month");
            all_months.push(current_date.clone());
        } while (border_dates[1] < current_date);
        return all_months;
    },

    addOptions: function (all_dates) {
        select = $("#monthly_choose");
        for (const date of all_dates) {
            option = $("<option></option");
            option.html(date.format("YYYY MMMM"));
            option.attr("value", date.format("YYYY-MM"));
            select.append(option);
        }
    },

    generateList: function (border_dates) {
        for (i = 0; i < border_dates.length; i++) {
            border_dates[i] = moment(border_dates[i], "YYYY-MM-DD").startOf('month')
        }
        all_dates = MonthlyChoose.getMonthsList(border_dates);
        MonthlyChoose.addOptions(all_dates);
        MonthlyChoose.onChange();

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
        this.post = function (aUrl, data, aCallback) {
            var anHttpRequest = new XMLHttpRequest();

            anHttpRequest.onreadystatechange = function () {
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText);
            }
            anHttpRequest.open("POST", aUrl, true);
            anHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            anHttpRequest.send(JSON.stringify(data));
        }
        this.postCat = function (aUrl, data, target_cell, aCallback) {
            var anHttpRequest = new XMLHttpRequest();

            anHttpRequest.onreadystatechange = function () {
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(target_cell);
            }
            anHttpRequest.open("POST", aUrl, true);
            anHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            anHttpRequest.send(JSON.stringify(data));
        }
    },

    getMonthData: function (year, month, aCallback) {
        url = this.getURL("/api/wim/trans");
        var client = new this.HttpClient();
        data = { "year": year, "month": month };
        client.post(url, data, function (response) {
            response = JSON.parse(response);
            Loading(false);
            aCallback(response);
        })
    },

    saveCat: function (id, cat, target_cell) {
        url = this.getURL("/api/wim/edit/cat_trans");
        data = { "id": id, "cat": cat };
        var client = new this.HttpClient();
        target_cell.append($("<span></span>"));
        target_cell.find("span").addClass("spinner-border spinner-border-sm text-info");
        client.postCat(url, data, target_cell, function (target_cell) {
            target_cell.find("span").remove();
        })
    },

}

var Utils = {
    onLoad: function () {
        SummaryChar.init();
        Loading(true, 1, "Loading border dates...");
        DataProviderSummary.getDates(MonthlyChoose.generateList);
    }
}

window.onload = Utils.onLoad;