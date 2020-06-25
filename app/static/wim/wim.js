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

function Loading(status) {
    bar = $("#loading_bar");
    if (status) {
        bar.attr("style", "width: 100%");
        bar.addClass("progress-bar-animated");
        bar.html("Loading...");
    } else {
        bar.attr("style", "width: 100%");
        bar.removeClass("progress-bar-animated");
        bar.html("");

    }
}