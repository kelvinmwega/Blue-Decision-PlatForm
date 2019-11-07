import * as dotenv from 'dotenv';
//DO NOT COMMIT YOUR .env FILE
dotenv.config({ path: '.env' });
const config = {
    serviceName: process.env.SERVICENAME || 'node typescript postgres app',
    flexport: Number(process.env.FLEXPORT) || 3000,
    restport: Number(process.env.RESTPORT) || 3001,
    sharedSecret: "903478804d49739666d40f407f5876d28b5c0732a5b366d7eaefe0f6701579ae6e2707fc429b727256942527c86ae0d2e53478341c67de982b1f",
    host: process.env.HOST || "0.0.0.0",
    loggerLevel: 'debug'
}

export = config;