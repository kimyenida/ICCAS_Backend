var express = require("express");
var router = express.Router();

const app = express();

const maria = require("../database/connect/maria");

// const {callChatGPT} = require('../chatgpt');
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))

const { Configuration, OpenAIApi } = require("openai");

async function callChatGPT(prompt) {
  const configuration = new Configuration({
    apiKey: "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",
  });

  try {
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello World" }],
    });
    return response.data.choices[0].message;
  } catch (error) {
    console.error("error calling chatgpt api", error);
    return null;
  }
}

maria.queryreturn("show tables;").then((value) => {
  console.log(value);
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
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
    res.send("F");
  } else {
    //var uid = results[0].User_ID;
    //res.send(200).end();
    res.send(`T`);
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
    `select * from health_data where User_ID='${id}' and Model_SN =1;`
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

//팀 신청 api
router.get("/get/recruit", async function (req, res) {
  var id = req.body.User_ID;
  var end = "end";
  var results = await maria.queryreturn(
    `select * from team_info where User_ID='${id}';`
  );
  var results_end = await maria.queryreturn(
    `select * from team_info where Team_ID='${end}';`
  );
  if (results_end == 0) {
    if (results == 0) {
      var regquery = await maria.queryreturn(
        `insert into team_info(User_ID) values('${id}');`
      );
      res.send("팀 신청이 완료되었습니다!");
    } else {
      res.send("이미 신청하셨습니다.!");
    }
  } else {
    res.send("팀 모집기간이 아닙니다. 다음 팀 모집기간때 신청해주세요!");
  }
});

router.get("/ask", async function (req, res) {
  res.render("askgpt", {
    pass: true,
  });
});

router.post("/ask", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await callChatGPT(prompt);

  if (response) {
    res.send(response);
    //res.json({'response' : response});
  } else {
    res.status(500).json({ error: "fail......" });
  }
});

module.exports = router;
