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
//        handler.getDailySensoReadingsBySiteId("10388433");
//        handler.getDailyReadingsBySiteId("10388433");
//        handler.getSiteDetails("10388433");
//        handler.getSitesSummary();
    }

}
