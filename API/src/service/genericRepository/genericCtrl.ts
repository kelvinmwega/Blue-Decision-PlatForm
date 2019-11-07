import * as request from "request-promise-native";

export class GenericController {

    private headersOpt = {
        "content-type": "application/json",
    };

    public allSensors = async () => {
        var options = {
            uri: "https://waterpoint-engine-challenge-dev.mybluemix.net/sensors",
            headers: this.headersOpt
        };

        return await request.get(options);
    }

    public weatherForecast = async (lat, lon) => {
        var options = {
            uri: `https://api.darksky.net/forecast/1e7ede044c6d02abd140215378af0959/${lat},${lon}?exclude=hourly,flags&units=si`,
            headers: this.headersOpt
        };

        return await request.get(options);
    }

}