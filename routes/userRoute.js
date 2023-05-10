const express = require("express");
const user_route = express();
const session = require('express-session');

const config = require("../config/config")
user_route.use(session({secret: config.sessionSecret}));

const auth = require('../middleware/auth');

user_route.set('view engine', 'ejs');
user_route.set('views', './views/users');

const bodyParser = require('body-parser');
const parser=bodyParser.urlencoded({extended: false});
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended: false}))

const multer = require('multer');
const path = require('path');

user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function(req, file, cb){
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({storage: storage});

const userController = require("../controllers/userController");
const { sessionSecret } = require("../config/config");

user_route.get('/register',auth.isLogout, userController.loadRegister);
user_route.post('/register', upload.single('image'), userController.insertUser);

user_route.get('/eventRegistration',auth.isLogin, userController.loadEventRegister);
user_route.post('/eventRegistration', userController.entryDetails);

user_route.get('/clubRegistration',auth.isLogin, userController.loadClubRegister);
user_route.post('/clubRegistration', upload.single('image'), userController.clubDetails);

user_route.get('/eventRegisterList', auth.isLogin, userController.eventRegisterListLoad);

user_route.get('/clubRegisterList', auth.isLogin, userController.clubRegisterListLoad);

user_route.get('/verify', userController.verifyMail);
user_route.get('/', auth.isLogout, userController.loginLoad);
user_route.get('/login', auth.isLogout, userController.loginLoad);
user_route.post('/login', userController.verifyLogin);
user_route.get('/home', auth.isLogin, userController.loadHome);


user_route.get('/logout', auth.isLogin, userController.userLogout);
user_route.get('/forget', auth.isLogout, userController.forgetLoad);
user_route.post('/forget', userController.forgetVerify);
user_route.get('/forget-password', auth.isLogout, userController.forgetPasswordLoad);
user_route.post('/forget-password', userController.resetPassword);
user_route.get('/verification', userController.verificationLoad);
user_route.post('/verification', userController.sentVerificationLink);
user_route.get('/edit', auth.isLogin, userController.editLoad);
user_route.post('/edit', upload.single('image'), userController.updateProfile);
user_route.get('/user-profile', auth.isLogin, userController.userProfileLoad);
user_route.get('/staccatos', auth.isLogin, userController.loadStaccatos);
user_route.get('/hc', auth.isLogin, userController.loadHc);
user_route.get('/cutC', auth.isLogin, userController.loadCutC);
user_route.get('/cuArcs', auth.isLogin, userController.loadCuArcs);
user_route.get('/euphony', auth.isLogin, userController.loadEuphony);
user_route.get('/mathsPirates', auth.isLogin, userController.loadMathsPirates);
user_route.get('/sufy', auth.isLogin, userController.loadSufy);
user_route.get('/csi', auth.isLogin, userController.loadCsi);
user_route.get('/asclepius', auth.isLogin, userController.loadAsclepius);
user_route.get('/readers', auth.isLogin, userController.loadReaders);
user_route.get('/ncc', auth.isLogin, userController.loadNcc);
user_route.get('/nss', auth.isLogin, userController.loadNss);
user_route.get('/happiness', auth.isLogin, userController.loadHappiness);

user_route.get('/paymentHome', auth.isLogin, userController.paymentHomeLoad)
user_route.post('/paymentHome', auth.isLogin, userController.paymentMainLoad)

module.exports = user_route;