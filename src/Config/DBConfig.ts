import { aboutApp, admins, content, events, family_members, featured, news, userTable,occupation, jeenvani } from "./tables";

var mysql = require('mysql2');

const encrypt = require('bcrypt');
const env = require('dotenv')
env.config()
const options = {
  host: process.env.HOST,
  user: process.env.USER_NAME,
  password:process.env.PASSWORD,
  database: process.env.DBNAME,
}
export const connection = mysql.createConnection(options);
const configMongoDB = async () => {

  connection.connect(function (err, result) {
    if (err) {
      console.log(options,"options");
      console.log(err, "error");
      
    } else {
       console.log(options,"options");
      console.log("Connected");
      connection.query(`CREATE DATABASE IF NOT EXISTS jaiDB`, async function (err, result) {
        if (err) {
          console.log(err, "err");
          
        } else {
          console.log("Database created or already exists");
          connection.query(userTable)
          connection.query(events)
          connection.query(news)
          connection.query(featured)
          connection.query(admins)
          connection.query(family_members)
          connection.query(content)
          connection.query(aboutApp)
          connection.query(occupation)
          connection.query(jeenvani)
          
  
          const findUser = 'SELECT COUNT(*) as count FROM admin WHERE email = ?'
          connection.query(findUser, ["admin@yopmail.com"], async (err, existingUser) => {
            console.log(existingUser);
            console.log(err);

            if (existingUser) {
              if (existingUser[0].count == 0) {
                const pass = await encrypt.hash(process.env.ADMIN_PASS, 10);
                const createdDate = new Date().toUTCString()
                const body = {
                  email: process.env.ADMIN_USER,
                  password: pass,
                  created_at: createdDate
                }
                connection.query('INSERT INTO admin SET ?', body, (err, result) => {
                  console.log(err, "err");
                  console.log(result, "result");
                })
              }
            }
          })
        }
      });
    }
      
  });
}
export default configMongoDB 