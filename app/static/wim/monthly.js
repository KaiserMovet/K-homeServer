var MonthlyData = {
    init: function (data) {
        console.log(data);
    }
}


var MonthlyChoose = {

    onChange: function () {
        console.log("xDDD")
        val = $("#monthly_choose option:selected").val().split("-");
        year = parseInt(val[0]);
        month = parseInt(val[1]);
        DataProvider.getMonthData(year, month)
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
        all_dates = this.getMonthsList(border_dates);
        console.log(all_dates);
        this.addOptions(all_dates);
        this.onChange();

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
    },

    getMonthData: function (year, month) {
        url = this.getURL("/api/wim/trans");
        var client = new this.HttpClient();
        data = { "year": year, "month": month };
        Loading(true);
        client.post(url, data, function (response) {
            response = JSON.parse(response);
            Loading(false);
            MonthlyData.init(response)
        })
    },

    getDates: function () {
        url = this.getURL("/api/wim/trans/border_dates");

        var client = new this.HttpClient();
        Loading(true);
        client.get(url, function (response) {
            Loading(false);
            response = JSON.parse(response);
            MonthlyChoose.generateList(response)
        });
    },

}

var Utils = {
    onLoad: function () {
        DataProvider.getDates();
    }
}

window.onload = Utils.onLoad;