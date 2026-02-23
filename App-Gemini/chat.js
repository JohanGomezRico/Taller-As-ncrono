import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const historyPath = "./chat_history.json";

function loadHistory() {
  return JSON.parse(fs.readFileSync(historyPath, "utf-8"));
}

function saveHistory(data) {
  fs.writeFileSync(historyPath, JSON.stringify(data, null, 2));
}

async function chat(userMessage) {
  const data = loadHistory();

  const chatSession = model.startChat({
    history: data.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      parts: [{ text: m.content }]
    })),
    generationConfig: {
      temperature: data.params.temperature,
      topP: data.params.top_p,
      maxOutputTokens: data.params.max_output_tokens
    }
  });

  const result = await chatSession.sendMessage(userMessage);
  const response = result.response.text();

  data.messages.push({ role: "user", content: userMessage });
  data.messages.push({ role: "model", content: response });

  saveHistory(data);

  console.log("\n🤖 Gemini dice:\n", response);

  return response;
}

chat(`
las mujeres mas hermosas de colombia, quiero nombres
`);

/*
async function promptChainingExample() {
  const chain = [
    "Analiza el siguiente texto y extrae 3 ideas clave:\n Una empresa quiere reducir costos en su operación logística.",

    (prev) => `Convierte estas ideas en un JSON con este formato:
{
  "ideas": [
    { "titulo": "", "descripcion": "" }
  ]
}
Texto:
${prev}`,

    (prev) => `Con base en este JSON, genera 3 acciones concretas para un equipo técnico:
${prev}`
  ];

  let lastOutput = "";

  for (let i = 0; i < chain.length; i++) {
    const step = chain[i];
    const prompt = typeof step === "function" ? step(lastOutput) : step;

    console.log(`\n🧩 Paso ${i + 1} - Prompt:\n`, prompt);

    lastOutput = await chat(prompt);
  }

  console.log("\n🎯 Resultado final del Prompt Chaining:\n", lastOutput);
}


promptChainingExample();

*/