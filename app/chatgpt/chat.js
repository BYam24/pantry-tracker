import * as dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default async function handleImageDescription(imageUrl) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe the item in this photo",
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "low",
            },
          },
        ],
      },
    ],
    max_tokens: 500,
  });

  return String(response.choices[0].message.content);
}
