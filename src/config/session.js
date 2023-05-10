const express = require('express');
const Sequelize = require('sequelize');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();

//  kết nối đến cơ sở dữ liệu MySQL bằng thư viện Sequelize 
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        storage: "./session.mysql",
        logging: false,
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
            timezone: "+07:00"
        },
        timezone: "+07:00"
    }
);

// tạo một session
const sessionStore = new SequelizeStore({
    db: sequelize
});

// cấu hình session
const configSession = (app) => {
    app.use(session({
        key: "express.sid",
        secret: "secret",
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie : {
            httpOnly: false,
            secure: false,
            maxAge: (24 * 60 * 60 * 1000) // 1 day
        }
    }));
};

// đồng bộ hóa bảng cđl
sessionStore.sync();

module.exports = {
    configSession
};
