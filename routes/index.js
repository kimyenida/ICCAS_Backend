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

    try{
        const openai = new OpenAIApi(configuration);

        const response = await openai.createChatCompletion({
            model : "gpt-3.5-turbo",
            messages : [{role:"user", content:`${prompt}`}],
        });
        return response.data.choices[0].message;
    } catch(error){
        console.error('error calling chatgpt api', error);
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
      res.send("F"); //실패 하면 F
    } else {
      res.send("T"); // 성공하면 T
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
    var report_results = await maria.queryreturn(`select * from health_reports where User_ID='${id}' and Report_unum = 1;`)
    if(report_results == 0){
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
    } else{
      res.send("건강정보 레포트를 받은 후에는 수정할 수 없습니다.");
    }
   
  }
});

//건강정보 get
router.get("/get/healthdata", async function (req, res) {
  var id = req.query.User_ID;
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
    res.send(`건강정보를 알려드립니다.\n
    공복시간 : ${hungry_time}', 걸음수 : '${walk}, 수면시간 : ${sleep}',
     수분섭취량 : '${water}', 섭취칼로리 : '${calorie}'`);
  }
});

//팀 신청 api
router.get("/get/recruit", async function (req, res) {
  var id = req.query.User_ID;
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


// 가중치 설정
const weights = {
  hungry_time: 10,
  sleep_time: 10,
  calorie_intake: 40,
  steps: 30,
  water_intake: 10
};

const targets = {
  hungry_time: 16,
  sleep_time: 8,
  calorie_intake: 1500,
  steps: 6000,
  water_intake: 2
};


router.get('/ask/report', async(req,res) => {
  var id = req.query.User_ID;
  var results = await maria.queryreturn(`select * from health_data where User_ID='${id}' and Model_SN =1;`)
  if(results == 0){
    res.send("오늘 저장한 건강정보가 없습니다!"+id);
  } else{
    var hungry_time = results[0].Hungry_Time;
    var walk = results[0].Walk;
    var sleep = results[0].Sleep_Duration;
    var water = results[0].Water_Intake
    var calorie = results[0].Calorie;

    const healthData = {
      hungry_time: hungry_time,
      sleep_time: sleep,
      calorie_intake: calorie,
      steps: walk,
      water_intake: water
    };
    // 각 요소에 가중치를 곱하여 점수 계산
    let healthScore = 0;
    for (const key in healthData) {
      healthScore += (healthData[key] / targets[key]) * weights[key];
    }

    // 100점 만점으로 스케일링
    // console.log(healthScore+"before");
    // if(healthScore >= 100){
    //   healthScore = 100;
    // }
    healthScore = Math.min(100, healthScore);
    console.log(healthScore+"after");

    var propmt_sentence = `
    '${id}'의 하루 건강목표는 물2L, 공복시간16시간이상, 6000보 이상걷기, 7시간 이상 8시간 이하 수면, 1500칼로리 섭취입니다. 
    이 사람의 오늘 공복시간은 '${hungry_time}'시간이고, 걸음수는 '${walk}'걸음이고, 수면시간은 '${sleep}'시간이고, 물 섭취량은 '${water}'L이고,
    오늘 '${calorie}'칼로리를 먹었습니다.이 사람의 건강리포트를 600자 이내로 써주요`

    const response = await callChatGPT(propmt_sentence);
    const response_s = response.content;
    var results = await maria.queryreturn(`select * from health_reports where User_ID='${id}' and Report_unum = 1;`)
    if(results == 0){
      if(response){
        var regquery = await maria.queryreturn(
          `insert into health_reports(User_ID, Report_gpt, Report_score) values('${id}','${response_s}','${healthScore}');`)
        //res.send(response_s+"\n"+healthScore);
        res.json({'response' : response_s, 'score' : healthScore.toFixed(0)});
      } else{
        res.status(500).json({'error':'fail......'});
      }
    }else{
      var get_results = await maria.queryreturn(`select * from health_reports where User_ID='${id}';`)
      var coco =  get_results[0].Report_gpt;
      var scoo = get_results[0].Report_score;
      var time = get_results[0].Report_time;
      res.json({'response' : coco, 'score' : scoo, "time" : time});
      //res.send("이미 건강정보 리포트를 발급하셨습니다!")
    }   
}
})


module.exports = router;
