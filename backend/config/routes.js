var configDB = require('./database.js');
var express = require('express');
const usuariosController = require('../app/controllers/usuarios');
const proyectosController = require('../app/controllers/proyectos');
var Sequelize = require('sequelize');
//var pg = require('pg').native;
//var pghstore = require('pg-hstore');
var sequelize = new Sequelize(configDB.url);
var router = express.Router(); 

var User       = sequelize.import('../app/models/users');
User.sync();
var Project   = sequelize.import('../app/models/project');
Project.sync();
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('signup.ejs',{
            message: {}
        });
    });

   app.get('/inicio', function(req, res) {
        res.render('signup.ejs',{
            message: {}
        });
    });
    // PROFILE SECTION =========================
   /* app.get('/projects', isLoggedIn, function(req, res) {
        res.render('projects.ejs', {
            user : req.user
        });
    });*/

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
// =============================================================================
// CRUD MODEL USERS ==================================================
// =============================================================================

//app.get('/api/usuarios', isLoggedIn, usuariosController.getUsuarios);
app.get('/usuarios', isLoggedIn, function(req, res,next) {  //Todos los usuarios
   User.findAll().then(function(users) {
        res.render('usuarios.ejs', {
            users : users
        });
  });
});

app.get('/usuarios/:email', isLoggedIn, function(req, res) {  //Devuelve Un usuario segun email
  User.findOne({ where: { email: req.params.email }}).then(function(users) {
        res.render('usuario.ejs', {
            users : users
        });
  });
});

app.post('/usuarios', function(req, res) {  //Inserta usuarios
  User.create({ email: req.body.email }).then(function() {
    res.redirect('/profile');
  });
});

app.get('/form-usuarios',  isLoggedIn, function(req, res) {
        res.render('form-usuarios.ejs');
    });

// =============================================================================
// CRUD MODEL PROJECTS ==================================================
// =============================================================================
app.route('/projects')
//app.get('/api/usuarios', isLoggedIn, usuariosController.getUsuarios);
.get(isLoggedIn, function(req, res,next) {  //Todos los proyectos
   Project.findAll().then(function(project) {
        res.render('projects.ejs', {
            project : project
        });
  });
})

.get( isLoggedIn, function(req, res) {  //Devuelve Un prooyecto segun id
  Project.findOne({ where: { id: req.params.id }}).then(function(project) {
        res.render('projects.ejs', {
            project : project
        });
  });
})

.post(function(req, res) {  //Inserta projecto
    console.log(req.body.name);
  Project.create({ name: req.body.name, 
    construction_time: req.body.construction_time,
    registry_date : req.body.registry_date,
    creation_date : req.body.creation_date,
    description : req.body.description,
    address: req.body.address  }).then(function() {
 
    res.redirect('/projects');
  });
});

/*app.get('/projects',  isLoggedIn, function(req, res) {
        res.render('form-usuarios.ejs');
    });*/

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('inicio.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
    
    app.post('/login',function(req,res){
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();

    if (errors) {

        res.render('inicio',{message: 'errors'});

    }
    else{
        passport.authenticate('local-login', {
            successRedirect : '/projects', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        })(req,res); // <---- ADDD THIS
    }
});

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('inicio.ejs', { message: req.flash('loginMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/projects', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        /*app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // microsoft windowslive---------------------------------

        // send to microsoft windowslive to do the authentication
        app.get('/auth/windowslive', passport.authenticate('windowslive', { scope : ['wl.signin', 'wl.basic'] }));

        // the callback after google has authenticated the user
        app.get('/auth/windowslive/callback',
            passport.authenticate('windowslive', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));    */  
            
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/projects', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    /*// facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));
        //app.get('/connect/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
            //passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // microsoft windowslive ---------------------------------

        // send to microsoft windowslive to do the authentication
        app.get('/connect/windowslive', passport.authorize('windowslive', { scope : ['wl.signin', 'wl.basic', 'wl.emails'] }));

        // the callback after google has authorized the user
        app.get('/connect/windowslive/callback',
            passport.authorize('windowslive', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));*/
            
// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.email    = null;
        user.password = null;
        user.save()
            .then(function ()
            {res.redirect('/projects');})
            .catch(function () 
            {res.redirect('/projects');});
    });

    /*// facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebooktoken = null;
        user.save()
            .then(function ()
            {res.redirect('/profile');})
            .catch(function () 
            {res.redirect('/profile');});
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.googletoken = null;
        user.save()
            .then(function ()
            {res.redirect('/profile');})
            .catch(function () 
            {res.redirect('/profile');});
    });
    
    // microsoft ---------------------------------
    app.get('/unlink/windowslive', function(req, res) {
        var user          = req.user;
        user.windowslivetoken = null;
        user.save()
            .then(function ()
            {res.redirect('/profile');})
            .catch(function () 
            {res.redirect('/profile');});
    });

*/


// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
};