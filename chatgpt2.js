const { Configuration, OpenAIApi } = require("openai");

const configiration = new Configuration({
    organization: 'org-0uaQLaArF3m5pgctUePtq5OR',
    apiKey: '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',
});


console.log('<<--- Hello Node.js ---->>');
console.log('*- openai api tutorial...');

const openai = new OpenAIApi(configiration);

const runPrompt = async () => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "what is your name?",
        max_tokens: 300,
        temperature: 0.2,
      });
    console.log('- completion:\n' + response.data.choices[0].text);
    console.log('\n- total tokens: ' + response.data.usage.total_tokens);
    console.log('*- completion ended...');
}
//runPrompt();

const runGPT35 = async (prompt) => {
  const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
  });
  console.log(response.data.choices[0].message.content);
};

runGPT35("너 이름이 뭐야");