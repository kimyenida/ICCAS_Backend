// const { Configuration, OpenAIApi } = require("openai");

// const configiration = new Configuration({
//     organization: 'org-0uaQLaArF3m5pgctUePtq5OR',
//     apiKey: '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',
// });


// console.log('<<--- Hello Node.js ---->>');
// console.log('*- openai api tutorial...');

// const openai = new OpenAIApi(configiration);

// const runPrompt = async () => {
//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: "what is your name?",
//         max_tokens: 300,
//         temperature: 0.2,
//       });
//     console.log('- completion:\n' + response.data.choices[0].text);
//     console.log('\n- total tokens: ' + response.data.usage.total_tokens);
//     console.log('*- completion ended...');
// }
// //runPrompt();

// const runGPT35 = async (prompt) => {
//   const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//   });
//   console.log(response.data.choices[0].message.content);
// };

// runGPT35("너 이름이 뭐야");

const healthData = {
  hungry_time: 7,
  sleep_time: 8,
  calorie_intake: 100,
  steps: 6000,
  water_intake: 0.5
};

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


// 각 요소에 가중치를 곱하여 점수 계산
let healthScore = 0;
for (const key in healthData) {
  healthScore += (healthData[key] / targets[key]) * weights[key];
}

// 100점 만점으로 스케일링
healthScore = Math.min(100, healthScore);

console.log(`건강점수: ${healthScore.toFixed(2)}`);
