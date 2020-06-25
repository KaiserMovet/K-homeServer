

var Categories = {
    editCat: function (id) {
        table = $("#wim-categories-table")
        row = table.find("tr").eq(id);
        target_cell = row.find("td").eq(0);
        target = target_cell.html();
        value = row.find("td").eq(1).find("select").children("option:selected").val();
        button = row.find("td").eq(2).find("button");
        button.attr("disabled", true);
        if (value == 0) {
            row.addClass("table-danger");
        } else {
            row.removeClass("table-danger");
        }
        DataProvider.saveCat(target, value, target_cell);
    },
    enableButton: function (id) {
        table = $("#wim-categories-table")
        row = table.find("tr").eq(id);
        button = row.find("td").eq(2).find("button");
        button.attr("disabled", false);
    },

    get_button(index) {
        button = $('<button></button>');
        button.attr("onClick", "Categories.editCat(" + index + ")");
        button.attr("disabled", true);
        button.addClass("btn btn-info btn-sm");
        button.html("Save");
        return button;
    },

    get_list(row_data, cat, index) {
        current_cat = row_data["cat"]
        select = $('<select></select>');
        select.attr("onchange", "Categories.enableButton(" + index + ")");
        for (const key of Object.keys(cat)) {
            if (key == 100) {
                continue;
            }
            option = $('<option></option>');
            if (key == current_cat) {
                option.attr("selected", "selected");
            }
            option.attr("value", key);
            option.html(cat[key]);
            select.append(option);
        }
        return select;
    },

    render_row: function (table, row_data, cat, index) {
        row = $('<tr></tr>');
        if (row_data["cat"] == 0) {
            row.addClass("table-danger");
        }
        target_cell = $('<td></td>');
        target_cell.html(row_data["target"])

        category_cell = $('<td></td>');
        category_cell.append(this.get_list(row_data, cat, index));

        save_cell = $('<td></td>');
        save_cell.append(this.get_button(index))

        row.append(target_cell);
        row.append(category_cell);
        row.append(save_cell);

        table.append(row);
    },

    renderTable: function (cat, cat_base) {
        table = $("#wim-categories-table");
        index = 1;
        for (const row of cat_base) {
            this.render_row(table, row, cat, index);
            index += 1;
        }
    },

    init: function (cat, cat_base) {
        cat_base.sort(function (first, second) {
            return first["cat"] - second["cat"];
        });
        this.renderTable(cat, cat_base);
    }
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
        this.post = function (aUrl, data, target_cell, aCallback) {
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

    saveCat: function (target, cat, target_cell) {
        url = this.getURL("/api/wim/edit/cat_base");
        data = { "target": target, "cat": cat };
        var client = new this.HttpClient();
        target_cell.append($("<span></span>"));
        target_cell.find("span").addClass("spinner-border spinner-border-sm text-info");
        client.post(url, data, target_cell, function (target_cell) {
            target_cell.find("span").remove();
        })
    },

}

var Utils = {
    onLoad: function () {
        DataProvider.getData();
    }
}

window.onload = Utils.onLoad;