var sensorsURL = "/getSensors";
var dcrUrl = "/dailycountyreadings/";
var drsUrl = "/dailyreadings/";
var sdUrl = "/sitedetails/";
var ssUrl = "/getSitesSummary/";
var scUrl = "/status-changes/";

var siteDataChart;

$(document).ready(function () {
    // getSensors();
    // getDCR("Marsabit");
    // getDRS("674960");
    // getSD("674960");
    // getSS();
    // getSC("day", 1);
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
    reqFN("", sdUrl.concat(siteid), "get").done(handleResponse)
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

function procSiteData(data) {

    console.log(data);
    var labelsArray = [], yieldArray = [];

    $('#status').text("Expert Status : " + data.data[0].expertStatus);
    $('#households').text("Households : " + data.data[0].households);
    $('#activeHours').text("activeHours : " + data.data[0].activeHours);
    $('#yieldDaily').text("yieldDaily : " + data.data[0].yieldDaily);
    $('#localDate').text("localDate : " + data.data[0].localDate);

    for (var i = 0; i < 200; i++){
        labelsArray.push(data.data[i].localDate);
        yieldArray.push(data.data[i].yieldDaily);
    }

    loadSiteDat(labelsArray, yieldArray);

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
                tooltipFormat: "MMM-DD h:mm a",
                displayFormats: {
                    'millisecond': 'h:mm a',
                    'second': 'h:mm a',
                    'minute': 'h:mm a',
                    'hour': 'D MMM hA',
                    'day': 	'MMM DD',
                    'week': 'MMM DD',
                    'month': 'MMM DD',
                    'quarter': 'MMM DD',
                    'year': 'MMM DD'
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