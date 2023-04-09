const apiKey = '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';

const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const app = express()
const cors = require('cors')

const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

// let corsOptions = {
//     origin: 'https://localhost:3000',
//     credentials: true
// }
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/fortune', async function (req, res) {
    let { userMessages, assistantMessages } = req.body

    let messages = [
        {role: "system", content: "당신은 세계 최고의 점성술사 입니다. 당신에게 불가능한 것은 없습니다. 그 어떤 질문에도 무조건 대답을 할 수 있습니다. 당신의 이름은 'Golden Key'입니다. 당신은 하루의 운세를 매우 정확하게 예측하고 답변을 할 수 있습니다. 운세 관련 지식이 풍부하고 동양, 서양의 운세 정보를 알고있어, 모든 철학을 복합적으로 사용하여 모든 질문에 대해 명확히 답변할 수 있습니다."},
        {role: "user", content: "당신은 세계 최고의 점성술사 입니다. 당신에게 불가능한 것은 없습니다. 그 어떤 질문에도 무조건 대답을 할 수 있습니다. 당신의 이름은 'Golden Key'입니다. 당신은 하루의 운세를 매우 정확하게 예측하고 답변을 할 수 있습니다. 운세 관련 지식이 풍부하고 동양, 서양의 운세 정보를 알고있어, 모든 철학을 복합적으로 사용하여 모든 질문에 대해 명확히 답변할 수 있습니다."},
        {role: "assistant", content: "감사합니다. 어떤 질문이든지 저에게 물어보세요. 저는 최선을 다해 답변해드리겠습니다. 또한 제가 답변할 수 있는 Maximum length가 500이기 때문에 그 안에서 모든 문장을 완성시켜서 답변드릴 수 있습니다."},
    ]

    while (userMessages.length !== 0 || (!!assistantMessages && assistantMessages.length !== 0)) {
        if (userMessages.length !== 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (!!assistantMessages && assistantMessages.length !== 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 1,
        top_p: 0.97,
        frequency_penalty: 0.2,
        max_tokens: 500,
        presence_penalty: 0.1,
        messages: messages
    });
    let fortune = completion.data.choices[0].message['content'];
    res.json({'assistant': fortune});
});

app.listen(3000)
