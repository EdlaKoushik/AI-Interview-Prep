# AI Interview Prep

AI Interview Prep is a full-stack web application that helps users practice and prepare for job interviews using AI-generated questions and instant feedback. The platform supports text, audio, and (optionally) video interview modes, and provides analytics, scheduling, and premium features.

## Features

- 🧑‍💻 **AI-Powered Mock Interviews:** Get realistic interview questions tailored to your job role, industry, and experience.
- 📄 **Resume & Job Description Analysis:** Upload your resume and job description for personalized question generation.
- 📝 **Multiple Interview Modes:** Practice via text, audio, or video.
- ⚡ **Instant Feedback:** Receive actionable feedback and ideal answers for each question.
- 📊 **Progress Tracking:** Dashboard with interview history and analytics.
- 📅 **Schedule Mock Interviews:** Book future mock interviews and receive email reminders.
- 💎 **Premium Features:** Unlimited interviews, downloadable feedback reports, advanced analytics, and priority support.
- 🛡️ **Secure & Private:** All data is encrypted and never shared.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Clerk (authentication), Axios
- **Backend:** Node.js, Express, MongoDB, Stripe (payments), Clerk (auth), Together AI (question generation), OpenAI Whisper (audio transcription)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Clerk account for authentication
- Stripe account for payments
- Together AI and OpenAI API keys

### Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/ai-interview-prep.git
   cd ai-interview-prep
   ```

2. **Configure environment variables:**
   - Copy `.env.example` files in both `frontend/` and `revino_backend/` to `.env` and fill in your credentials.

3. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   cd ../revino_backend
   npm install
   ```

4. **Run the backend:**
   ```sh
   npm run dev
   ```

5. **Run the frontend:**
   ```sh
   cd ../frontend
   npm run dev
   ```

6. **Open the app:**  
   Visit [http://localhost:5173](http://localhost:5173) in your browser.

## Screenshots

<img width="1914" height="975" alt="image" src="https://github.com/user-attachments/assets/958d3db2-a550-4654-a37a-d658f93bc359" />
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/bc0c8f13-3b62-4b14-8921-fadf2cbdfd10" />

<img width="1824" height="855" alt="image" src="https://github.com/user-attachments/assets/eb0345ee-346f-490f-ba77-fea44c992a93" />
<img width="1655" height="958" alt="image" src="https://github.com/user-attachments/assets/77209f8a-1d49-48cc-9050-9e9f353cfafd" />


<!-- Add screenshots of your dashboard, interview session, feedback, etc. -->

## License

MIT

---

Made with ❤️ for job seekers.
