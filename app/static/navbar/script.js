var DarkTheme = {



    change: function () {
        theme = CookieManager.getCookie("theme");

        if (theme == "" || theme == "white") {
            theme = "dark";
        } else {
            theme = "white";
        }
        CookieManager.setCookie("theme", theme);
        location.reload();
    }
}


//window.onload = Utils.onLoad;