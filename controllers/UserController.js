const bcrypt = require('bcryptjs')
const User = require('../models/User')


exports.editProfilePasswordProcess = (req, res, next) => {
    const password = req.body.password;
    const userId = req.session.user._id;
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);
    User.findById(userId)
        .then(user => {
            user.password = hashedPassword
            return user.save();
        })
        .then(
            res.redirect('/login')
        );
}

exports.editProfileProcess =(req,res) =>{
    const name = req.body.name;
    const email = req.body.email;
    console.log(name)
    console.log(email)
    const userId = req.session.user._id;
    User.findById(userId)
        .then(user => {
            user.name = name;
            user.email = email;
            return user.save();
        })
        .then(
            res.redirect('/login')
        );

}

exports.editProfile =(req,res) =>{
    // console.log('_________________________________________')
    // console.log(req.session.user);
    // console.log('_________________________________________')
    res.render('editProfile', {
        title: 'LMS | EditProfile'
    });
}

exports.loginForm = (req, res) => {
    const data = {
        title: 'LMS | Login'
    }
    res.render('login', data)
}

exports.loginProcess = (req, res) => {
    const { email, password } = req.body
    
    User.findOne({ email })
        .then(user => { //user = new User()
            if(user) {
                const valid = bcrypt.compareSync(password, user.password)
                
                if(valid) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                    if(err) console.log(err);
                    else res.redirect('/courses/listCourses');
                    });
                } else {
                    console.log('Not Valid Password')
                    res.redirect('/login')
                }
            } else {
                console.log('No User')
                res.redirect('/login')
            }
        })
        .catch(err => {
            console.log('Something went wrong')
            res.redirect('/login')
        })
}

exports.registerProcess = (req, res) => {
    const { name, email, password } = req.body
    
    const user = new User()
    
    user.name = name
    user.email = email
    
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    
    user.password = hash
    
    user.save()
        .then(() => res.redirect('/login'))
        .catch(err => res.send(err))
}

exports.dashboard =(req,res) => {
    const data = {
        title: 'LMS | My Dashboard page',
    }
    
    res.redirect('/courses/listCourses')
}