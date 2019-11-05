package com.zaz.decisionplatform.controllers;

import com.zaz.decisionplatform.handlers.wpAPIHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RestControllers {

    private wpAPIHandler apiHandler = new wpAPIHandler();

    @CrossOrigin
    @RequestMapping(value = "/getSensors",  method = RequestMethod.GET)
    public ResponseEntity<String> getMyDevices(Authentication authentication){
        return new ResponseEntity<>(apiHandler.getSensors().toString(), HttpStatus.OK);
    }
}
