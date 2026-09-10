# Deploying BudgetBrain AI

## Secure the project first

The project previously contained live credentials in source code. Rotate every exposed API key and email-app password before publishing this repository. Do not commit `.env`, `frontend/.env`, `mobile/BudgetBrainSMS/local.properties`, or signing keys.

## Deploy the API and database on Render

1. Push this folder to a private GitHub repository.
2. In Render, choose **New > Blueprint** and select the repository. Render reads `render.yaml` and creates `budgetbrain-api` and `budgetbrain-db`.
3. Set `GROQ_API_KEY` and, if password reset email is required, `SMTP_EMAIL` and `SMTP_PASSWORD`.
4. After the frontend is deployed, set both `FRONTEND_URL` and `CORS_ORIGINS` to its HTTPS URL. Use a comma-separated list in `CORS_ORIGINS` if you also have a custom domain.
5. Deploy, then open `https://<your-api>.onrender.com/docs` to confirm the API is running.

## Deploy the installable web app on Vercel

1. Import the same GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Set `VITE_API_URL` to `https://<your-api>.onrender.com`.
4. Deploy. Copy the Vercel HTTPS URL into Render's `FRONTEND_URL` and `CORS_ORIGINS`, then redeploy the API.
5. On Android Chrome or desktop Chrome/Edge, open the site and use **Install app**. The PWA manifest and service worker make it launch like a standalone app.

## Build the Android SMS companion

1. Install Android Studio and open `mobile/BudgetBrainSMS`.
2. Add `API_BASE_URL=https://<your-api>.onrender.com` to `gradle.properties`.
3. Sync Gradle, test on a real Android device, then choose **Build > Generate Signed Bundle / APK > Android App Bundle**.
4. Start with Google Play Internal Testing.

Google Play restricts `READ_SMS` and `RECEIVE_SMS`. A public Play Store release normally needs the app to be the device's default SMS handler or a permitted exception. Keep the SMS companion to internal/sideloaded testing until its policy and privacy requirements are addressed. The PWA is the safer public app route.
