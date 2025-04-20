import { connection } from "../Config/DBConfig";
import { verifyToken } from "../Middleware/HelperFunction";
const express = require('express');

const SearchRouter = express.Router();

SearchRouter.get("/search", async (req, res) => {
    const isVerified = verifyToken(req);
    if (isVerified !== true) {
        return res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }

    const { query , married } = req.query;
    if (!query) {
        return res.json({
            status: 400,
            message: "Query parameter is required",
            data: null
        });
    }

    const searchQuery = `%${query}%`;
    const marriedQ = `%${married}%`
    const sql = `
        SELECT 'users' AS type, id, full_name, phone, email, address, gotra, occupation, age, married, gender, postal_address, image
        FROM users
        WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR married LIKE ?

        UNION ALL

        SELECT 'family_members' AS type, id, full_name, phone, email, address, gotra, occupation, age, married, gender, postal_address, image
        FROM family_members
        WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ? OR married LIKE ?
    `;
console.log(sql)

    connection.query(sql, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, searchQuery,marriedQ,marriedQ], (err, results) => {
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
});



SearchRouter.get("/search-by-occupation", async (req, res) => {
  const isVerified = verifyToken(req);
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

  connection.query(sql, [occupationQuery, occupationQuery], (err, results) => {
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
});

export default SearchRouter;
