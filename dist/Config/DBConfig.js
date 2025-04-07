"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const tables_1 = require("./tables");
var mysql = require('mysql2');
const encrypt = require('bcrypt');
const env = require('dotenv');
env.config();
const options = {
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
};
exports.connection = mysql.createConnection(options);
const configMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.connection.connect(function (err, result) {
        if (err) {
            console.log(options, "options");
            console.log(err, "error");
        }
        else {
            console.log(options, "options");
            console.log("Connected");
            exports.connection.query(`CREATE DATABASE IF NOT EXISTS jaiDB`, function (err, result) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log(err, "err");
                    }
                    else {
                        console.log("Database created or already exists");
                        exports.connection.query(tables_1.userTable);
                        exports.connection.query(tables_1.events);
                        exports.connection.query(tables_1.news);
                        exports.connection.query(tables_1.featured);
                        exports.connection.query(tables_1.admins);
                        exports.connection.query(tables_1.family_members);
                        exports.connection.query(tables_1.content);
                        exports.connection.query(tables_1.aboutApp);
                        exports.connection.query(tables_1.occupation);
                        exports.connection.query(tables_1.jeenvani);
                        const findUser = 'SELECT COUNT(*) as count FROM admin WHERE email = ?';
                        exports.connection.query(findUser, ["admin@yopmail.com"], (err, existingUser) => __awaiter(this, void 0, void 0, function* () {
                            console.log(existingUser);
                            console.log(err);
                            if (existingUser) {
                                if (existingUser[0].count == 0) {
                                    const pass = yield encrypt.hash(process.env.ADMIN_PASS, 10);
                                    const createdDate = new Date().toUTCString();
                                    const body = {
                                        email: process.env.ADMIN_USER,
                                        password: pass,
                                        created_at: createdDate
                                    };
                                    exports.connection.query('INSERT INTO admin SET ?', body, (err, result) => {
                                        console.log(err, "err");
                                        console.log(result, "result");
                                    });
                                }
                            }
                        }));
                    }
                });
            });
        }
    });
});
exports.default = configMongoDB;
//# sourceMappingURL=DBConfig.js.map