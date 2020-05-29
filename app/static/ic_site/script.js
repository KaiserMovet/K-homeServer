function startTime() {

    var today = new Date();
    var Y = today.getFullYear();
    var m = checkTime(today.getMonth());
    var d = checkTime(today.getDay());
    var H = today.getHours();
    var M = checkTime(today.getMinutes());
    var S = checkTime(today.getSeconds());

    document.getElementById('time').innerHTML =
        Y + "." + m + "." + d +" " + H + ":" + M + ":" + S;

    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

function getChart(){
    var mc =document.getElementById('myChart');
    var ctx =mc.getContext('2d');
    var data_collection = {
        "log_date_list": mc.getAttribute("log_date_list"),
        "log_download_list": mc.getAttribute("log_download_list"),
        "log_upload_list": mc.getAttribute("log_upload_list"),
      };
    data_collection = parseData(data_collection)
    console.log(data_collection);
    var myChart = new Chart(ctx, {
        type: 'line',
        options: {
            scales: { xAxes: [{
                type: 'time',
                time: {
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }]}
        },
        data: {
        //   labels: data_collection["log_date_list"],
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

function parseData(data_collection){


    var parsed_data = {};
    download_speed = data_collection["log_download_list"].split(" ").map(Number)
    upload_speed = data_collection["log_upload_list"].split(" ").map(Number)
    parsed_data["upload"] = []
    parsed_data["download"] = []

    date_list = data_collection["log_date_list"].split(", ")
    console.log(date_list)
    for(let i = 0; i < date_list.length; i++) {
        console.log(i);
        let date = moment(date_list[i], 'YYYY.MM.DD h:mm');
        console.log(typeof date)
        parsed_data["upload"].push({x: date, y:  upload_speed[i]})
        parsed_data["download"].push({x: date, y:  download_speed[i]})
        
    }

    return parsed_data
}

function onLoad(){
    startTime();
    getChart();
}

window.onload = onLoad;

