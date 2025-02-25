# YouTube Intro Script Generator

## **Overview**
This project is a **one-page web application** that generates **YouTube intro scripts** using AI. It integrates **Hugging Face's LLM (Mixtral-8x7B)** via an API to generate engaging and well-structured video introductions.

The project consists of:
- **Frontend (Next.js)**: A simple UI with a content-editable input for the topic.
- **Backend API (Next.js API Routes)**: Communicates with Hugging Face's text-generation model via streaming.
- **Real-time Streaming**: Uses **Server-Sent Events (SSE)** to provide real-time updates while generating text.

---
## ** Tech Stack**
- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Model**: Hugging Face (Mixtral-8x7B-Instruct)
- **Streaming**: Server-Sent Events (SSE)
- **Deployment**: Vercel (Recommended)

---
## ** Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo/youtube-intro-generator.git
cd youtube-intro-generator
```

### **2️⃣ Install Dependencies**
```sh
yarn install  # or npm install
```

### **3️⃣ Set Up Environment Variables**
Create a **`.env.local`** file in the root directory and add:
```env
HUGGING_FACE_ACCESS_TOKEN=your_hugging_face_api_token
HUGGING_MODEL=mistralai/Mixtral-8x7B-Instruct-v0.1
```

**Note**: Get your Hugging Face API token from [Hugging Face](https://huggingface.co/settings/tokens).

### **4️⃣ Run the Development Server**
```sh
yarn dev  # or npm run dev
```
The application will be available at **`http://localhost:3000`**.

---
## ** Project Structure**
```
youtube-intro-generator/
│── src/
│   ├── app/
│   │   ├── layout.tsx   # Root Layout with global styles
│   │   ├── page.tsx     # Main Page (UI)
│   ├── api/
│   │   ├── stream/
│   │   │   ├── route.ts # API Route for AI-generated scripts
│   ├── components/
│   │   ├── ui/button.tsx  # Reusable button component
│   ├── styles/
│   │   ├── globals.css    # Global styles
│── public/
│── .env.local  # Environment Variables
│── README.md   # Documentation
│── package.json # Dependencies & Scripts
│── next.config.js # Next.js Config
│── tsconfig.json # TypeScript Config
```

---
## ** How It Works**
### **1️⃣ Enter a Topic**
- Users enter a **video topic** inside the **content-editable field**.
- The UI dynamically captures the topic.

### **2️⃣ Click "Generate"**
- A request is sent to the **Next.js API route (`/api/stream`)**.
- The **AI model (mistralai/Mixtral-8x7B-Instruct-v0.1)** generates a YouTube-style intro script.
- **SSE (Server-Sent Events)** allows real-time streaming of the response.

### **3️⃣ Receive Generated Script**
- The response is dynamically rendered on the UI.
- Users can **copy, edit, or modify the script as needed**.

---
## ** Deployment**
This project can be deployed on **Vercel** (Recommended).
### **1️⃣ Install Vercel CLI**
```sh
npm install -g vercel
```
### **2️⃣ Deploy to Vercel**
```sh
vercel
```
Follow the CLI instructions to deploy the app.

---
## ** API Details**
### ** Route: `/api/stream`** (GET Request)
#### ** Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt`  | `string` | Topic for the AI-generated YouTube intro |

#### ** Response Format**
The API streams back responses in **Server-Sent Events (SSE)** format:
```json
{"data": "Your generated script content..."}
```

---
## ** Troubleshooting & Common Issues**
### **1️⃣ API Key Issues**
- Ensure you have a valid **Hugging Face API token** in `.env.local`.
- Double-check that you’re using the correct **model name** in `HUGGING_MODEL`.

### **2️⃣ UI Not Updating on Input**
- Ensure `contentEditable` is correctly capturing user input.
- Debug using `console.log(topicRef.current?.innerText)`.

### **3️⃣ Incomplete AI Response**
- Try **increasing `max_new_tokens`** in `route.ts`.
- The model may have **token limits**, so experiment with different values.

---
## ** Future Enhancements**
✅ **Authentication (NextAuth.js, Firebase Auth)**
✅ **User Dashboard (Save Generated Scripts, History Tracking)**
✅ **Fine-tuning a Custom LLM for YouTube Scripts**
✅ **Paid Subscription Model (Stripe Integration)**




