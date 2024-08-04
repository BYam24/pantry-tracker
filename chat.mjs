import * as dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//Text response only
// const response = await openai.chat.completions.create({
//   model: "gpt-3.5-turbo",
//   messages: [
//     {
//       role: "user",
//       content: [
//         {
//           type: "text",
//           text: "Hello!",
//         },
//       ],
//     },
//   ],
// });

// console.log(response.choices[0].message.content);

// const response = await openai.chat.completions.create({
//   model: "gpt-4o",
//   messages: [
//     {
//       role: "user",
//       content: [
//         {
//           type: "text",
//           text: "Describe this image",
//         },
//         {
//           type: "image_url",
//           image_url: {
//             url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtU1fapjCBiK2U9nF0MPJbnZQpNLxK12X-2w&s",
//             detail: "low",
//           },
//         },
//       ],
//     },
//   ],
//   max_tokens: 1000,
// });

// console.log(response.choices[0].message.content);

import fs from "fs";

const base64Image = fs.readFileSync("./images/menu.png", {
  encoding: "base64",
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Create a JSON structure for all the items on the menu. Return only the JSON, no other text.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/png;base64,${base64Image}`,
            detail: "low",
          },
        },
      ],
    },
  ],
  max_tokens: 1000,
});

console.log(response.choices[0].message.content);
