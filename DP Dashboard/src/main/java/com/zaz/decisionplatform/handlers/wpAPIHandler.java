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

    public void getDailyCountyReadingsByCounty(String county){
        JsonArray data = reqProcessor(String.format("%s%s", "/daily-county-readings/", county)).get("data").getAsJsonArray();
    }

    public void getDailySensoReadingsBySiteId(String siteId){
        JsonArray data = reqProcessor(String.format("%s%s", "/daily-readings/", siteId)).get("data").getAsJsonArray();
    }

    public void getDailyReadingsBySiteId(String siteId){
        JsonArray data = reqProcessor(String.format("%s%s", "/readings/", siteId)).get("data").getAsJsonArray();
    }

    public void getSiteDetails(String siteId){
        JsonObject data = reqProcessor(String.format("%s%s", "/site/", siteId)).get("data").getAsJsonObject();
    }

    public void getSitesSummary(){
        JsonObject data = reqProcessor("/sites/summary").get("data").getAsJsonObject();
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
//        System.out.println(response.getBody());
        return new JsonParser().parse(response.getBody()).getAsJsonObject();

    }

}
