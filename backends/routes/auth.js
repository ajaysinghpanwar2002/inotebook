//importng express
const express = require('express');
//importing router
const router = express.Router();
// importing user
const User = require('../models/User');
//importing express validator 
const { body, validationResult } = require('express-validator');
//importing bcrypt
const bcrypt = require('bcryptjs');
//importing jwt token 
const jwt = require('jsonwebtoken');
//importing fetchuser file that we created to authenticate
var fetchuser = require('../middleware/fetchuser');

//this the secret code 
const JWT_SECRET = "ajaysisagoodboy";

//here we simply making post request to the thunderclient 
//Route 1: create a user using : Post "/api/auth/createuser". doesn't require auth . no login reqd
router.post('/createuser',[
    // it's jus a validation that name should of min 3 letters 
    body('name', 'Enter a valid name').isLength({min: 3}),
    // email should be geniune 
    body('email', 'enter a valid email').isEmail(),
    //password should be minimu 8 letters 
    body('password', 'enter min 8 character password').isLength({min:8})
] ,async (req,res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //agar errors aaye to hum essey pass krdenge 
    return res.status(400).json({ errors: errors.array() });
    }
    //check whether the user with this email already exists 
    try {
        
    
    // now it ll find the user with same email 
    let user = await User.findOne({email:req.body.email})

    // console.log(user) , (sirf yeh line dekhne ke liye lihe theh ki user exist krta h kee nhe just crooscheck)
    //agar with same email koi hua to then this will run 
    if(user){
        return res.status(400).json({error:"sorry a user with same email already exists "})
    }
    //now we are creating a salt 
    const salt = await bcrypt.genSalt(10); 
    
    //here we created a variable secPass 
    const secPass = await bcrypt.hash(req.body.password, salt);
    //creating a user for the mongoose model , check whether the user exists already 
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
    });
    //isses jab user authtoken bhejega tab hum usey verify krlenge 
    const data ={
        user:{
            id: user.id
        }
    }
    //yeh code to website (jwt.io) se uthaya h 
    const authtoken = jwt.sign(data, JWT_SECRET);
    
    // agar error aya kuch bhe in code or smh it will display error 500 and a message  
    // res.json(user)
    res.json({authtoken})
} catch (error) {
    console.error(error.message);   
    res.status(500).send("Internal server error");
}
})
// Route 2: authenticate a user using : post "/api/auth/login" . no login required
router.post('/login',[
    // email should be geniune 
    body('email', 'enter a valid email').isEmail(),
    body('password', 'passwords cannot be blank').exists()

] ,async (req,res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    //agar errors aaye to hum essey pass krdenge 
    return res.status(400).json({ errors: errors.array() });
    }
    //idhar we are verifying the data about the user email and pass.
    const{email, password} = req.body;
    try {
        //email agar koi galat dalega to 
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "please try to login with correct credentials"});
        }
        // agar koi galat password dalega , jo aynchronous function hota h usey await krte h  
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "please try to login with correct credentials"});
        }

        // agar sab kuch sahi raha to we ll return the payload
        const data ={
            user:{
                id: user.id
            }
        }
        //yeh code to website (jwt.io) se uthaya h 
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({authtoken})
    }  catch (error) {
        console.error(error.message);   
        res.status(500).send("internal server error ");
    }

});

//route 3: get logged in user details using : POST "/ai/auth/getuser". Login required
router.post('/getuser', fetchuser , async (req,res)=>{

try {
    // userId = req.user.id; 
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
}   catch (error) {
    console.error(error.message);   
    res.status(500).send("internal server error ");
}})











//we have to export also
module.exports = router;   


