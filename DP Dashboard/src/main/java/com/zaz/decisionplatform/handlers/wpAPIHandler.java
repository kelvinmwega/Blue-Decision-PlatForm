package com.zaz.decisionplatform.handlers;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Objects;

public class wpAPIHandler {

    public void getSensors(){
        JsonArray sensors = reqProcessor("sensors").get("data").getAsJsonArray();
        System.out.println(sensors.get(0));
    }

    public void getDailyCountyReadingsByCounty(String county){
        JsonArray data = reqProcessor(String.format("%s%s", "sensors/daily-county-readings/", county)).get("data").getAsJsonArray();

        for (int i = 0; i == data.size(); i++){
            System.out.println(data.get(i));
        }
    }

    public void getDailySensoReadingsBySiteId(String siteId){
        JsonArray data = reqProcessor(String.format("%s%s", "sensors/daily-readings/", siteId)).get("data").getAsJsonArray();

        System.out.println(data.get(0));

    }

    public void getDailyReadingsBySiteId(String siteId){
        JsonArray data = reqProcessor(String.format("%s%s", "sensors/readings/", siteId)).get("data").getAsJsonArray();

        System.out.println(data.get(0));
    }

    public void getSiteDetails(String siteId){
        JsonObject data = reqProcessor(String.format("%s%s", "sensors/site/", siteId)).get("data").getAsJsonObject();

        System.out.println(data);
    }

    public void getSitesSummary(){
        JsonObject data = reqProcessor("sensors/sites/summary").get("data").getAsJsonObject();

        System.out.println(data);
    }

    private static JsonObject reqProcessor(String endPoint){
        String ResourceUrl = "https://waterpoint-engine-challenge-dev.mybluemix.net/" + endPoint;

        System.out.println(ResourceUrl);

        HttpHeaders headers = new HttpHeaders();
        RestTemplate restTemplate = new RestTemplate();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        ResponseEntity<String> response = restTemplate.exchange(ResourceUrl, HttpMethod.GET, entity, String.class);
        System.out.println(response.getStatusCode());
        return new JsonParser().parse(Objects.requireNonNull(response.getBody())).getAsJsonObject();

    }

}
