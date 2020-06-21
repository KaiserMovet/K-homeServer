var DarkTheme = {



    change: function () {
        console.log("xcd");
        theme = CookieManager.getCookie("theme");
        console.log("GET: " + theme);

        if (theme == "" || theme == "white") {
            theme = "dark";
        } else {
            theme = "white";
        }
        CookieManager.setCookie("theme", theme);
        console.log("SET: " + theme);
        location.reload();
    }
}


//window.onload = Utils.onLoad;