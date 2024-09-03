const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const apiKey = process.env.API_KEY;

const { GoogleGenerativeAI } = require("@google/generative-ai");

app.get("/suggestions", async (req, res) => {

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `please give me some general plant suggestions for ${req.query.location}, but sadly i do not have any other data like sunlight or climatic information. Please include crops, fruits, flowers and raw materials like cotton, jute, etc.`;

  const result = await model.generateContent(prompt);
  res.send(result.response.text());
});

app.listen(port, () => {
  console.log(`server running at port : ${port}`);
});
