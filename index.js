const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const apiKey = process.env.API_KEY;

const { GoogleGenerativeAI } = require("@google/generative-ai");

app.get("/", (req, res) => {
  res.send(
    "please use the endpoint       https://sih-2024-six.vercel.app/suggestions?location={your_location_here}       followed by your district name"
  );
});

app.get("/suggestions", async (req, res) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `please give me some general plant suggestions for ${req.query.location}, but sadly i do not have any other data like sunlight or climatic information. Please include crops, fruits, flowers and raw materials like cotton, jute, etc. Also please provide data in json format including the text part you are sending. Also only send json data, no explanations or anything. No need to specify it as json with backticks.`;

  const result = await model.generateContent(prompt);
  res.send(JSON.stringify(result.response));
});

app.get("/encyclopedia", async (req, res) => {
  try {
    let PROJECT_ID = "i1k9pkau";
    let DATASET = "production";
    let QUERY = encodeURIComponent(
      '*[_type == "plant"]{_id,name,"image":image.asset->url,description,uses,planting,cautions}'
    );
    let QUERY2 = encodeURIComponent('*[_type == "plant"]');

    // Compose the URL for your project's endpoint and add the query
    let URL = `https://${PROJECT_ID}.api.sanity.io/v2022-03-07/data/query/${DATASET}?query=${QUERY2}`;

    fetch(URL)
      .then((res) => res.json())
      .then(({ result }) => {
        res.send(result);
      });
  } catch (error) {
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`server running at port : ${port}`);
});
