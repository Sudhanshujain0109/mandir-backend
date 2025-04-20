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
const DBConfig_1 = require("../Config/DBConfig");
const HelperFunction_1 = require("../Middleware/HelperFunction");
const express = require('express');
const SearchRouter = express.Router();
SearchRouter.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified !== true) {
        return res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
    const { query, married } = req.query;
    if (!query) {
        return res.json({
            status: 400,
            message: "Query parameter is required",
            data: null
        });
    }
    const searchQuery = `%${query}%`;
    const marriedQ = `%${married}%`;
    const sql = `
        SELECT 'users' AS type, id, full_name, phone, email, address, gotra, occupation, age, married, gender, postal_address, image
        FROM users
        WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR married LIKE ?

        UNION ALL

        SELECT 'family_members' AS type, id, full_name, phone, email, address, gotra, occupation, age, married, gender, postal_address, image
        FROM family_members
        WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR married LIKE ?
    `;
    console.log(sql);
    DBConfig_1.connection.query(sql, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, marriedQ, marriedQ], (err, results) => {
        if (err) {
            return res.json({
                status: 500,
                message: 'Something went wrong',
                data: err
            });
        }
        return res.json({
            status: 200,
            message: 'Search results',
            data: results
        });
    });
}));
SearchRouter.get("/search-by-occupation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified !== true) {
        return res.json({
            status: 401,
            message: "Unauthenticated",
            data: null,
        });
    }
    const { query } = req.query;
    if (!query) {
        return res.json({
            status: 400,
            message: "Query parameter is required",
            data: null,
        });
    }
    const occupationQuery = `%${query}%`;
    const sql = `
        SELECT 'users' AS type, id, full_name, phone, email, address, gotra, occupation, age, married, gender, postal_address, image
        FROM users
        WHERE occupation LIKE ?

        UNION ALL

        SELECT 'family_members' AS type, id, full_name, phone, email, address, gotra, occupation, age, married, gender, postal_address, image
        FROM family_members
        WHERE occupation LIKE ?
    `;
    DBConfig_1.connection.query(sql, [occupationQuery, occupationQuery], (err, results) => {
        if (err) {
            return res.json({
                status: 500,
                message: "Something went wrong",
                data: err,
            });
        }
        return res.json({
            status: 200,
            message: "Search results by occupation",
            data: results,
        });
    });
}));
exports.default = SearchRouter;
//# sourceMappingURL=search_user.js.map