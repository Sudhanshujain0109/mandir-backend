import { connection } from "./DBConfig";

const express = require('express')

const ClearDB = express.Router()

import { verifyToken } from '../Middleware/HelperFunction';

const getTablesQuery = 'SHOW TABLES';


function clearDb(){
    connection.query(getTablesQuery,(err,result)=>{
        if(err){
         console.log(err);
         
        }
        result.forEach((row)=>{
            const tableName = row["Tables_in_jaiDB"]
           if (tableName !=='admin') {
             
             const truncateTableQuery = `TRUNCATE TABLE ${tableName}`;
 
             connection.query(truncateTableQuery, (err, truncateResult) => {
                 if (err) {
                    console.log(err);
                    
                 } else {
                   console.log(`cleared ${tableName}`);
                   
                 }
               });
           }
        })
    })
}

export default clearDb