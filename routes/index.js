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
  var email = req.body.User_Email;
  var phone =req.body.User_Phone;
  var name = req.body.User_Name;
  var age = req.body.User_Age;
  var sex = req.body.User_sex;
  var bm = req.body.User_BM;
  var weight = req.body.User_Weight;
  var height = req.body.User_Height;
  var nickname = req.body.User_Nickname;
  var img = req.body.User_Img;
  var pt = req.body.User_Pt;


  var idoverlap = await maria.queryreturn(
    `select * from user_info
     where User_ID = '${id}' and User_PW = '${pwd}' 
     and User_Email = '${email}' and User_Phone = '${phone}' and User_Name = '${name}';`)
  if(idoverlap == 0){
    var regquery = await maria.queryreturn(`insert into user_info(
      User_ID,User_PW,User_Phone,User_Name,User_Email,User_Age,
      User_sex,User_BM,User_Weight,User_Height,User_Nickname,User_Img,
      User_pt) 
      values('${id}','${pwd}','${phone}','${name}','${email}',
      '${age}', '${sex}', '${bm}', '${weight}', '${height}',
       '${nickname}', '${img}', '${pt}')`)
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
