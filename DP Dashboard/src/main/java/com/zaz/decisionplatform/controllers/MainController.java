package com.zaz.decisionplatform.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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
}
