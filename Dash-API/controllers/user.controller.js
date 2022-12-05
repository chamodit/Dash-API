const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/keys").SECRET_KEY;

const signup = (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  let email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!fname) {
    return res.send({
      success: false,
      message: "First Name can not be blank.",
    });
  }
  if (!lname) {
    return res.send({
      success: false,
      message: "Last Name can not be blank.",
    });
  }
  if (!email) {
    return res.send({
      success: false,
      message: "Email can not be blank.",
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Password can not be blank.",
    });
  }
  if (password !== confirmPassword) {
    return res.send({
      success: false,
      message: "Password and Confirm Password are not matching",
    });
  }

  email = email.toLowerCase();

  User.find(
    {
      email: email,
    },
    (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error",
        });
      } else if (previousUsers.length > 0) {
        console.log("account exist");
        return res.send({
          success: false,
          message: "Account already exist.",
        });
      } else {
        const newUser = new User({
          fname,
          lname,
          email,
          password,
        });
        newUser.save((err, user) => {
          if (err === null) {
            return res.send({
              success: true,
              message: "New Account is created.",
            });
          } else if (err.errors.email) {
            return res.send({
              success: false,
              message: err.errors.email.message,
            });
          } else {
            return res.send({
              success: false,
              message: err.errors.password.message,
            });
          }
        });
      }
    }
  );
};

const signin = (req, res) => {
  if (!req.body.email) {
    return res.send({
      success: false,
      message: "E-mail is undefined",
    });
  }
  if (!req.body.password) {
    return res.send({
      success: false,
      message: "Password is undefined",
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: user.id,
          userName: user.userName,
          email: user.email,
        };
        jwt.sign(payload, jwtSecretKey, (err, token) => {
          if (err) throw err;
          return res.send({
            success: true,
            message: "Token is assigned",
            token: token,
            user: user,
          });
        });
      } else {
        return res.send({
          success: false,
          message: "Password is incorrect",
        });
      }
    });
  });
};

const passwordReset = (req, res) => {};

module.exports = {
  signup,
  signin,
  passwordReset,
};
