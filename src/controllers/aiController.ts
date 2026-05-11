import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const breakdownTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    // Protection against massive inputs to save tokens
    const safeTitle = title?.substring(0, 100);
    const safeDescription = description?.substring(0, 500);

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'AI Service not configured. Please add GEMINI_API_KEY to .env' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `INSTRUCTION: You are a strict productivity assistant. 
    TASK: Break down the following task into 4-6 small, actionable steps.
    TASK TITLE: "${safeTitle}"
    CONTEXT: "${safeDescription}"
    
    RULES:
    1. Only return a bulleted list using "-".
    2. Do not include any introductory or concluding text.
    3. If the input is nonsense or harmful, return "- Please provide a valid task description."
    4. Stay focused on the task provided.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ breakdown: text });
  } catch (error) {
    console.error('AI Breakdown Error:', error);
    res.status(500).json({ message: 'Failed to generate AI breakdown' });
  }
};
