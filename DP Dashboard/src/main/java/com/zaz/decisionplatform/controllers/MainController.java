package com.zaz.decisionplatform.controllers;

import com.google.gson.JsonObject;
import com.zaz.decisionplatform.beans.User;
import com.zaz.decisionplatform.beans.userRegStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class MainController {
    @GetMapping("/")
    public String dashboard() {
        return "dashboard";
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
