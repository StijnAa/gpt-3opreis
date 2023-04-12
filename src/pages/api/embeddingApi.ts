import axios from "axios";
import jsonFromFile from "../../../public/embeddings.json";

const chat = async (req: any, res: any) => {
  console.log(req.body);

  const data = {
    model: "text-embedding-ada-002",
    input: req.body,
  };

  const response = await callApi("embeddings", "POST", data);
  const searchQueryEmbedding = response.data[0].embedding;

  const rankedChunks = jsonFromFile
    // Map each file to an array of chunks with the file name and score
    .map((obj) => {
      const dotProduct = obj.embedding.reduce(
        (sum, val, i) => sum + val * searchQueryEmbedding[i],
        0
      );
      // Assign the dot product as the score for the chunk
      return { ...obj, score: dotProduct };
    })

    // Sort the chunks by their scores in descending order
    .sort((a, b) => b.score - a.score)
    // Filter the chunks by their score above the threshold
    .filter((chunk) => chunk.score > 0.81);

  if (rankedChunks) {
    res.status(200).json(rankedChunks);
  } else {
    res.status(500).json("error");
  }
};

const API_BASE_URL = "https://api.openai.com/v1/";

async function callApi(endpoint, method, body) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.OPENAIKEY,
    },
  };

  if (body) {
    options.data = body;
  }

  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    // Handle error
    console.error(error.response.status);
    console.error(error.response.statusText);
    console.error(error.response.data.error.message);
    return false;
  }
}

export default chat;
