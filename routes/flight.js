var express = require('express');
var pool = require('./pool');
var upload = require('./multer')
var fs = require('fs')
var router = express.Router();
var LocalStorage=require("node-localstorage").LocalStorage;
var localStorage = new LocalStorage('./scratch');

router.get('/search', function(req, res, next) {

   res.render('searchflight',{msg:''});
  
})

router.get('/searchflight',function(req,res,next){

  pool.query("select f.*,(select C.cityname from city C where C.cityid=f.sourcecityid) as sc,(select S.statename from states S where S.stateid=f.sourcestateid) as ss,(select S.statename from states S where S.stateid=f.destinationstateid) as ds,(select C.cityname from city C where C.cityid=f.destinationcityid) as dc from flight f where f.sourcecityid=? and f.destinationcityid=?",[req.query.sourcecity,req.query.destinationcity],function(error,result){

    if(error)
    { console.log(error)
      res.status(500).json([])
    }
    else{
      res.status(200).json(result)
    }

  })

})

router.get('/dashboardlogin', function(req, res, next) {
  var result=JSON.parse(localStorage.getItem('admin'))
  if(result)
  {
   res.render('dashboard',{msg:''});
  }
  else
  {
   res.render('login',{msg:''});
  }
})

router.get('/displaybyid', function(req, res, next) {
  pool.query('select f.*,(select C.cityname from city C where C.cityid=f.sourcecityid) as sc,(select S.statename from states S where S.stateid=f.sourcestateid) as ss,(select S.statename from states S where S.stateid=f.destinationstateid) as ds,(select C.cityname from city C where C.cityid=f.destinationcityid) as dc from flight f where f.flightid=?',[req.query.flightid],function(error,result){
 
    if(error)
    {
      res.render('displaybyflightid',{data:[]})
    }
    else{
      res.render('displaybyflightid',{data:result[0]})
    }
    })
})

router.get('/displayall', function(req, res, next) {
  var result=JSON.parse(localStorage.getItem('admin'))
  if(result)
   {
    pool.query('select f.*,(select C.cityname from city C where C.cityid=f.sourcecityid) as sc,(select C.cityname from city C where C.cityid=f.destinationcityid) as dc from flight f',function(error,result){
 
      if(error)
      {
        res.render('displayall',{data:[]})
      }
      else{
        res.render('displayall',{data:result})
      }
      })
   }
   else
   {
    res.render('login',{msg:''});
   }
 

  
});
/* GET home page. */

router.get('/addnewflights', function(req, res, next) {
   var result=JSON.parse(localStorage.getItem('admin'))
   if(result)
   {
    res.render('flightinterface',{msg:''});
   }
   else
   {
    res.render('login',{msg:''});
   }
 
  
});

router.get('/fetchallstates',function(req,res){

  pool.query('select * from states',function(error,result){

if(error)
{
  res.status(500).json([])
}
else{
  res.status(200).json(result)
}
})
})


router.get('/fetchallcity',function(req,res){

  pool.query('select * from city where stateid=?',[req.query.stateid],function(error,result){

if(error)
{
  res.status(500).json([])
}
else{
  res.status(200).json(result)
}
})
})

router.post("/addnewrecord",upload.single("logo"),function(req,res){

  var result=JSON.parse(localStorage.getItem('admin'))
  if(result)
  {
  
    console.log("BODY:",req.body)
    console.log("FILE:",req.file)
  
  if(Array.isArray(req.body.fclass))
  {
    var fclass= req.body.fclass.join("#")
  }
  else{
    var fclass= req.body.fclass  
  }
  
  if(Array.isArray(req.body.days))
  {
    var days= req.body.days.join("#")
  }
  else{
    var days= req.body.days  
  }
  
   
  
  pool.query("insert into flight(flightid,companyname,sourcestateid,sourcecityid,destinationstateid,destinationcityid,status,flightclass,sourcetiming,destinationtiming,days,logo)values(?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.flightid,req.body.companyname,req.body.sourcestate,req.body.sourcecity,req.body.destinationstate,req.body.destinationcity,req.body.status,fclass,req.body.sourcetime,req.body.destime,days,req.file.originalname],function(error,result){
  
  if(error)
  {
    res.render("flightinterface",{msg:'Server Error'})
  }
  else{
   
    res.render("flightinterface",{msg:'Record Submitted Successfully!'})
  }
  
  })
  }
  else
  {
   res.render('login',{msg:''});
  }


})


router.post("/editdeleterecord",function(req,res){


  var result=JSON.parse(localStorage.getItem('admin'))
  if(result)
  {
 
if(req.body.btn=='Edit')
{
if(Array.isArray(req.body.fclass))
{
  var fclass= req.body.fclass.join("#")
}
else{
  var fclass= req.body.fclass  
}

if(Array.isArray(req.body.days))
{
  var days= req.body.days.join("#")
}
else{
  var days= req.body.days  
}

 

pool.query("update flight set companyname=?,sourcestateid=?,sourcecityid=?,destinationstateid=?,destinationcityid=?,status=?,flightclass=?,sourcetiming=?,destinationtiming=?,days=? where flightid=?",[req.body.companyname,req.body.sourcestate,req.body.sourcecity,req.body.destinationstate,req.body.destinationcity,req.body.status,fclass,req.body.sourcetime,req.body.destime,days,req.body.flightid],function(error,result){

if(error)
{
  res.redirect("/flight/displayall")
}
else{
  
  res.redirect("/flight/displayall")
}

})
}
else
{  pool.query("delete from flight where flightid=?",[req.body.flightid],function(error,result){

  if(error)
  {
    res.redirect("/flight/displayall")
  }
  else{
    
    res.redirect("/flight/displayall")
  }
  
  })

}
  }
  else
  {
   res.render('login',{msg:''});
  }


})

router.get('/showpicture',function(req,res){

  res.render('showpicture',{flightid:req.query.flightid,companyname:req.query.companyname,logo:req.query.logo,msg:''})

})

router.post("/editpicture",upload.single("logo"),function(req,res){

  var result=JSON.parse(localStorage.getItem('admin'))
  if(result)
  {
    pool.query("update flight set logo=? where flightid=?",[req.file.originalname,req.body.flightid],function(error,result){
  
      if(error)
      {
        res.redirect("/flight/displayall")
      }
      else{
        fs.unlinkSync("D:/flightenquiry/public/images/"+req.body.oldlogo)
        res.redirect("/flight/displayall")
      }
      
      })
      
      
  }
  else
  {
   res.render('login',{msg:''});
  }

 
  
  })

module.exports = router;
