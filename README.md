# SkillTree — AI-Powered Skill Development Platform

SkillTree is an AI-powered skill development and career guidance platform designed for B.Tech and engineering students.

It provides structured learning roadmaps, visual skill progression, streaks, badges, projects, AI-based guidance, and resume analysis to help students develop career-ready technical skills.

## AI Integration

SkillTree uses the Google Gemini API to power its AI features.

The AI Mentor helps students by answering questions, providing learning guidance, and motivating them throughout their skill-development journey.

The AI Resume Scanner analyzes a student's resume and provides suggestions about suitable internship or career fields, areas for improvement, missing skills, and ways to strengthen the resume.

The Gemini API key is kept on the backend so that it is never exposed directly in the browser.

## Main Features

- Structured roadmaps for different technical career paths
- Interactive Skill Tree that grows as topics are completed
- Streak system for maintaining learning consistency
- Badges and achievements
- AI Mentor powered by Google Gemini
- AI Resume Scanner and career recommendations
- Project portfolio to store completed projects
- User profile and avatar customization
- Light and Dark themes
- Progress tracking across different skills

## Local Setup

1. Install Node.js 18+.

2. Install dependencies:

   npm install

3. Create your environment file:

   cp .env.example .env

4. Add your Gemini API key to `.env`:

   GEMINI_API_KEY=your_api_key_here

5. Start the server:

   npm start

6. Open the application:

   http://localhost:3000/skilltree-app.html

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Node.js
- Google Gemini API
- Browser Local Storage
- Vercel for deployment

## Security

The Gemini API key is stored as an environment variable and accessed only through the backend.

Never commit the real `.env` file or expose your Gemini API key publicly.

## Deployment

The application can be deployed using Vercel. The `GEMINI_API_KEY` should be configured securely through Vercel Environment Variables instead of being included in the source code.
