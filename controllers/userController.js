const User = require('../models/userModel');
const Entries = require('../models/eventEntries');
const clubjoin = require('../models/clubEntries');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const config = require('../config/config');

const randormstring = require('randomstring');
const { updateOne } = require('../models/userModel');
// const { updateOne } = require('../models/userModel');
// const { updateOne } = require('../models/eventEntries');
const session = require('express-session');

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

// for send mail
const sendVerifyMail = async (name, email, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Verification',
            html: '<p>Hii ' + name + ', please click here to <a href="http://127.0.0.1:3000/verify?id=' + user_id + '"> Verify </a> your mail.</p>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent:- ", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });

        console.log(updateInfo);
        res.render("email-verified");

    } catch (error) {
        console.log(error.message);
    }
}

// for reset password send mail
const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Reset Password',
            html: '<p>Hii ' + name + ', please click here to <a href="http://127.0.0.1:3000/forget-password?token=' + token + '"> Reset </a> your password.</p>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent:- ", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}


const loadRegister = async (req, res) => {
    try {
        res.render('registration');
    } catch (error) {
        console.log(error.message);
    }
}

const loadEventRegister = async (req, res) => {
    try {
        res.render('eventRegister');
    } catch (error) {
        console.log(error.message);
    }
}

// const loadClubRegister = async(req, res) => {
//     try {
//         res.render('clubRegister');
//     } catch (error) {
//         console.log(error.message);
//     }
// }

const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            bio: req.body.bio,
            branch: req.body.branch,
            batch: req.body.batch,
            insta: req.body.insta,
            roll: req.body.roll,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            password: spassword,
            is_admin: 0
        });

        const userData = await user.save();

        if (userData) {
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registration', { message: "Your registration done successfully. Please check your mail to verify your account." })
        } else {
            res.render('registration', { message: "Your registration has been failed." })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const entryDetails = async (req, res) => {
    try {
        const eventEntries = new Entries({
            name: req.body.name,
            insta: req.body.insta,
            roll: req.body.roll,
            email: req.body.email,
            mobile: req.body.mno,
            payment: 0,
            is_admin: 0
        });

        Entries.find({ roll: req.body.roll })
            .then(async resp => {
                if (resp.length != 0) {
                    res.render('eventRegister', { message: "Already Registered" })
                } else {
                    const entryData = await eventEntries.save();
                    if (entryData) {
                        res.render('eventRegister', { message: "Your registration done successfully for this event." })
                    } else {
                        res.render('eventRegister', { message: "Your registration has been failed." })
                    }
                }
            })
            .catch(err => {
                console.log(error)
            })
    } catch (error) {
        console.log(error.message);
    }
}

const clubDetails = async (req, res) => {
    try {
        const clubEntries = new clubjoin({
            name: req.body.name,
            clubname: req.body.clubname,
            insta: req.body.insta,
            branch: req.body.branch,
            batch: req.body.batch,
            roll: req.body.roll,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            payment: 0,
            is_admin: 0
        });


        clubjoin.find({ roll: req.body.roll })
            .then(async resp => {
                if (resp.length != 0) {
                    res.render('clubRegister', { message: "Already Registered" })
                } else {
                    const entryData = await clubEntries.save();
                    if (entryData) {
                        res.render('clubRegister', { message: "Your registration done successfully for this club." })
                    } else {
                        res.render('clubRegister', { message: "Your registration has been failed." })
                    }
                }
            })
            .catch(err => {
                console.log(error.message)
            })
    } catch (error) {
        console.log(error.message);
    }
}

// login user method started

const loginLoad = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const eventRegisterListLoad = async (req, res) => {
    try {
        const registeredStudentData = await Entries.find({ is_admin: 0 })
        res.render('eventRegistrationList', { eventEntries: registeredStudentData })
    } catch (error) {
        console.log(error.message);
    }
}

const clubRegisterListLoad = async (req, res) => {
    try {
        const registeredStudentData = await clubjoin.find({ is_admin: 0 })
        res.render('clubRegistrationList', { clubEntries: registeredStudentData })
    } catch (error) {
        console.log(error.message);
    }
}

const home = async (req, res) => {
    try {
        res.render('home');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });


        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', { message: "*Please verify your mail." });
                } else {
                    req.session.user_id = userData._id;

                    res.redirect('/home');
                }
            } else {
                res.render('login', { message: "*Invalid Email or Password" })
            }
        } else {
            res.render('login', { message: "*Invalid Email or Password" })
        }

    } catch (error) {
        console.log(error.message)
    }
}

const loadHome = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        const clubData = await clubjoin.find({ roll: userData.roll });

        req.session.clubArray = clubData;
        res.render('home', { user: userData, club: clubData });//
    } catch (error) {
        console.log(error.message);
    }
}

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

//forget password code started

const forgetLoad = async (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}
const forgetVerify = async (req, res) => {

    try {

        const email = req.body.email;
        const userData = await User.findOne({ email: email });

        if (userData) {

            if (userData.is_verified === 0) {
                res.render('forget', { message: "Please verify your mail." })
            } else {
                const randomstring = randormstring.generate();
                const updatedData = await User.updateOne({ email: email }, { $set: { token: randomstring } });
                sendResetPasswordMail(userData.name, userData.email, randomstring);
                res.render('forget', { message: "Please check your mail to reset your password." })
            }

        } else {
            res.render('forget', { message: "User Email is incorrect." })
        }

    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({ token: token });
        if (tokenData) {
            res.render('forget-password', { user_id: tokenData._id });
        } else {
            res.render('404', { message: "Token is Invalid." })
        }
    } catch (error) {
        console.log(error.message)
    }
}

const resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;

        const secure_password = await securePassword(password);
        const updatedData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_password, token: "" } });
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

//for verification send mail link
const verificationLoad = async (req, res) => {
    try {
        res.render('verification');
    } catch (error) {
        console.log(error.message);
    }
}
const sentVerificationLink = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            sendVerifyMail(userData.name, userData.email, userData._id);
            res.render('verification', { message: "Resent verification mail has been sent on your email id." })
        } else {
            res.render('verification', { message: "This email doesn't exist." })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const userProfileLoad = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        // const clubData = await clubjoin.findById(_id);
        // console.log(req.session.user_id )
        // console.log(clubjoin_id)
        //const clubData = await clubjoin.findById({ roll: req.session.club_id });
        // const registeredClub = await clubjoin.find({ _id: req.session.clubjoin_id })

        // .populate('clubname')
        //const clubData = await Entries.findById({ _id: req.session.eventEntries_id });
        // console.log(clubData)
        // res.render('user-profile', { user: userData, club: { "clubname": "amrit" } });
        res.render('user-profile', { user: userData, club: req.session.clubArray });
    } catch (error) {
        console.log(error.message);
    }
}

const loadClubRegister = async (req, res) => {
    try {
        const registeredClub = await clubjoin.find({ is_admin: 0 })
        res.render('clubRegister', { clubEntries: registeredClub });
    } catch (error) {
        console.log(error.message);
    }
}
//show user profile


//user profile edit and update

const editLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('edit', { user: userData });
        } else {
            res.redirect('/home');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async (req, res) => {
    try {
        if (req.file) {
            const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, bio: req.body.bio, branch: req.body.branch, batch: req.body.batch, insta: req.body.insta, roll: req.body.roll, email: req.body.email, mobile: req.body.mno, image: req.file.filename } });
        } else {
            const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, bio: req.body.bio, branch: req.body.branch, batch: req.body.batch, insta: req.body.insta, roll: req.body.roll, email: req.body.email, mobile: req.body.mno } });
        }
        res.redirect('/home');
    } catch (error) {
        console.log(error.message);
    }
}

//Payment Gateway

var Publishable_Key = 'pk_live_51MWmOaSCSWbDemlqLDtbLPH6Pr0MSvzuWeJVBXyCBUBJ5PUdW8kNQBuJ128vxy3nIvfhhXkPbgC8qvoWh8D2KHTz00n9QL82gd'
var Secret_Key = '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'

const stripe = require('stripe')(Secret_Key)

const paymentHomeLoad = async (req, res) => {
    try {
        res.render('paymentHome', {
            key: Publishable_Key
        })
    } catch (error) {
        console.log(error.message);
    }
}

const paymentMainLoad = async (req, res) => {
    try {
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'ChitkaraClubs',
            address: {
                line1: 'Pinjore-Barotiwala National Highway (NH-21A)',
                postal_code: '174103',
                city: 'Indore',
                state: 'Himachal Pradesh',
                country: 'India',
            }
        })
            .then((customer) => {

                return stripe.charges.create({
                    amount: 2500,     // Charging Rs 25
                    description: 'Club Registration',
                    currency: 'INR',
                    customer: customer.id
                });
            })
            .then((charge) => {
                res.send("Success")  // If no error occurs
            })
            .catch((err) => {
                res.send(err)       // If some error occurs
            });
    } catch (error) {
        console.log(error.message);
    }
}






const loadStaccatos = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('staccatos', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}

const loadHc = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('hc', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}

const loadCutC = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('cutC', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadCuArcs = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('cuArcs', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadEuphony = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('euphony', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadMathsPirates = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('mathsPirates', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadSufy = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('sufy', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadCsi = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('csi', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadAsclepius = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('asclepius', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadReaders = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('readers', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadNcc = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('ncc', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadNss = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('nss', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
const loadHappiness = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id });
        res.render('happiness', { user: userData });
    } catch (error) {
        console.log(error.message);
    }
}
// const loadPaymentPage = async(req, res) => {
//     try{
//         res.render('paymentPage');
//     }catch (error) {
//         console.log(error.message);
//     }
// }

module.exports = {
    loadRegister,
    loadEventRegister,
    loadClubRegister,
    insertUser,
    entryDetails,
    clubDetails,
    verifyMail,
    loginLoad,
    eventRegisterListLoad,
    clubRegisterListLoad,
    verifyLogin,
    loadHome,
    home,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sentVerificationLink,
    editLoad,
    updateProfile,
    userProfileLoad,
    loadStaccatos,
    loadHc,
    loadCutC,
    loadCuArcs,
    loadEuphony,
    loadMathsPirates,
    loadSufy,
    loadCsi,
    loadAsclepius,
    loadReaders,
    loadNcc,
    loadNss,
    loadHappiness,
    paymentHomeLoad,
    paymentMainLoad
}