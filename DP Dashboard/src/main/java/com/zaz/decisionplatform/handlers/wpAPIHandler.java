package com.zaz.decisionplatform.handlers;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

public class wpAPIHandler {

    public JsonObject getSensors(){
        return reqProcessor("");
    }

    public JsonObject getDailyReadingsByCounty(String county){
         return reqProcessor(String.format("%s%s", "/daily-county-readings/", county));
    }

    public void getDailySensorReadingsBySiteId(String siteId){
        JsonArray data = reqProcessor(String.format("%s%s", "/readings/", siteId)).get("data").getAsJsonArray();
    }

    public JsonObject getDailyReadingsBySiteId(String siteId){
        return reqProcessor(String.format("%s%s", "/daily-readings/", siteId));
    }

    public JsonObject getSiteDetails(String siteId){
        return reqProcessor(String.format("%s%s", "/site/", siteId));
    }

    public JsonObject getSitesSummary(){
        return reqProcessor("/sites/summary");
    }

    public JsonObject getSitesStatusChanges(String timePeriod, String numberOfCycles){
        return reqProcessor(String.format("%s%s%s%s", "/status-changes/period/", timePeriod, "/cycles/", numberOfCycles));
    }

    private static JsonObject reqProcessor(String endPoint){
        String ResourceUrl = "https://waterpoint-engine-challenge-dev.mybluemix.net/sensors" + endPoint;

        System.out.println(ResourceUrl);

        HttpHeaders headers = new HttpHeaders();
        RestTemplate restTemplate = new RestTemplate();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        HttpEntity<String> entity = new HttpEntity<String>(headers);

        ResponseEntity<String> response = restTemplate.exchange(ResourceUrl, HttpMethod.GET, entity, String.class);
        System.out.println(response.getStatusCode());

        return new JsonParser().parse(response.getBody()).getAsJsonObject();

    }

}
