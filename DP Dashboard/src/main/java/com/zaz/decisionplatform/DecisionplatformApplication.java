package com.zaz.decisionplatform;

import com.zaz.decisionplatform.handlers.wpAPIHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DecisionplatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(DecisionplatformApplication.class, args);

        wpAPIHandler handler = new wpAPIHandler();
//        handler.getSensors();
//        handler.getDailyCountyReadingsByCounty("Turkana");
//        handler.getDailySensoReadingsBySiteId("5691533");
//        handler.getDailyReadingsBySiteId("5691533");
        handler.getSiteDetails("5691533");
        handler.getSitesSummary();
    }

}
