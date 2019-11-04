package com.zaz.decisionplatform.util;

import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;

/**
 * Created by IBM on 10/18/2017.
 */

@Service
public class encoders {

    public String base44En(String username, String pass){

        String authString = username + ":" + pass;
//        System.out.println("auth string: " + authString);
        byte[] authEncBytes = Base64.encodeBase64(authString.getBytes());
        String authStringEnc = new String(authEncBytes);

        return authStringEnc;
    }

}
