"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBConfig_1 = require("./DBConfig");
const express = require('express');
const ClearDB = express.Router();
const getTablesQuery = 'SHOW TABLES';
function clearDb() {
    DBConfig_1.connection.query(getTablesQuery, (err, result) => {
        if (err) {
            console.log(err);
        }
        result.forEach((row) => {
            const tableName = row["Tables_in_jaiDB"];
            if (tableName !== 'admin') {
                const truncateTableQuery = `TRUNCATE TABLE ${tableName}`;
                DBConfig_1.connection.query(truncateTableQuery, (err, truncateResult) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`cleared ${tableName}`);
                    }
                });
            }
        });
    });
}
exports.default = clearDb;
//# sourceMappingURL=EmptyDB.js.map