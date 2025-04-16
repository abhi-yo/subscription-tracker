# Subscription Tracker

A Next.js application that helps you track subscriptions and bank transactions by analyzing your email data.

## Features

- Google OAuth integration
- Gmail API for scanning transaction emails
- Bank transaction tracking from email alerts
- Dashboard for viewing detected transactions
- Monthly expense summaries

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Google Cloud Platform account with Gmail API enabled

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/subscription-tracker.git
   cd subscription-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`:
     ```
     cp .env.example .env.local
     ```
   - Edit `.env.local` and replace placeholders with your actual values:
     - Get `GOOGLE_CLIENT_SECRETS` from Google Cloud Console
     - Set a strong random string for `NEXTAUTH_SECRET`

4. Run the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Google API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Gmail API
4. Create OAuth credentials (Web application type)
5. Set authorized redirect URIs to include:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy the JSON credentials and paste into your `.env.local` file

## Security Notes

- Never commit `.env.local` or `client_secrets.json` to your repository
- They contain sensitive API keys and secrets that should be kept private
- The `.gitignore` file is configured to exclude these files from commits 