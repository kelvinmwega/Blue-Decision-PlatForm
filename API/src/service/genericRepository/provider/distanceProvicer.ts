import { GenericController } from "../genericCtrl";
import logger from '../../../utils/logger';

export class DistanceProvider {

    private genericController;

    constructor() {
        this.genericController = new GenericController();
    }

    public async advisor(lat, lon): Promise<object> {
        const forecast = await this.genericController.weatherForecast(lat, lon);

        const maxTemp = Math.max.apply(Math, forecast.daily.data.map(function (o) { return o.temperatureMax; }))
        const minTemp = Math.min.apply(Math, forecast.daily.data.map(function (o) { return o.temperatureMin; }))

        logger.info(JSON.stringify(minTemp));

        const adviseresp = {
            weeksumary: forecast.daily.summary,
            hottestDay: forecast.daily.data.find(function (o) { return o.temperatureMax == maxTemp; }),
            coolestDay: forecast.daily.data.find(function (o) { return o.temperatureMin == minTemp; }),
            distance: await this.checkDistance(lat, lon)
        }

        return adviseresp;
    }

    public async checkDistance(lat, lon): Promise<object> {

        let distance;
        let distArray: Array<object> = [];
        let waterpoints = await this.genericController.allSensors();
        waterpoints = JSON.parse(waterpoints);

        for (var i = 0; i < waterpoints.data.sites.length; i++) {
            distance = await this.calcDistance(lat, lon, waterpoints.data.sites[i].site_lat, waterpoints.data.sites[i].site_lon, "K");
            const disAdvice = {
                distance: distance,
                mwaterid: waterpoints.data.sites[i].mwater_id,
                yieldRate: waterpoints.data.sites[i].yield_rate,
                siteName: waterpoints.data.sites[i].site_name,
                county: waterpoints.data.sites[i].county,
                status: waterpoints.data.sites[i].status_id
            };
            distArray.push(disAdvice);
        }
        return distArray;
    }

    private async calcDistance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist;
        }
    }
}