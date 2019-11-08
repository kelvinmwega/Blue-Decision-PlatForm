var sensorsURL = "/getSensors";
var dcrUrl = "/dailycountyreadings/";
var drsUrl = "/dailyreadings/";
var sdUrl = "/sitedetails/";
var ssUrl = "/getSitesSummary/";
var scUrl = "/status-changes/";

var nFrom = "top";
var nAlign = "right";
var nIcons = "";
var nType = "info";
var nAnimIn = "animated fadeInRight";
var nAnimOut = "animated fadeOutUp";

var markers = [];

$(document).ready(function () {
    // getSensors();
    // getDCR("Marsabit");
    // getDRS("674960");
    // getSD("674960");
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

function getSensors() {
    reqFN("", sensorsURL, "get").done(loadDevices);
}

function getDCR(county){
    reqFN("", dcrUrl.concat(county), "get").done(handleResponse)
}

function getDRS(siteid) {
    reqFN("", drsUrl.concat(siteid), "get").done(handleResponse)
}

function getSD(siteid) {
    reqFN("", sdUrl.concat(siteid), "get").done(handleResponse)
}

function getSS() {
    reqFN("", ssUrl, "get").done(updateYield)
}

function getSC(tp, nc) {
    reqFN("", scUrl.concat(tp, "/cycles/", nc), "get").done(updateStatus)
}


function handleResponse(data) {
    console.log(data);
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

function updateStatus(data) {

}

function loadDevices(data) {
    console.log(data);
    var respObject = data.data.sites;
    var locations = [];
    var tempLocation = [];
    var i = 0;

    console.log(respObject);
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
        if (respObject[i].status_id == 1){
            // console.log(respObject[i].yield_rate);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#fc5603')
            });
        } else if(respObject[i].status_id == 2){
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#fcdb03')
            });
        } else if (respObject[i].status_id ==3){
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#6bfc03')
            });
        } else {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#0388fc')
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

function clickroute(latt, longt, id) { //just omit the 'lati' and 'long'
    var latLng = new google.maps.LatLng(latt, longt);
    // map.panTo(latLng);
    getSD(id);
}

function DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function replaceAll(find, replace, str)
{
    while( str.indexOf(find) > -1)
    {
        str = str.replace(find, replace);
    }
    return str;
}

function sprintf(template, values) {
    return template.replace(/%s/g, function() {
        return values.shift();
    });
}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 0.6
    };
}

function notify(from, align, icon, type, animIn, animOut, title, message){
    $.growl({
        icon: icon,
        title: title,
        message: message,
        url: ''
    },{
        element: 'body',
        type: type,
        allow_dismiss: true,
        placement: {
            from: from,
            align: align
        },
        offset: {
            x: 20,
            y: 85
        },
        spacing: 10,
        z_index: 1031,
        delay: 2500,
        timer: 1000,
        url_target: '_blank',
        mouse_over: false,
        animate: {
            enter: animIn,
            exit: animOut
        },
        icon_type: 'class',
        template: '<div data-growl="container" class="alert" role="alert">' +
            '<button type="button" class="close" data-growl="dismiss">' +
            '<span aria-hidden="true">&times;</span>' +
            '<span class="sr-only">Close</span>' +
            '</button>' +
            '<span data-growl="icon"></span>' +
            '<span data-growl="title"></span>' +
            '<span data-growl="message"></span>' +
            '<a href="#" data-growl="url"></a>' +
            '</div>'
    });
}
