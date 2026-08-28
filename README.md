# 👗 Bhoomi / Kaya - AI Virtual Closet

Welcome to **Cloth Picker** (also known as Kaya), your personal AI Stylist and Virtual Closet! This project is designed to help you digitize your wardrobe, generate stylish outfit combinations, and get personalized fashion advice powered by advanced Artificial Intelligence.

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
The backend is a hidden server that processes complex AI tasks. We separated this from the frontend because AI workflows take a long time to run, and standard frontend hosting would time out. It is built in **Python** using **FastAPI** for high-speed API endpoints.

#### 🧠 The AI Architecture (LangChain & LangGraph)
At the core of the backend is an advanced "Agentic AI" system. Instead of just sending a message to a standard chatbot, our AI operates as an autonomous agent using the **ReAct (Reason + Act)** framework.

- **LangChain**: The foundational toolkit that lets our Python code talk to the AI model seamlessly. It provides the structures to give the AI memory, prompts, and tools.
- **LangGraph**: A state-machine framework that turns our AI into a multi-step workflow with a "Brain". Here is how the LangGraph workflow operates:
  1. **Think Node**: The AI analyzes your question and your style preferences (Context Engineering). It decides if it knows the answer or if it has reached a "Saturation Point" (meaning it needs more information).
  2. **Search Node**: If the AI hits a saturation point, it is equipped with a tool to autonomously browse the real-time internet (e.g., searching for "latest 2024 winter trends" or "current weather in New York").
  3. **Generate Node**: It synthesizes its internet research, your closet inventory, and your personal style feedback to generate the perfect, highly-contextualized response.

#### 🔍 Vision & Multimodal Capabilities
- **Google Gemini (1.5 Flash)**: The actual Large Language Model (LLM) powering the brain. We use Gemini specifically because of its incredible **Multimodal Vision**. When you upload a photo of a new shirt, Gemini literally looks at the image, identifies the fabric, color, style (e.g., "Old Money" vs "Funky"), and saves it to your digital closet.

#### 🔄 Dynamic Context & Feedback Loops
The AI is not static; it learns from you. 
- When you "like" or "dislike" an outfit suggestion, the frontend triggers a feedback loop.
- The backend updates your personal context vector.
- The next time you ask a question, the **Context Engineering** system automatically injects your updated preferences into the LangGraph workflow, ensuring the AI strictly adheres to what you actually like to wear!

- **Hosted on**: **Render** (designed for long-running Python servers).

## 🚀 How they talk to each other
When you type a message to Kaya on the Frontend (Vercel), your app sends a REST API request over the internet to the Backend (Render). The Backend triggers the LangGraph State Machine, evaluates your preferences, searches the internet if needed, calls the Gemini model, and then sends the final, perfect fashion advice back to your screen!
