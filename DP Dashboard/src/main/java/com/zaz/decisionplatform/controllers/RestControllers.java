package com.zaz.decisionplatform.controllers;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.zaz.decisionplatform.handlers.wpAPIHandler;
import org.json.simple.parser.JSONParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class RestControllers {

    private wpAPIHandler apiHandler = new wpAPIHandler();


    @CrossOrigin
    @RequestMapping(value = "/getSensors",  method = RequestMethod.GET)
    public ResponseEntity<String> getMyDevices(Authentication authentication){
        return new ResponseEntity<>(apiHandler.getSensors().toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/getSensorsCounty/{county}", method = RequestMethod.GET)
    public ResponseEntity<String> getSensorsCounty(@PathVariable() String county) {
        return new ResponseEntity<>(apiHandler.getSensorsCounArray(county).toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/getSitesSummary",  method = RequestMethod.GET)
    public ResponseEntity<String> getSS(Authentication authentication){
        return new ResponseEntity<>(apiHandler.getSitesSummary().toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/getSitesSummaryCounty/{county}",  method = RequestMethod.GET)
    public ResponseEntity<String> getSitesSummaryCounty(@PathVariable() String county){
        JsonObject summary = apiHandler.getSitesStatusChanges("day", "1");
        JsonArray resp = new JsonArray();

        for (int i = 0; i < summary.get("data").getAsJsonArray().size(); i++){
            if (summary.get("data").getAsJsonArray().get(i).getAsJsonObject().get("siteName").getAsString().contains(county)){
                resp.add(summary.get("data").getAsJsonArray().get(i).getAsJsonObject());
            }
        }

        return new ResponseEntity<>(resp.toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/dailycountyreadings/{county}", method = RequestMethod.GET)
    public ResponseEntity<String> getDCR(@PathVariable() String county) {
        JsonObject resp = apiHandler.getDailyReadingsByCounty(county);
        return new ResponseEntity<>(resp.toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/dailyreadings/{siteid}", method = RequestMethod.GET)
    public ResponseEntity<String> getDRS(@PathVariable() String siteid) {
        JsonObject resp = apiHandler.getDailyReadingsBySiteId(siteid);
        return new ResponseEntity<>(resp.toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/sitedetails/{siteid}", method = RequestMethod.GET)
    public ResponseEntity<String> getSD(@PathVariable() String siteid) {
        JsonObject resp = apiHandler.getSiteDetails(siteid);
        return new ResponseEntity<>(resp.toString(), HttpStatus.OK);
    }

    @CrossOrigin
    @RequestMapping(value = "/status-changes/{timePeriod}/cycles/{noOfCycles}", method = RequestMethod.GET)
    public ResponseEntity<String> getSD(@PathVariable() String timePeriod, @PathVariable() String noOfCycles) {
        JsonObject resp = apiHandler.getSitesStatusChanges(timePeriod, noOfCycles);
        return new ResponseEntity<>(resp.toString(), HttpStatus.OK);
    }
}
