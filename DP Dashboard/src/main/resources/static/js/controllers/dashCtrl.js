var sensorsURL = "/getSensors";
var dcrUrl = "/dailycountyreadings/";
var drsUrl = "/dailyreadings/";
var sdUrl = "/sitedetails/";
var ssUrl = "/getSitesSummary/";
var scUrl = "/status-changes/";

var markers = [];

$(document).ready(function () {
    getSS();
    getSC("day", 1);
});

function initMap() {
    var myLatLng = new google.maps.LatLng(-1.30931, 36.76971);
    var mapProp={
        mapTypeId:google.maps.MapTypeId.HYBRID
    };
    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 6,
        center: new google.maps.LatLng(2.337443, 37.991098),
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

    // getSensors();
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut, "Welcome : ", "Collecting Data...");
}

function getSD(siteid) {
    reqFN("", sdUrl.concat(siteid), "get").done(handleResponse)
}

function getSS() {
    reqFN("", ssUrl, "get").done(updateYield)
}

function getSC(tp, nc) {
    reqFN("", scUrl.concat(tp, "/cycles/", nc), "get").done()
}


function handleResponse(data) {
    // console.log(data);
}

function updateYield(data) {
    document.getElementById("hy").textContent = data.data.yield_daily.high_yield_daily_count;
    document.getElementById("my").textContent = data.data.yield_daily.medium_yield_daily_count;
    document.getElementById("ly").textContent = data.data.yield_daily.low_yield_daily_count;
    document.getElementById("zy").textContent = data.data.yield_daily.zero_yield_daily_count;

    document.getElementById("nu").textContent = data.data.statuses["1"];
    document.getElementById("lu").textContent = data.data.statuses["2"];
    document.getElementById("sd").textContent = data.data.statuses["3"];
    document.getElementById("r").textContent = data.data.statuses["4"];
    document.getElementById("o").textContent = data.data.statuses["5"];
    document.getElementById("xu").textContent = data.data.statuses["6"];


    loadDevices(data);
}


function loadDevices(data) {
    // console.log(data);
    var respObject = data.data.sites;
    var locations = [];
    var tempLocation = [];
    var i = 0;

    // console.log(respObject);
    for (var key in respObject) {
        if (respObject.hasOwnProperty(key)) {

            try {
                var contentString = sprintf('<div style = "line-height: 8px;" id="content">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    // '<h3 id="firstHeading" class="firstHeading">User Details</h3>'+
                    '<div id="bodyContent">'+
                    '<p><b>%s</b></p>'+
                    '<p><b>Yield</b> : %s </p>'+
                    '<p><b>Bar Code</b> : %s</p>'+
                    '<p><b>ID </b> : %s </p>'+
                    '</div>'+
                    '</div>', [respObject[i].site_name, respObject[i].yield_daily, respObject[i].sensor_barcode,
                    respObject[i].mwater_id]);

                tempLocation.push(contentString);
                tempLocation.push(respObject[i].site_lat);
                tempLocation.push(respObject[i].site_lon);
                tempLocation.push(i++);
                tempLocation.push(data.data.sites[i-1].mwater_id);
                locations.push(tempLocation);
                tempLocation = [];
            } catch (e) {

            }
        }
    }

    DeleteMarkers();

    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    // clickroute(respObject[0]["site_lat"], respObject[0]["site_lon"], respObject[0]["mwater_id"]);

    for (i = 0; i < locations.length; i++) {

        // console.log(respObject[i]);
        if (respObject[i].status_id == 1){ // normal use 0388fc
            // console.log(respObject[i].yield_rate);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#0388fc')
            });
        } else if(respObject[i].status_id == 2){ //low use 6bfc03
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#42f5d1')
            });
        } else if (respObject[i].status_id == 3){ // seasonal disuse
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#5af542')
            });
        } else if (respObject[i].status_id == 4){ //repair
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#e6f542')
            });
        } else if (respObject[i].status_id == 5){ //offline
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#f59e42')
            });
        } else { // no use fc5603
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#f54242')
            });
        }

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
                getSD(locations[i][4]);
            }
        })(marker, i));

        markers.push(marker);
    }

    notify(nFrom, nAlign, nIcons, "success", nAnimIn, nAnimOut, "Notification : ", "Data Collected Successfully...");
}

