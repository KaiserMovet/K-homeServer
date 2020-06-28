var MonthSummary = {

    prepareResponse: function (response, data) {
        prepared_resp = { "outcome": 0, "balanse": 0, "date": data };
        for (const key of Object.keys(response)) {
            if (key != 100) {
                prepared_resp["outcome"] += response[key];
            }
        }
        prepared_resp["income"] = response[100] || 0;
        delete response[100];
        prepared_resp["outcome"] = Math.round((prepared_resp["outcome"]) * 100) / 100;
        prepared_resp["balanse"] = Math.round((prepared_resp["income"] - prepared_resp["outcome"]) * 100) / 100;
        prepared_resp["cat"] = response;
        return prepared_resp;
    },

    getData: function (year, month, aCallback) {
        DataProviderSummary.getMonthSummary(year, month, aCallback);
    }
}

var DataProviderSummary = {

    getURL: function (url) {
        return window.location.origin + url;
    },

    HttpClient: function () {
        this.post = function (aUrl, data, callbackFunction, aCallback) {
            var anHttpRequest = new XMLHttpRequest();

            anHttpRequest.onreadystatechange = function () {
                if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                    aCallback(anHttpRequest.responseText, callbackFunction, data);
            }
            anHttpRequest.open("POST", aUrl, true);
            anHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            anHttpRequest.send(JSON.stringify(data));
        },
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

    getMonthSummary: function (year, month, callbackFunction) {
        url = this.getURL("/api/wim/trans/summary");
        var client = new this.HttpClient();
        data = { "year": year, "month": month };
        client.post(url, data, callbackFunction, function (response, callbackFunction, data) {
            response = JSON.parse(response);
            Loading(false);
            response = MonthSummary.prepareResponse(response, data);
            callbackFunction(response);
        })
    },

    getData: function () {
        cat = this.getURL("/api/wim/cat");
        cat_base = this.getURL("/api/wim/cat_base");

        var client = new this.HttpClient();
        Loading(true);
        client.get(cat, function (cat_response) {
            client.get(cat_base, function (cat_base_response) {
                Loading(false);
                cat_response = JSON.parse(cat_response);
                cat_base_response = JSON.parse(cat_base_response);
                Categories.init(cat_response, cat_base_response)

            });
        });

    },

    getDates: function (aCallback) {
        url = this.getURL("/api/wim/trans/border_dates");
        var client = new this.HttpClient();
        client.get(url, function (response) {
            Loading(false);
            response = JSON.parse(response);
            aCallback(response);
        });
    },

}

var TokenManager = {
    setToken: function () {
        token = $('#Token').val();
        CookieManager.setCookie("token", token)
        location.reload();
    },
    getToken: function () {
        return CookieManager.getCookie("token")
    },
}

function getCategories() {
    return {
        0: { "r": 68, "g": 68, "b": 68, "name": "Untitled", "color": "secondary" },
        1: { "r": 55, "g": 90, "b": 127, "name": "Imprezy", "color": "primary" },
        2: { "r": 21, "g": 87, "b": 36, "name": "Zabawki", "color": "success" },
        3: { "r": 243, "g": 156, "b": 18, "name": "Jedzenie", "color": "warning" },
        4: { "r": 52, "g": 152, "b": 219, "name": "Transport", "color": "info" },
        5: { "r": 255, "g": 125, "b": 50, "name": "Rachunki", "color": "orange" },
        6: { "r": 253, "g": 153, "b": 221, "name": "Przelewy", "color": "indygo" },
        100: { "r": 0, "g": 1, "b": 8, "name": "Wplywy", "color": "success" },
    }
}

function Loading(status, counter = 1, text = "Loading...") {
    bar = $("#loading_bar");
    value_now = parseInt(bar.attr('aria-valuenow'));
    value_max = parseInt(bar.attr('aria-valuemax'));
    if (status) {
        value_now = 0
        value_max = counter
        bar.attr("style", "width: 100%");
        bar.addClass("progress-bar-animated");
        bar.attr('aria-valuemax', value_max)
        bar.attr('aria-valuenow', value_now)
        bar.html(text + "(" + (value_now + 1) + "/" + value_max + ")");
    } else {
        value_now += 1;
        text = bar.html().split("(")[0];
        bar.html(text + " (" + (value_now + 1) + "/" + value_max + ")");
        bar.attr('aria-valuenow', value_now);

        if (value_now == value_max) {
            bar.removeClass("progress-bar-animated");
            bar.html("");
        }
    }
    width = (value_now + 1) * 100 / value_max;
    bar.attr("style", "width: " + width + "%");

}