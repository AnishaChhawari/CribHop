const User = require("../models/users");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}= req.body;
    let registerUser= new User({
        email:email,
        username:username
    });
    let registeredUser=await User.register(registerUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next();
        }
        req.flash("success","Welcome to CribHop");
        res.redirect("/listings");
    })
    
    }catch(err){
        console.log(err);
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=(req, res) => {   
    req.flash("success", "Welcome to CribHop, You are logged in!!!");
    res.redirect(res.locals.redirectUrl || "/listings");  // Fallback in case redirect URL is missing
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Successfully logged out");
        res.redirect("/listings");
    })
};