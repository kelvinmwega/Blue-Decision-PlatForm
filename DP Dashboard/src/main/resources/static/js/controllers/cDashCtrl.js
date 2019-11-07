var sensorsURL = "/getSensorsCounty/";
var sdUrl = "/sitedetails/";
var ssUrl = "/getSitesSummaryCounty/";

var markers = [];

$(document).ready(function () {
    // getSensors();
    // getDCR("Marsabit");
    // getDRS("674960");
    // getSD("674960");
    getSS("Wajir");
    // getSC("day", 1);
});

function initMap() {
    var myLatLng = new google.maps.LatLng(-1.30931, 36.76971);
    var mapProp={
        mapTypeId:google.maps.MapTypeId.HYBRID
    };
    map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 7,
        center: new google.maps.LatLng(2.337443, 37.991098),
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

    getSensors("Wajir");
}

function getSensors(county) {
    reqFN("", sensorsURL.concat(county), "get").done(loadDevices);
}

function getSD(siteid) {
    reqFN("", sdUrl.concat(siteid), "get").done(handleResponse)
}

function getSS(county) {
    reqFN("", ssUrl.concat(county), "get").done(updateStatus)
}

function handleResponse(data) {
    console.log(data);
}

function loadDevices(data) {

    var respObject = data;
    var locations = [];
    var tempLocation = [];
    var i = 0;

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
                    '<p><b>Sensors</b> : %s</p>'+
                    '<p><b>ID </b> : %s </p>'+
                    '</div>'+
                    '</div>', [respObject[i].site_name, respObject[i].yield_rate, respObject[i].sensors.length,
                    respObject[i].mwater_id]);

                tempLocation.push(contentString);
                tempLocation.push(respObject[i].site_lat);
                tempLocation.push(respObject[i].site_lon);
                tempLocation.push(i++);
                tempLocation.push(data[i-1].mwater_id);
                locations.push(tempLocation);

                tempLocation = [];
            } catch (e) {
                console.log(e);
            }
        }
    }

    DeleteMarkers();

    var infowindow = new google.maps.InfoWindow();
    var marker, i;

    clickroute(respObject[0].site_lat, respObject[0].site_lon, respObject[0].mwater_id);

    for (i = 0; i < locations.length; i++) {

        if (respObject[i].yield_rate <= 15){
            // console.log(respObject[i].yield_rate);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#fc5603')
            });
        } else if(respObject[i].yield_rate > 15 && respObject[i].yield_rate <= 50){
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(respObject[i].site_lat, respObject[i].site_lon),
                map: map,
                icon: pinSymbol('#fcdb03')
            });
        } else if (respObject[i].yield_rate > 50 && respObject[i].yield_rate < 100){
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
}

function updateStatus(data) {

    var nu = 0, lu = 0, sd = 0, xu = 0, r = 0, o = 0;

    console.log(data);
    for (var i = 0; i < data.length; i++) {
        if (data[i].lastStatusId == 1){
            ++nu;
        } else if (data[i].lastStatusId == 2){
            ++lu;
        } else if (data[i].lastStatusId == 3){
            ++xu;
        } else if (data[i].lastStatusId == 4){
            ++o;
        } else if (data[i].lastStatusId == 5){
            ++r;
        } else if (data[i].lastStatusId == 6){
            ++sd;
        }
    }

    document.getElementById("nu").textContent = nu.toString();
    document.getElementById("lu").textContent = lu.toString();
    document.getElementById("sd").textContent = sd.toString();
    document.getElementById("r").textContent = r.toString();
    document.getElementById("o").textContent = o.toString();
    document.getElementById("xu").textContent = xu.toString();

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
    map.panTo(latLng);
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