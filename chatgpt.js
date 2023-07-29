const{Configuration, OpenAIApi} = require("openai");

async function callChatGPT(prompt){
    const configuration = new Configuration({
        apiKey : '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',
    });

    try{
        const openai = new OpenAIApi(configuration);

        const response = await openai.createChatCompletion({
            model : "gpt-3.5-turbo",
            messages : [{role:"user", content:"Hello World"}],
        });
        return response.data.choices[0].message;
    } catch(error){
        console.error('error calling chatgpt api', error);
        return null;
    }
}