const userManage = require('../models/user');

const md5 = require('md5');


module.exports.postLogin = async function (req, res, next) {
    var pass = req.body.pass;
    var user;
    console.log(req.body)
    if (req.body == {}){
        res.send(req);
        return
    }
    await userManage.find({
        email: req.body.name
    }, function (err, data) {
        
        if (err) {
            console.log(err);
        }
        try {
            user = data[0];
        } catch (err) {
            console.log(err);
        } 

        var error = [];
 

        if (!user) {
            res.send('login', {
                error: [
                    'Name does not exist!'
                ],
                value: req.body
            });
            return;
        }

        if (user.pass !== md5(pass)) {
            res.send('login', {
                error: [
                    'Wrong password!'
                ],
                value: req.body
            });
            return;
        }

        if (user.permitsion == false) {
            res.send( {
                error: [
                    'Cút ra!!!'
                ],
                value: req.body
            });
            return;
        }

        user.pass = ''
        delete req.body.pass
        req.body['userData'] = user
        next();
    })


}

module.exports.requestAuth = async function (req, res, next) {

    var id = req.signedCookies.userId;
    if (!id) {
        res.redirect('/auth/login');
        return;
    }

    console.log(id)
    var user;

    await userManage.find({
        _id: id
    }, function (err, data) {

        if (err) {

            if (err) console.log(err);
        }
        try {
            user = data[0];
        } catch (err) {
            console.log(err);
            res.redirect('auth/login');

        }
    })

    setTimeout(function () {
        if (!user || user.permitsion == false) {

            res.redirect('auth/login');
            return;
        }

        

        res.locals.user = user;
        next();
    }, 1000);

}


module.exports.postCreat = function (req, res, next) {
    var non_input = [];

    if (!req.body.name) {
        non_input.push("Name is require!");
    }

    if (!req.body.vendor) {
        non_input.push("Phone is require!");
    }

    if (!req.body.pass) {
        non_input.push("Password is require!");
    }

    if (non_input.length) {
        res.render('auth/creat', {
            request: non_input,
            value: req.body
        });
        return;
    }
    next();
}

module.exports.postCheckLogin = function (req, res, next) {
    var non_input = [];

    if (!req.body.name) {
        non_input.push("Name is require!");
    }


    if (!req.body.pass) {
        non_input.push("Password is require!");
    }

    if (non_input.length) {
        res.render('login', {
            error: non_input,
            value: req.body
        });
        return;
    }
    next();
}

module.exports.login = async function(req , res , next){
    const pass = req.body.pass;
    const email = req.body.email
    
    var user;

    await userManage.find({
        email: email
    }, function (err, data) {
        
        if (err) {
            console.log(err);
            return; 
        }
        try {
            user = data[0];
        } catch (err) {
            console.log(err);
        }

        console.log(user)
        req.body['status'] = 'Đăng nhập thành công!'
        req.body['success'] = false
        if (user == undefined) {
            console.log('No user find!')
            req.body['status'] = 'Sai email!'

            next()
            return 
        }

        if (user.pass !== md5(pass)) {
            req.body['status'] = 'Sai mật khẩu!'

           next()
           return
        }
        delete req.body.email
        delete req.body.pass
        delete user.pass
        req.body['userData'] = user
        req.body.success = true
        // console.log(1)
        next();
    })

 
}