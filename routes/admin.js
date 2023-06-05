var express = require('express');
const { json } = require('express/lib/response');
var router = express.Router();
var pool = require('./pool');
var LocalStorage=require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage('./scratch');


/* GET users listing. */
router.get('/adminlogin', function(req, res, next) {
  res.render('login',{msg:''});
});

router.get('/adminlogout', function(req, res, next) {
    localStorage.clear()
    res.render('login',{msg:''});
  });

router.post('/chkadminlogin', function(req, res, next) {
   pool.query("select * from flights.admin where (emailid=? or mobileno=?) and password=?",[req.body.userid,req.body.userid,req.body.password],function(error,result){

if(error)
{
    console.log(error)
    res.redirect("login",{msg:'Server Error'})
}

else
{  if(result.length==1)
    { localStorage.setItem('admin',JSON.stringify({emailid:result[0].emailid,mobileno:result[0].mobileno}))
        res.render("Dashboard",{result:result[0]})
    }
    else
    {
        res.redirect("login",{msg:'Invalid UserId/Password'})
    }

}

   })
  });

module.exports = router;