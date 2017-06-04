var configDB = require('./database.js');
var express = require('express');
const usuariosController = require('../app/controllers/usuarios');
const proyectosController = require('../app/controllers/proyectos');
var Sequelize = require('sequelize');
//var pg = require('pg').native;
//var pghstore = require('pg-hstore');
var sequelize = new Sequelize(configDB.url);
var router = express.Router();

var User = sequelize.import('../app/models/users');
User.sync();
var Project = sequelize.import('../app/models/project');
Project.sync();
module.exports = function (app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        res.sendfile('index.html', {
            message: {}
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
// =============================================================================
// CRUD MODEL USERS ==================================================
// =============================================================================

// =============================================================================
// CRUD MODEL PROJECTS ==================================================
// =============================================================================

    app.get('/api/projects', function (req, res) {
        Project.findAll().then(function (projects) {
            res.json(projects);
        });
    });

    app.get('/api/projects/:project_id', function (req, res) {
        Project.findOne(
            {
                where: {
                    id: req.params.project_id
                }
            }
        ).then(function (project) {
            res.json(project);
        });
    });

    app.post('/api/projects', function (req, res) {
        registry_date = new Date(req.body.registry_date);
        creation_date = new Date(req.body.creation_date);
        Project.create({
            name: req.body.name,
            construction_time: req.body.construction_time,
            registry_date: registry_date,
            creation_date: creation_date,
            description: req.body.description,
            address: req.body.address,
            motivation: req.body.motivation,
            beneficts: req.body.beneficts
        }).then(function (project) {
            res.send({mess: 'Project ' + project.name + ' was Created'})
        });
    });

    app.post('/api/projects/:project_id', function (req, res) {
        registry_date = new Date(req.body.registry_date);
        creation_date = new Date(req.body.creation_date);
        Project.update({
            name: req.body.name,
            construction_time: req.body.construction_time,
            registry_date: registry_date,
            creation_date: creation_date,
            description: req.body.description,
            address: req.body.address
        }, {
            where: {
                id: req.params.project_id
            }
        }).then(function (project) {
            res.json(project)
        });
    });

    app.delete('/api/projects/:project_id', function (req, res) {
        Project.destroy({
            where: {
                id: req.params.project_id
            }
        }).then(function () {
            Project.findAll().then(function (projects) {
                res.json(projects);
            });
        });
    });


// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('inicio.ejs', {message: req.flash('loginMessage')});
    });

    // process the login form

    app.post('/login', function (req, res) {
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {

            res.render('inicio', {message: 'errors'});

        }
        else {
            passport.authenticate('local-login', {
                successRedirect: '/projects', // redirect to the secure profile section
                failureRedirect: '/signup', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            })(req, res); // <---- ADDD THIS
        }
    });

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('inicio.ejs', {message: req.flash('loginMessage')});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/projects', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', {message: req.flash('loginMessage')});
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/projects', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function (req, res) {
        var user = req.user;
        user.email = null;
        user.password = null;
        user.save()
            .then(function () {
                res.redirect('/projects');
            })
            .catch(function () {
                res.redirect('/projects');
            });
    });

// route middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
    }
};