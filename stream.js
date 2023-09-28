import 'dotenv/config.js'
import { setTimeout } from 'node:timers/promises'
import process from 'node:process'
import { AzureKeyCredential, OpenAIClient } from '@azure/openai'

const azureCredential = new AzureKeyCredential(process.env.AZURE_OPENAI_KEY);
const azureClient = new OpenAIClient(process.env.AZURE_OPENAI_ENDPOINT, azureCredential);
const azureDeploymentId = process.env.AZURE_OPENAI_ID;

const messages = [
  { role: "system", content: "You are a helpful machine learning teacher." },
  { role: "user", content: process.argv[2] }
];

const encoder = new TextEncoder()
for await (const event of azureClient.listChatCompletions(azureDeploymentId, messages, { stream: true })) {
  for (const choice of event.choices) {
    if (!choice.delta.content) continue
    for (const char of choice.delta.content.split("")) {
      await setTimeout(25)
      process.stdout.write(encoder.encode(char))
    }
  }
}

process.stdout.write(encoder.encode("\n"))
