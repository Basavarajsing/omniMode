# Omni-Mood: AI Emotion Analyzer

Omni-Mood is a sophisticated, web-based application that leverages Google's cutting-edge Gemini AI to perform real-time emotion analysis. It's a multimodal tool, capable of interpreting emotional cues from a variety of inputs including text, live voice, webcam snapshots, and uploaded image or video files. The results are presented in a visually intuitive dashboard, providing users with a deep dive into the emotional landscape of their data.

![Omni-Mood Screenshot](https://storage.googleapis.com/aistudio-project-images/readme_screenshots/omni-mood-analyzer-demo.png)

## Features

-   **Multimodal Analysis:** Analyze emotions from four distinct sources:
    1.  **Text:** Paste any text to get an emotional breakdown.
    2.  **Voice:** Record your voice in real-time; the app transcribes it and analyzes the emotion.
    3.  **Webcam:** Capture a snapshot from your webcam to analyze facial expressions.
    4.  **File Upload:** Upload image or video files for a comprehensive emotional assessment.
-   **Detailed Results:** For each analysis, receive:
    -   A **Primary Emotion** (e.g., Happy, Sad, Angry).
    -   A **Justification** sentence explaining the AI's reasoning.
    -   A **Bar Chart** visualizing confidence scores for a range of emotions (Happy, Sad, Angry, Surprised, Neutral, Fear).
-   **Video Frame Analysis:** For video uploads, the app automatically extracts keyframes and analyzes each one individually, providing a timeline of emotional shifts.
-   **Sleek & Responsive UI:** A modern, dark-themed interface built with React and Tailwind CSS that works seamlessly across devices.

---

## The AI/ML Pipeline: How It Works

This application does not train its own model. Instead, it acts as a smart client for the powerful, pre-trained **Google Gemini** model. The core of its AI capability lies in prompt engineering and structured data retrieval.

### Deep Learning Model: `gemini-2.5-flash`

The application exclusively uses the `gemini-2.5-flash` model via the `@google/genai` SDK. This model is a lightweight, fast, and cost-effective member of the Gemini family, yet it possesses powerful capabilities:

-   **Multimodality:** `gemini-2.5-flash` can understand and process information from multiple formats simultaneously. In this app, we send it a combination of text (the prompt) and image data (a user's photo, a video frame).
-   **Advanced Reasoning:** It can interpret nuanced human expressions, context in text, and body language in images to make sophisticated judgments about emotion.
-   **Instruction Following:** The model is highly adept at following specific instructions, which is key to getting reliable, structured output.

### Datasets and Training

The Gemini models are trained by Google on a massive and diverse dataset comprising trillions of words and billions of images from the public web, books, code, and other sources. This vast training data is what gives the model its deep understanding of language, visual concepts, and the connections between them. This application leverages that pre-existing knowledge without needing to be trained on a specialized emotion dataset.

### Prompt Engineering and Structured Output

The magic of this application is how it communicates with the Gemini API.

1.  **System Instruction:** Before sending any user data, we give the model a role: `"You are an expert emotion analyzer. Your response must strictly follow the provided JSON schema..."`. This sets the context and primes the model for the specific task.

2.  **Dynamic Prompting:** The text prompt sent to the model changes based on the input type:
    -   For text: `Analyze the emotion of the following text: "..."`
    -   For images/video frames: `Analyze the facial expression and body language in this image...`

3.  **Forced JSON with `responseSchema`:** This is the most critical part of the AI integration. We provide the Gemini API with a strict JSON schema that defines the exact structure of the response we need:
    ```json
    {
      "primaryEmotion": "string",
      "emotionScores": {
        "happy": "number",
        "sad": "number",
        // ... and so on
      },
      "justification": "string"
    }
    ```
    By setting `responseMimeType: "application/json"` and providing this schema, we force the model to *only* respond in valid JSON that matches this structure. This eliminates the need for unreliable string parsing on the frontend and ensures the data is always ready to be displayed in the UI components.

---

## Tech Stack & Core Concepts

-   **Frontend Library:** **React (v19)** with Hooks for state management (`useState`, `useCallback`, `useRef`, `useEffect`).
-   **Language:** **TypeScript** for type safety and improved developer experience.
-   **Styling:** **Tailwind CSS** (via CDN) for a utility-first, responsive design.
-   **AI Model SDK:** **`@google/genai`** for seamless communication with the Gemini API.
-   **Data Visualization:** **Recharts** for rendering the dynamic emotion score bar charts.
-   **Module System:** Native **ES Modules** with **Import Maps**. This modern approach avoids the need for a complex build setup (like Webpack or Vite) for this project's scope.

### Frontend Concepts Demonstrated

-   **Component-Based Architecture:** The UI is broken down into logical, reusable components (`Header`, `ModeSelector`, `ResultDisplay`, etc.).
-   **State Management:** Centralized state in the `App.tsx` component manages the current mode, results, loading status, and errors.
-   **Asynchronous Operations:** `async/await` is used extensively to handle API requests and file processing, with clear loading and error states for a smooth UX.
-   **Browser APIs:**
    -   **Web Speech API:** Used in `VoiceAnalysis.tsx` for real-time speech-to-text transcription.
    -   **MediaDevices (`getUserMedia`):** Used in `WebcamAnalysis.tsx` and `VoiceAnalysis.tsx` to access the camera and microphone.
    -   **File API & FileReader:** Used in `FileUploadAnalysis.tsx` to process local files.
-   **Client-Side Media Processing:** The `extractFramesFromVideo` utility uses `<canvas>` and `<video>` elements to pull individual frames from a video file directly in the browser, a task that traditionally might require a server.

---

## Project Structure

```
.
├── components/         # Reusable React UI components
│   ├── FileUploadAnalysis.tsx
│   ├── Header.tsx
│   ├── icons.tsx
│   ├── Loader.tsx
│   ├── ModeSelector.tsx
│   ├── ResultDisplay.tsx
│   ├── TextInputAnalysis.tsx
│   ├── VoiceAnalysis.tsx
│   └── WebcamAnalysis.tsx
├── services/           # Logic for communicating with external APIs (Gemini)
│   └── geminiService.ts
├── utils/              # Helper functions (e.g., file processing)
│   └── fileHelper.ts
├── App.tsx             # Main application component, manages state
├── env.js              # **IMPORTANT:** API key configuration file
├── index.html          # The single HTML entry point
├── index.tsx           # React application bootstrap
├── types.ts            # TypeScript type definitions for the app
└── README.md           # This file
```

---

## Getting Started: Running Locally in VS Code

Follow these steps to set up and run the project on your machine.

### Prerequisites

1.  **Visual Studio Code:** [Download here](https://code.visualstudio.com/).
2.  **Live Server Extension:** Install this from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
3.  **Google Gemini API Key:** Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
4.  **Modern Web Browser:** Chrome, Firefox, or Edge.

### Step 1: Add Your Gemini API Key

This is the most important step.

1.  Open the project folder in VS Code.
2.  Find and open the `env.js` file.
3.  You will see the following code:
    ```javascript
    window.process = {
      env: {
        API_KEY: 'PASTE_YOUR_GEMINI_API_KEY_HERE'
      }
    };
    ```
4.  Replace the placeholder `PASTE_YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key.
5.  Save the `env.js` file.

**Security Warning:** This method is for local development only. **Do not** commit the `env.js` file to a public Git repository with your key inside.

### Step 2: Run the Application

1.  In the VS Code Explorer panel, find the `index.html` file.
2.  Right-click on `index.html`.
3.  Select **"Open with Live Server"** from the context menu.
4.  Your default web browser will open a new tab to an address like `http://127.0.0.1:5500/`. The application will be running and ready to use.

---

## 🚀 Deployment with Vercel (The Correct Way)

Deploying this application is straightforward if you follow these exact steps. This process ensures Vercel handles your static files correctly without trying to run a build process it doesn't need.

### Prerequisites

1.  **A GitHub Account:** If you don't have one, [sign up here](https://github.com/).
2.  **A Vercel Account:** You can [sign up here](https://vercel.com/signup) using your GitHub account.

### Step 1: Push Your Project to GitHub

First, get your code into a GitHub repository.

1.  **Create a new repository on GitHub.** Go to [github.com/new](https://github.com/new).
2.  **Initialize Git and push your code.** Open a terminal in your project's root directory and run the following commands, replacing the placeholders with your GitHub details.

    ```bash
    git init
    git add .
    git commit -m "Initial commit of Omni-Mood Analyzer"
    git branch -M main
    git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
    git push -u origin main
    ```

### Step 2: Deploy on Vercel

1.  Log in to your Vercel dashboard and click **"Add New... > Project"**.
2.  **Import your Git Repository.** Find the repository you just created and click **"Import"**.
3.  **Configure Your Project.** This is the most important part. Configure the settings **exactly** as described below.

    *   **Framework Preset:** Change the preset from "Vite" (or whatever is detected) to **`Other`**.

    *   Expand the **"Build and Output Settings"** section. You must override all three settings here.

        1.  **Build Command:**
            *   Click the **toggle switch** to ON.
            *   Paste this command: `echo "window.process = { env: { API_KEY: '$API_KEY' } };" > env.js`

        2.  **Output Directory:**
            *   Click the **toggle switch** to ON.
            *   **Delete all text** in the input field, leaving it completely **EMPTY**.

        3.  **Install Command:**
            *   Click the **toggle switch** to ON.
            *   **Delete all text** in the input field, leaving it completely **EMPTY**.

    *   Expand the **"Environment Variables"** section.
    *   Add one new variable:
        *   **Name:** `API_KEY`
        *   **Value:** Paste your actual Gemini API key here.

    Your final configuration should look exactly like this screenshot:
    ![Vercel Configuration Screenshot](https://storage.googleapis.com/aistudio-project-images/readme_screenshots/vercel-final-fix.png)

4.  **Deploy!** Click the **"Deploy"** button.

### Step 3: All Done!

Vercel will now follow your explicit instructions, skipping the unnecessary build steps and correctly deploying your static application. Your site will be live in a minute or two.

## Disclaimer

This application is powered by a generative AI model. The emotional analysis provided is for entertainment and informational purposes only and should not be considered a substitute for professional psychological advice.
