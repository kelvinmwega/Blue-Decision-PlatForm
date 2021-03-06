var sensorsURL = "/getSensors";
var drsUrl = "/dailyreadings/";
var sdUrl = "/sitedetails/";

var siteDataChart;

$(document).ready(function () {
    getSensors();
    loadSiteData();
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Analytics : ", "Collecting Data...");
});

function getSensors() {
    reqFN("", sensorsURL, "get").done(handleResponse);
}

function getSD(siteid) {
    reqFN("", sdUrl.concat(siteid), "get").done(loadSiteDetails)
}

function getDRS(siteid) {
    reqFN("", drsUrl.concat(siteid), "get").done(procSiteData)
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

function loadSiteDetails(data) {
    $('#sensors').text("sensors : " + data.data.sensors.length);
    $('#yield_rate').text("yield_rate : " + data.data.yield_rate);
}

function procSiteData(data) {

    // console.log(data);
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
                backgroundColor: "rgba(65, 93, 104, 1)"
            }]
        },
        options: chartOptions
    });
}

