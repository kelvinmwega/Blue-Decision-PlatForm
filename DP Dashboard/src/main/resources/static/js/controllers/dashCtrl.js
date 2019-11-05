var sensorsURL = "/getSensors";

$(document).ready(function () {
    getSensors();
});

function getSensors() {
    reqFN("", sensorsURL, "get").done(handleResponse);
}

function handleResponse(data) {
    console.log(data);
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
