var sensorsURL = "/getSensors";
var dcrUrl = "/dailycountyreadings/";
var drsUrl = "/dailyreadings/";
var sdUrl = "/sitedetails/";
var ssUrl = "/getSitesSummary/";
var scUrl = "/status-changes/";

var siteDataChart, active_hoursChart, sensor_uptimesChart, site_uptimesChart, yield_dailyChart;


$(document).ready(function () {
    getSS();
    getSC("day", 1);
    loadSiteData();
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Analytics : ", "Collecting Data...");
});


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
    // console.log(data);
}

function loadSiteData() {
    var selectBox = document.getElementById("coun");
    var mwaterid = selectBox.options[selectBox.selectedIndex].value;
    getDRS(mwaterid);
    notify(nFrom, nAlign, nIcons, "warning", nAnimIn, nAnimOut, "Collecting Data for Meter ID : ", mwaterid);
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
    notify(nFrom, nAlign, nIcons, "success", nAnimIn, nAnimOut, "Notification : ", "Data Collected Successfully...");

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