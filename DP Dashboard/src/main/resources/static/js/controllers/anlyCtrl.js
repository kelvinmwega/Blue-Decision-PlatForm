var sensorsURL = "/getSensors";
var dcrUrl = "/dailycountyreadings/";
var drsUrl = "/dailyreadings/";
var sdUrl = "/sitedetails/";
var ssUrl = "/getSitesSummary/";
var scUrl = "/status-changes/";

var siteDataChart, active_hoursChart, sensor_uptimesChart, site_uptimesChart, yield_dailyChart;

var c1 =  [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(255, 159, 64, 0.2)'
];

var c2 = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(255, 159, 64, 1)'
];

$(document).ready(function () {
    // getSensors();
    // getDCR("Marsabit");
    // getDRS("674960");
    // getSD("674960");
    getSS();
    getSC("day", 1);
    loadSiteData();
});

function getSensors() {
    reqFN("", sensorsURL, "get").done(handleResponse);
}

function getDCR(county){
    reqFN("", dcrUrl.concat(county), "get").done(handleResponse)
}

function getDRS(siteid) {
    reqFN("", drsUrl.concat(siteid), "get").done(procSiteData)
}

function getSD(siteid) {
    reqFN("", sdUrl.concat(siteid), "get").done(loadSiteDetails)
}

function getSS() {
    reqFN("", ssUrl, "get").done(processSummary)
}

function getSC(tp, nc) {
    reqFN("", scUrl.concat(tp, "/cycles/", nc), "get").done(handleResponse)
}

function handleResponse(data) {
    console.log(data);
}

function loadSiteData() {
    var selectBox = document.getElementById("coun");
    var mwaterid = selectBox.options[selectBox.selectedIndex].value;
    getDRS(mwaterid);
}

function loadCountyData() {
    var selectBox = document.getElementById("county");
    var county = selectBox.options[selectBox.selectedIndex].value;
    getDCR(county);
}

function processSummary(data) {

    console.log(data);
    var labelsArray = [], dataArray = []

    for (var key in data.data.active_hours){
        if (data.data.active_hours.hasOwnProperty(key)) {
            labelsArray.push(key);
            dataArray.push(data.data.active_hours[key]);
        }
    }

    activeHours(labelsArray, dataArray);

    labelsArray = [];
    dataArray = [];

    for (var key in data.data.sensor_uptimes){
        if (data.data.sensor_uptimes.hasOwnProperty(key)) {
            labelsArray.push(key);
            dataArray.push(data.data.sensor_uptimes[key]);
        }
    }

    sensor_uptimes(labelsArray, dataArray);

    labelsArray = [];
    dataArray = [];

    for (var key in data.data.site_uptimes){
        if (data.data.site_uptimes.hasOwnProperty(key)) {
            labelsArray.push(key);
            dataArray.push(data.data.site_uptimes[key]);
        }
    }

    site_uptimes(labelsArray, dataArray);

    labelsArray = [];
    dataArray = [];

    for (var key in data.data.yield_daily){
        if (data.data.yield_daily.hasOwnProperty(key)) {
            labelsArray.push(key);
            dataArray.push(data.data.yield_daily[key]);
        }
    }

    yield_daily(labelsArray, dataArray);
}

function procSiteData(data) {

    console.log(data);
    var labelsArray = [], yieldArray = [];

    $('#status').text("Expert Status : " + data.data[0].expertStatus);
    $('#households').text("Households : " + data.data[0].households);
    $('#activeHours').text("activeHours : " + data.data[0].activeHours);
    $('#yieldDaily').text("yieldDaily : " + data.data[0].yieldDaily);
    $('#localDate').text("localDate : " + data.data[0].localDate);

    for (var i = 0; i < data.data.length; i++){
        labelsArray.push(data.data[i].localDate);
        yieldArray.push(data.data[i].yieldDaily);
    }

    loadSiteDat(labelsArray, yieldArray);
    getSD(data.data[0].mWaterId);

}

function loadSiteDetails(data) {
    $('#sensors').text("sensors : " + data.data.sensors.length);
    $('#yield_rate').text("yield_rate : " + data.data.yield_rate);
}

function activeHours(labelsArray, dataArray) {

    if (active_hoursChart) {
        active_hoursChart.destroy();
    }

    var ctx = document.getElementById('active_hours').getContext('2d');
    active_hoursChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: dataArray,
                backgroundColor: c1,
                borderColor: c2
            }],
            labels: labelsArray
        },
        options: donutOption
    });
}

function sensor_uptimes(labelsArray, dataArray) {
    if (sensor_uptimesChart) {
        sensor_uptimesChart.destroy();
    }

    var ctx = document.getElementById('sensor_uptimes').getContext('2d');
    sensor_uptimesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: dataArray,
                backgroundColor: c1,
                borderColor: c2
            }],
            labels: labelsArray
        },
        options: donutOption
    });
}

function site_uptimes(labelsArray, dataArray) {
    if (site_uptimesChart) {
        site_uptimes().destroy();
    }

    var ctx = document.getElementById('site_uptimes').getContext('2d');
    site_uptimesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: dataArray,
                backgroundColor: c1,
                borderColor: c2
            }],
            labels: labelsArray
        },
        options: donutOption
    });
}

function yield_daily(labelsArray, dataArray) {
    if (yield_dailyChart) {
        yield_dailyChart.destroy();
    }

    var ctx = document.getElementById('yield_daily').getContext('2d');
    yield_dailyChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: dataArray,
                backgroundColor: c1,
                borderColor: c2
            }],
            labels: labelsArray
        },
        options: donutOption
    });
}

function loadSiteDat(labelsArray, yieldArray){
    var wlctx = document.getElementById('siteDataChart').getContext('2d');

    if (siteDataChart) {
        siteDataChart.destroy();
    }

    siteDataChart = new Chart(wlctx, {
        type: 'bar',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Yield',
                data: yieldArray,
                backgroundColor: "rgba(54, 162, 235, 1)"
            }]
        },
        options: chartOptions
    });
}

function reqFN(dataToSubmit, url, type){
    return $.ajax({
        url : url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data : JSON.stringify(dataToSubmit),
        type : type,
        contentType: "application/json",
        dataType : "json",
        cache : false,
        success : function(data){
            //console.log(data);
        },
        error : function(xhr, status, error){
            var err = eval("(" + xhr.responseText + ")");
            console.log(err.Message);
        }
    });
}

var chartOptions = {
    scales: {
        xAxes: [{
            type: 'time',
            distribution: 'linear',
            time: {
                tooltipFormat: "YYYY-MMM-DD h:mm a",
                displayFormats: {
                    'millisecond': 'h:mm a',
                    'second': 'h:mm a',
                    'minute': 'h:mm a',
                    'hour': 'D MMM hA',
                    'day': 	'MMM DD',
                    'week': 'YYYY MMM',
                    'month': 'YYYY MMM',
                    'quarter': 'YYYY MMM',
                    'year': 'YYYY MMM'
                }
            }
        }],
        yAxes: [{
            ticks: {
                beginAtZero:false
            }
        }]
    },
    legend: {
        display: true
    },
    elements: {
        point: {
            pointStyle: 'circle',
        }
    },
    responsive: true
};

var donutOption = {
    legend: {
        display: true
    },
    responsive: true
};