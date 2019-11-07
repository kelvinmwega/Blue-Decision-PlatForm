import * as dotenv from 'dotenv';
//DO NOT COMMIT YOUR .env FILE
dotenv.config({ path:'.env'});
const config = {
    serviceName: process.env.SERVICENAME || 'node typescript postgres app',
    flexport: Number(process.env.FLEXPORT) || 3000,
    restport: Number(process.env.RESTPORT) || 3001,
    sharedSecret: "903478804d49739666d40f407f5876d28b5c0732a5b366d7eaefe0f6701579ae6e2707fc429b727256942527c86ae0d2e53478341c67de982b1f", 
    host: process.env.HOST || "0.0.0.0",
    loggerLevel: 'debug',
    db: {
        user: process.env.DB_USER || 'kelvin',
        database: process.env.DB || 'hellotractordb',
        password: process.env.DB_PASS || 'Zazone2345',
        // host: process.env.DB_HOST || 'postgres',
        // port: Number(process.env.DB_PORT) || 5432,
        host: process.env.DB_HOST || 'flex.hellotractor.com',
        port: Number(process.env.DB_PORT) || 35432,
        max: Number(process.env.DB_MAX_CLIENTS) || 100,
        idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS) || 30000
    }
}

export = config;