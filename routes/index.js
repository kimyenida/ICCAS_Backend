var express = require("express");
var router = express.Router();

const maria = require("../database/connect/maria");

maria.queryreturn("show tables;").then((value) => {
  console.log(value);
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// 회원가입 API
router.post("/reg", async (req, res) => {
  var id = req.body.User_ID;
  var pwd = req.body.User_PW;
  var email = req.body.User_Email;
  var phone = req.body.User_Phone;
  var name = req.body.User_Name;
  var age = req.body.User_Age;
  var sex = req.body.User_sex;
  var bm = req.body.User_BM;
  var weight = req.body.User_Weight;
  var height = req.body.User_Height;
  var nickname = req.body.User_Nickname;
  var img = req.body.User_Img;

  var idoverlap = await maria.queryreturn(
    `select * from user_info
     where User_ID = '${id}' and User_PW = '${pwd}' 
     and User_Email = '${email}' and User_Phone = '${phone}' and User_Name = '${name}';`
  );
  if (idoverlap == 0) {
    var regquery = await maria.queryreturn(`insert into user_info(
      User_ID,User_PW,User_Phone,User_Name,User_Email,User_Age,
      User_sex,User_BM,User_Weight,User_Height,User_Nickname,User_Img) 
      values('${id}','${pwd}','${phone}','${name}','${email}',
      '${age}', '${sex}', '${bm}', '${weight}', '${height}',
       '${nickname}', '${img}')`);
    if (regquery == 0) {
      res.send("다시 시도해주세요!");
    } else {
      res.send("회원가입 성공!");
    }
  } else {
    res.send("이미 등록된 계정이 있습니다.");
  }
});

//로그인 API
router.post("/login", async function (req, res) {
  var id = req.body.User_ID;
  var pwd = req.body.User_PW;
  var results = await maria.queryreturn(
    `select * from user_info where User_ID = '${id}' and User_PW = '${pwd}';`
  );
  if (results == 0) {
    res.send("아이디 또는 비밀번호가 틀렸습니다");
  } else {
    var uid = results[0].User_ID;
    res.send(`로그인 성공! '${uid}'님 안녕하세요!`);
  }
});

//건강정보 post
router.post("/post/health", async function (req, res) {
  var hungry_time = req.body.Hungry_Time;
  var walk = req.body.Walk;
  var calorie = req.body.Calorie;
  var water = req.body.Water_Intake;
  var sleep = req.body.Sleep_Duration;

  var id = req.body.User_ID;
  var results = await maria.queryreturn(
    `select * from health_data where User_ID='${id}' and Model_SN = 1;`
  );

  if (results == 0) {
    var regquery = await maria.queryreturn(`insert into health_data(
        Hungry_Time,Walk,Sleep_Duration,Water_Intake,Calorie,User_ID) 
        values('${hungry_time}','${walk}','${sleep}','${water}','${calorie}','${id}')`);
    res.send("건강정보가 입력되었습니다!");
  } else {
    var regquery = await maria.queryreturn(
      `update health_data 
        set Hungry_Time = '${hungry_time}',
        Walk = '${walk}', 
        Sleep_Duration = '${sleep}',
        Water_Intake = '${water}',
        Calorie = '${calorie}' 
        where User_ID = '${id}' and Model_SN = 1;`
    );
    res.send("건강정보가 업데이트 되었습니다.!");
  }
});

//건강정보 get
router.get("/get/healthdata", async function (req, res) {
  var id = req.body.User_ID;
  var results = await maria.queryreturn(
    `select * from health_data where User_ID='${id}';`
  );
  if (results == 0) {
    res.send("다시 시도해주세요!");
  } else {
    var hungry_time = results[0].Hungry_Time;
    var walk = results[0].Walk;
    var sleep = results[0].Sleep_Duration;
    var water = results[0].Water_Intake;
    var calorie = results[0].Calorie;
    res.send(`건강정보를 알려드립니다.\n'
    + 공복시간 : ${hungry_time}', 걸음수 : '${walk}, 수면시간 : ${sleep}',
     수분섭취량 : '${water}', 섭취칼로리 : '${calorie}'`);
  }
});

module.exports = router;
