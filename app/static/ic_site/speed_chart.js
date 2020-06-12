function getChart(zoom_dates) {
    var mc = document.getElementById('myChart');
    var ctx = mc.getContext('2d');
    var data_collection = {
        "log_date_list": mc.getAttribute("log_date_list"),
        "log_download_list": mc.getAttribute("log_download_list"),
        "log_upload_list": mc.getAttribute("log_upload_list"),
    };
    data_collection = parseData(data_collection)
    var myChart = createChartObj(ctx, data_collection, zoom_dates);
}
var char_dates_name = "";
var zoom_enabled = true;
var pam_enabled = true;

function createChartObj(ctx, data_collection, zoom_dates) {
    new Chart(ctx, {
        type: 'line',
        label: "MB",
        options: {
            plugins: getPlugin(),
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
                        max: zoom_dates["end"].add(1, 'days'),
                        min: zoom_dates["start"].add(-1, 'days'),
                    },
                    time: {


                        displayFormats: {
                            quarter: 'MMM YYYY',
                            hour: 'MMM DD HH:mm'
                        }
                    }
                }],

            }
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
                    borderColor: 'rgba(200, 200, 0, 1)',
                    backgroundColor: 'rgba(200, 200, 0, 0.5)',
                    pointBackgroundColor: 'rgba(0, 0, 0, 1)',

                }
            ]
        }
    });
}

function getPlugin() {
    plugins = {
        zoom: {
            // Container for pan options
            pan: {
                // Boolean to enable panning
                enabled: pam_enabled,

                // Panning directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow panning in the y direction
                // A function that is called as the user is panning and returns the
                // available directions can also be used:
                //   mode: function({ chart }) {
                //     return 'xy';
                //   },
                mode: 'x',

                rangeMin: {
                    // Format of min pan range depends on scale type
                    x: null,
                    y: null
                },
                rangeMax: {
                    // Format of max pan range depends on scale type
                    x: null,
                    y: null
                },

                // On category scale, factor of pan velocity
                speed: 20,

                // Minimal pan distance required before actually applying pan
                threshold: 10,

                // Function called while the user is panning
                onPan: function ({ chart }) { console.log(`I'm panning!!!`); },
                // Function called once panning is completed
                onPanComplete: function ({ chart }) { console.log(`I was panned!!!`); }
            },

            // Container for zoom options
            zoom: {
                // Boolean to enable zooming
                enabled: zoom_enabled,

                // Enable drag-to-zoom behavior
                drag: false,

                // Drag-to-zoom effect can be customized
                // drag: {
                // 	 borderColor: 'rgba(225,225,225,0.3)'
                // 	 borderWidth: 5,
                // 	 backgroundColor: 'rgb(225,225,225)',
                // 	 animationDuration: 0
                // },

                // Zooming directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow zooming in the y direction
                // A function that is called as the user is zooming and returns the
                // available directions can also be used:
                //   mode: function({ chart }) {
                //     return 'xy';
                //   },
                mode: 'x',

                rangeMin: {
                    // Format of min zoom range depends on scale type
                    x: null,
                    y: null
                },
                rangeMax: {
                    // Format of max zoom range depends on scale type
                    x: null,
                    y: null
                },

                // Speed of zoom via mouse wheel
                // (percentage of zoom on a wheel event)
                speed: 0.1,

                // Minimal zoom distance required before actually applying zoom
                threshold: 2,

                // On category scale, minimal zoom level before actually applying zoom
                sensitivity: 3,

                // Function called while the user is zooming
                onZoom: function ({ chart }) { console.log(`I'm zooming!!!`); },
                // Function called once zooming is completed
                onZoomComplete: function ({ chart }) { console.log(`I was zoomed!!!`); }
            }
        }
    };
    return plugins;
}

function parseData(data_collection) {


    var parsed_data = {};
    download_speed = data_collection["log_download_list"].split(" ").map(Number)
    upload_speed = data_collection["log_upload_list"].split(" ").map(Number)
    parsed_data["upload"] = []
    parsed_data["download"] = []

    date_list = data_collection["log_date_list"].split(", ")
    for (let i = 0; i < date_list.length; i++) {
        let date = moment(date_list[i], 'YYYY.MM.DD h:mm');
        parsed_data["upload"].push({ x: date, y: upload_speed[i] })
        parsed_data["download"].push({ x: date, y: download_speed[i] })

    }

    return parsed_data
}

function resize_canvas() {
    var ctx = document.getElementById('myChart');
    ctx.width = window.innerWidth * 90 / 100;
    ctx.height = window.innerHeight * 40 / 100;
}

function onLoad() {
    startTime();
    resize_canvas();
    zoomChart("all");
}


function zoomChart(name) {
    if (name == "") {
        name = "all";
    }
    if (name == "all") {
        document.getElementById("all_dates").classList.add('table-primary');
        document.getElementById("month_dates").classList.remove('table-primary');

    } else {
        document.getElementById("month_dates").classList.add('table-primary');
        document.getElementById("all_dates").classList.remove('table-primary');
    }
    char_dates_name = name;
    var mc = document.getElementById(name + "_dates");

    start_date = mc.getAttribute("start_date")
    end_date = mc.getAttribute("end_date");
    getChart(
        {
            "start": moment(start_date, 'YYYY.MM.DD h:mm:ss'),
            "end": moment(end_date, 'YYYY.MM.DD h:mm:ss')
        });

}

// window.onload = onLoad;

