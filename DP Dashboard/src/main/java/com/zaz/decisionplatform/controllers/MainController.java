package com.zaz.decisionplatform.controllers;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.zaz.decisionplatform.beans.ICounty;
import com.zaz.decisionplatform.beans.User;
import com.zaz.decisionplatform.beans.userRegStatus;
import com.zaz.decisionplatform.handlers.wpAPIHandler;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class MainController {

    private wpAPIHandler apiHandler = new wpAPIHandler();

    @GetMapping("/")
    public String dashboard(Authentication authentication) {

        if (authentication.getName().equals("user@email.com")) {
            return "clientDash";
        } else {
            return "dashboard";
        }
    }

    @GetMapping("analytics")
    public String analytics(Model model, Authentication authentication) {

        if (authentication.getName().equals("user@email.com")) {
            model.addAttribute("county", new ICounty());
            List<ICounty> coun = apiHandler.getSensorsCountyArray("Wajir");
            model.addAttribute("county", coun);
            return "clientAnalytics";
        } else {
            model.addAttribute("county", new ICounty());
            List<ICounty> coun = apiHandler.getSensorsArray();
            model.addAttribute("county", coun);
            return "analytics";
        }
    }

    @GetMapping("client-analytics")
    public String clientanalytics(Model model) {
        return "clientAnalytics";
    }

    @GetMapping("login")
    public String login() {
        return "login";
    }

    @GetMapping("profile")
    public String profile(Model model, Authentication authentication) {

//        JsonObject userInfo = requestsController.getUserData(authentication);
//
//        model.addAttribute("name", "Name : " + userInfo.get("name").getAsString());
//        model.addAttribute("id", "ID : " + userInfo.get("id").getAsString());
//        model.addAttribute("email", "Email : " + userInfo.get("email").getAsString());
//        model.addAttribute("phone", "Phone :" + userInfo.get("phone").getAsString());

        return "profile";
    }

    @GetMapping("register")
    public String register(Model model) {
        userRegStatus stat = new userRegStatus();
        stat.setLoad(false);
        model.addAttribute("userForm", new User());
        model.addAttribute("stat", stat);
        return "register";
    }

    @PostMapping("register")
    public String submissionResult(@ModelAttribute("userForm") User user, Model model) {
        userRegStatus stat = new userRegStatus();
//        stat.setStatus(requestsController.createUser(user));
        stat.setLoad(true);
        model.addAttribute("stat", stat);
        return "register";
    }
}
