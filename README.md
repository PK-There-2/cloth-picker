# 👗 Bhoomi / Kaya - AI Virtual Closet

Welcome to **Bhoomi** (also known as Kaya), your personal AI Stylist and Virtual Closet! This project is designed to help you digitize your wardrobe, generate stylish outfit combinations, and get personalized fashion advice powered by advanced Artificial Intelligence.

## 🌟 What does this project do?
In simple terms, this app acts like a virtual closet where you can upload photos of your clothes. The AI analyzes these photos to figure out what the clothing item is (e.g., "Red Cotton T-Shirt"). 

Once your clothes are in the system, you can chat with **Kaya** (the AI stylist). She knows exactly what is in your closet and what your style preferences are, so she can give you incredibly personalized advice, like:
- *"What should I wear to a business meeting tomorrow?"*
- *"Does this red shirt go with these green pants?"*

## 🛠️ How does it work? (The Tech Stack)

This project is built using a modern **Monorepo** architecture, meaning it is split into two main parts: a **Frontend** (what the user sees) and a **Backend** (the brain that does the heavy lifting).

### 1. The Frontend (The User Interface)
The frontend is the visual app you interact with in your browser. 
- **React & Vite**: These are the building blocks of the website. React creates the interactive buttons and pages, while Vite makes the development process lightning fast.
- **Tailwind CSS**: This is how we make the app look beautiful, using modern styling, glassmorphism, and smooth animations.
- **Firebase**: We use Firebase for two main things:
  - **Authentication**: Letting users log in securely.
  - **Firestore (Database)**: Storing the user's clothing inventory, saved outfits, and preferences securely in the cloud.
- **Hosted on**: **Vercel** (for blazing fast, global delivery to users).

### 2. The Backend (The AI Brain)
The backend is a hidden server that processes complex AI tasks. We separated this from the frontend because AI workflows take a long time to run (sometimes up to 30 seconds), and standard frontend hosting would crash.
- **Python & FastAPI**: The language and framework used to build our custom API server. It is incredibly fast and great for AI tasks.
- **LangChain & LangGraph**: These are the tools we use to build our "Agentic AI". Instead of just sending a message to a chatbot, our AI has a "workflow":
  1. **Think**: The AI analyzes your question and your preferences.
  2. **Search**: If it doesn't know the answer (e.g., "What are the latest winter trends in 2024?"), it literally browses the internet to find out!
  3. **Generate**: It combines its internet research, your closet inventory, and your personal style to give you the perfect answer.
- **Google Gemini (1.5 Flash)**: The actual Large Language Model (LLM) powering the brain. We use Gemini because it is incredibly fast and has amazing "Vision" capabilities (it can look at photos of your clothes and describe them perfectly).
- **Hosted on**: **Render** (designed for long-running Python servers).

## 🚀 How they talk to each other
When you type a message to Kaya on the Frontend (Vercel), your app sends a request over the internet to the Backend (Render). The Backend runs the LangGraph AI workflow, talks to Google Gemini, maybe searches the internet, and then sends the final, perfect fashion advice back to your screen!
