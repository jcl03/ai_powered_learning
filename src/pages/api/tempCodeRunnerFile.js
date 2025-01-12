import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Please set the OPENAI_API_KEY environment variable');
}

//ASSISTANT_ID_1
if (!process.env.ASSISTANT_ID_1) {
  throw new Error('Please set the ASSISTANT_ID_1 environment variable');
}

const openai = new OpenAI(process.env.OPENAI_API_KEY);

//retreive assistant
//get https://api.openai.com/v1/assistants/{assistant_id}
const assistant = openai.assistants.retrieve(
  process.env.ASSISTANT_ID_1
);

//create thread
const thread = openai.beta.threads.create();

//create message
const message = openai.beta.messages.create({
  thread_id: thread.id,
  role: 'user',
  content: 'Hello, World!',
});

temp_message = "are you openai, response ok if yes"

const openai_response = await openai.beta.threads.runs.create(thread.id, {
  assistant_id: process.env.ASSISTANT_ID_1,
  messages: [
    {
      role: 'user',
      content: temp_message,
    },
  ],
});

console.log(openai_response.data.messages[0].content);
