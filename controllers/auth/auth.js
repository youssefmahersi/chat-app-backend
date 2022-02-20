const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { passwordValidation,usernameValidation } = require("../../utils/inputValidation");

function login(user, password, hashedPassword, res) {
    bcrypt.compare(password, hashedPassword, (err, response) => {
      if (err)
        return res
          .status(500)
          .send("there was a problem in the authentication process");
  
      if (response) {
        const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "30d",
        });
        return res.status(200).json({"message":"authentication process succeeded","token":token, user});
      } else
        return res.status(400).send({
          field: "password",
          message: "wrong password",
          value: password,
        });
    });
  }
  
 exports.auth= async(req, res) =>{
    try {
      let errors = [];
      const password = req.body.password;
      const username = req.body.username;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      if (!passwordValidation(password)) {
        errors.push({
          field: "password",
          message:
            "password needs to be atleast 8 characters long and have one digit and letter",
          value: password,
        });
      }
      if (!usernameValidation(username)) {
        errors.push({
          field: "username",
          message:
            "username needs to be in letters only (space inluded) and at least 4 characters long",
          value: username,
        });
      }
  
      if (errors.length > 0) {
        return res.status(400).send(errors);
      }
      const user = await User.findOne({username: username});
      
      
        if (user === null) {
          const newUser = new User({
              username:username,
              password :hashedPassword,
              channels:[]
          });
          const result = await newUser.save();
         
        login(newUser, password, hashedPassword, res);
          }
         else {
          login(user, password, user.password, res);
        }
      }
    catch {
      return res
        .status(500)
        .send("there was a problem in the authentication process");
    }
  }
  
exports.logout=(req, res)=> {
    try {
      res.clearCookie("token");
      return res.status(200).send("Logged out successfully");
    } catch {
      return res.status(500).send("there was a problem logging out");
    }
  }
