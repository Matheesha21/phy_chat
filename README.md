# 🎓 USJ Physics Department AI Assistant

An AI-powered web application developed for the **Department of Physics, University of Sri Jayewardenepura**. The system provides students with an intelligent virtual assistant capable of answering department-related questions, providing academic information, and assisting with basic physics concepts through natural language conversations.

---

## 📖 Overview

The USJ Physics Department AI Assistant is designed to improve access to academic information by providing students with a conversational interface. Instead of searching through notices or contacting lecturers for common questions, students can interact with an AI assistant that delivers accurate, context-aware responses.

The assistant combines structured university data stored in a MySQL database with Google's Gemini AI to provide reliable answers about department activities and general physics topics.

---

## ✨ Features

### 🤖 AI Chat Assistant

* Natural language conversations
* Google Gemini AI integration
* Context-aware responses
* Conversation history

### 📅 Lecture Information

* Lecture schedules
* Lecture times
* Course information
* Semester schedules

### 👨‍🏫 Lecturer Directory

* Lecturer profiles
* Contact information
* Office locations
* Subjects taught

### 🏛️ Hall Information

* Lecture hall locations
* Laboratory information
* Room availability
* Building details

### 📢 Department Information

* Announcements
* Frequently Asked Questions
* Academic notices
* Department information

### 📚 Physics Support

* Basic physics explanations
* Formula assistance
* Concept clarification
* Educational guidance

---

# 🏗️ System Architecture

```
React Frontend
       │
       ▼
FastAPI Backend
       │
 ┌───────────────┐
 │               │
 ▼               ▼
MySQL       Google Gemini AI
       │
       ▼
AI Response
```

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* Magic Patterns (UI Design)

## Backend

* Python 3.12+
* FastAPI
* Uvicorn

## Database

* MySQL 8
* SQLAlchemy 2.0
* Alembic

## AI

* Google Gemini API
* Google AI Studio

## Validation

* Pydantic

## Version Control

* Git
* GitHub

---

# 📂 Project Structure

```
usj-physics-assistant/

├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── .env
│
├── docs/
├── README.md
└── LICENSE
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/your-username/usj-physics-assistant.git

cd usj-physics-assistant
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

Create a virtual environment.

```bash
python -m venv venv
```

Activate the virtual environment.

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run the API.

```bash
uvicorn app.main:app --reload
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

```env
DATABASE_URL=mysql+pymysql://username:password@localhost/usj_physics

GEMINI_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY

SECRET_KEY=YOUR_SECRET_KEY

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

# 📡 API Endpoints

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| POST   | `/api/chat`      | Chat with the AI assistant    |
| GET    | `/api/lectures`  | Retrieve lecture schedules    |
| GET    | `/api/lecturers` | Retrieve lecturer information |
| GET    | `/api/halls`     | Retrieve hall information     |
| GET    | `/api/faqs`      | Retrieve FAQs                 |
| GET    | `/api/notices`   | Retrieve department notices   |
| GET    | `/api/health`    | Health check                  |

---

# 🎯 Project Goals

* Improve student access to department information.
* Provide instant answers to common academic questions.
* Reduce repetitive administrative inquiries.
* Support students with introductory physics concepts.
* Deliver a modern AI-powered university assistant.

---

# 🔮 Future Enhancements

* Student authentication
* Admin dashboard
* Voice interaction
* PDF document search
* Retrieval-Augmented Generation (RAG)
* Sinhala language support
* Push notifications
* Examination schedules
* Laboratory booking system
* Course registration assistance

---

# 🤝 Contributing

Contributions are welcome.

Please create a feature branch, commit your changes, and submit a Pull Request for review.

---

# 📄 License

This project is developed for academic purposes for the **Department of Physics, University of Sri Jayewardenepura**.

---

# 👨‍💻 Developers

Developed with ❤️ using **FastAPI**, **React**, **MySQL**, and **Google Gemini AI**.
