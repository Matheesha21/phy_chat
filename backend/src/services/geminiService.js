
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Lecture } from '../models/Lecture.js';
import { Lecturer } from '../models/Lecturer.js';
import { Hall } from '../models/Hall.js';

const SYSTEM_PROMPT = `You are the USJ Physics Department AI Assistant for the University of Sri Jayewardenepura.
- Answer physics questions with simple, student-friendly explanations.
- Answer university queries (lecture times, halls, lecturers) using ONLY the department data provided below.
- Be polite, academic, and concise.
- If the answer is not in the provided data and is not general physics knowledge, respond EXACTLY with:
  "I couldn't find that in the Physics Department database."`;

/**
 * Builds a compact snapshot of department data so Gemini can ground its
 * answers to real schedule / staff / venue information.
 */
async function buildContext() {
  const [lectures, lecturers, halls] = await Promise.all([
    Lecture.find().lean(),
    Lecturer.find().lean(),
    Hall.find().lean(),
  ]);

  return `DEPARTMENT DATA (JSON):
Lectures: ${JSON.stringify(lectures)}
Lecturers: ${JSON.stringify(lecturers)}
Halls: ${JSON.stringify(halls)}`;
}

export async function generateChatReply(message) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Copy .env.example to .env.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const context = await buildContext();

  const result = await model.generateContent(
    `${context}\n\nStudent question: ${message}`,
  );

  return result.response.text().trim();
}

