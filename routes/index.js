var express = require('express');
var router = express.Router();

const maria = require('../database/connect/maria');

maria.queryreturn("show tables;").then(value=> {console.log(value)})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 회원가입 API
router.post('/reg',async(req,res)=>{
  var id = req.body.User_ID;
  var pwd = req.body.User_PW;
  var idoverlap = await maria.queryreturn(`select * from user_info where User_ID = '${id}' and User_PW = '${pwd}';`)
  if(idoverlap == 0){
    var regquery = await maria.queryreturn(`insert into user_info(User_ID,User_PW) values('${id}','${pwd}')`)
    if(regquery == 0){
      res.send("다시 시도해주세요!")
    } else{
      res.send("회원가입 성공!")
    }
  }
  else{
    res.send("이미 등록된 계정이 있습니다.")
  }
});


//로그인 API
router.post('/login', async function(req, res){
  var id = req.body.User_ID;
  var pwd = req.body.User_PW;
  var results = await maria.queryreturn(`select * from user_info where User_ID = '${id}' and User_PW = '${pwd}';`)
  if(results == 0){
    res.send("아이디 또는 비밀번호가 틀렸습니다")
  } else{
    var uid = results[0].User_ID;
    res.send(`로그인 성공! '${uid}'님 안녕하세요!`)
  }
});

module.exports = router;
