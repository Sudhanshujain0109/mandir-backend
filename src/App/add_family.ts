// import { connection } from "../Config/DBConfig";
// import { verifyToken } from "../Middleware/HelperFunction";

// const express = require('express')

// const AddFamily = express.Router()

// AddFamily.post("/add-member",async (req,res)=>{
//     const isVerified = verifyToken(req)
//     console.log(req.body,"req.body add");
    
//     if (isVerified===true) {
//         const {  id , members } = req.body;
//         let userIds = []
//         Promise.all(
//             members.map((member)=>{
               
                
//                return new Promise((resolve,reject)=>{

//                 const { full_name , email , phone , gender , occupation , age , address , married } = member
//                 connection.query("SELECT * FROM family_members WHERE email = ? OR phone = ?",[email,phone],(err,result)=>{
//                     if(err){
//                        reject(err)
//                     }
            
//                     const userExist = result
//                     console.log(userExist,"userExist");
                    
//                     if(userExist.length > 0){
//                         userIds.push(userExist[0].id)
//                        connection.query('UPDATE users SET members = ? WHERE id = ?',[JSON.stringify(userIds),id],(err,res)=>{
//                         if(err){
                           
//                             reject(err)
//                         }
//                        else{
//                         console.log(res,"res is if" );
                        
//                         resolve(res)
//                        }
//                        })
//                     }else{
//                         connection.query('INSERT INTO users SET ?',member,(err,res)=>{
//                             if(err){
//                                 console.log("err is ",err);
                                
//                                 reject(err)
//                             }
//                             else{
//                                 console.log("res is",res);
//                             connection.query('SELECT * FROM users WHERE email = ?',[email],(err,res)=>{
//                                 if(err){
//                                     reject(err)
//                                 }
//                                 if(res.length > 0){
//                                     userIds.push(res[0].id)
//                                     connection.query("UPDATE users SET members = ? WHERE id = ?",[JSON.stringify(userIds),id],(err,res)=>{
//                                         if(err){
//                                             reject(err)
//                                         }
//                                         resolve(res)
//                                     });
//                                 }
//                             });
//                             }
//                         });
                        
        
//                     }
//                 })
//                })
//             })
//         ).then((resolve)=>{
//             res.json({
//                 status: 200,
//                 message: 'Members Added', data: resolve
//             });
//         }).catch((err)=>{
//             res.json({
//                 status: 500,
//                 message: 'Something went wrong', data: err
//             });
//         })
//     } else {
//         res.json({
//             status: 401,
//             message: "Unauthenticated",
//             data: null
//         })
//     }
    
// })



// export default AddFamily


import { connection } from "../Config/DBConfig";
import { verifyToken } from "../Middleware/HelperFunction";
const express = require('express');

const AddFamily = express.Router();

AddFamily.post("/add-member", async (req, res) => {
    const isVerified = verifyToken(req);
    console.log(req.body, "req.body add");

    if (isVerified === true) {
        const { id, members } = req.body;
        let userIds = [];

        const existingMembers = [];

        // First, check if any members already exist
        Promise.all(
            members.map((member) => {
                return new Promise((resolve, reject) => {
                    const { email, phone } = member;

                    connection.query("SELECT * FROM family_members WHERE email = ? OR phone = ?", [email, phone], (err, result) => {
                        if (err) {
                            reject(err);
                        } else if (result.length > 0) {
                            existingMembers.push({
                                email,
                                phone
                            });
                            resolve(null);
                        } else {
                            resolve(member);
                        }
                    });
                });
            })
        ).then((results) => {
            // If any members already exist, return an error response
            if (existingMembers.length > 0) {
                return res.json({
                    status: 400,
                    message: 'Some family members already exist',
                    data: existingMembers
                });
            }

            // Otherwise, insert new members
            return Promise.all(
                results.filter(Boolean).map((member) => {
                    return new Promise((resolve, reject) => {
                        connection.query('INSERT INTO family_members SET ?', member, (err, insertRes) => {
                            if (err) {
                                reject(err);
                            } else {
                                console.log("New member added", insertRes);

                                connection.query("SELECT * FROM family_members WHERE email = ?", [member.email], (err, newRes) => {
                                    if (err) {
                                        reject(err);
                                    }

                                    if (newRes.length > 0) {
                                        userIds.push(newRes[0].id);
                                        connection.query("UPDATE users SET members = ? WHERE id = ?", [JSON.stringify(userIds), id], (err, updateRes) => {
                                            if (err) {
                                                reject(err);
                                            }
                                            resolve(updateRes);
                                        });
                                    }
                                });
                            }
                        });
                    });
                })
            );
        }).then((resolve) => {
            res.json({
                status: 200,
                message: 'Members added successfully',
                data: resolve
            });
        }).catch((err) => {
console.log(err,"req.body add");
            res.json({
                status: 500,
                message: 'Something went wrong',
                data: err
            });
        });
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
});

AddFamily.post("/update-family",(req,res)=>{
    try {
        let { id, full_name, email, gender, occupation, age, image, gotra, address,married } = req.body;

        const updateQuery = 'UPDATE family_members SET full_name = ?,email = ?,gender = ?,occupation = ?,age = ?,image = ?,gotra = ?,address = ?,isProfileCompleted = ?,married = ? WHERE id = ?'
        connection.query(updateQuery, [full_name, email, gender, occupation, age, image, gotra, address,1,married, id], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            } else {
                connection.query('SELECT * FROM users WHERE id = ?',[id],(err,result)=>{
                    if (err) {
                        res.json({
                            status: 500,
                            message: "Internal server error",
                            data: err
                        })
                    }else{
                        let existUser = result[0];
                        res.json({
                            status: 200,
                            message: "User Data",
                            data: existUser
                        })
                    }
                })

                
            }
        })
    } catch (error) {
      return   res.json({
            status: 500,
            message: 'Something went wrong',
            data: error
        });
    }
});

export default AddFamily;
