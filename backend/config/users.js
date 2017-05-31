

var express = require("express");
var models = require("../models");
var mysql = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
           
    });


     /* router.get("/users",function(req,res){
       var query = "SELECT * FROM ??";
        var table = ["user"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
        models.users.findAll() .then function(Usuarios){
            res.ren
        }
    });*/

    router.get("/users/:user_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["user","id",req.params.user_id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });

    router.post("/users",function(req,res){
    	 req.checkBody('name', 'name is required').notEmpty();
    	 var errors = req.validationErrors();  //validacion 
    	 if (errors){
                res.json({"Error" : true, "Message" : "Error validating"});
            }
                else{
        var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var table = ["user","name","last_name","password","email",req.body.name,req.body.last_name,md5(req.body.password),req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
        }
    });

     router.put("/users",function(req,res){
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["user","password",md5(req.body.password),"email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
            }
        });
    });

      router.delete("/users/:email",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user","email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
            }
        });
    });
}


module.exports = REST_ROUTER;