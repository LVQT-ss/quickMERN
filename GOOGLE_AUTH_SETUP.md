# Google OAuth Setup Guide

This application now uses **Google OAuth** for authentication. Follow these steps to configure it properly.

## Prerequisites

1. A Google Cloud Platform account
2. A project in Google Cloud Console

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted
6. Select **Web application** as the application type
7. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain (when deploying)
8. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production domain (when deploying)
9. Click **Create** and copy your **Client ID**

## Step 2: Configure Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Step 3: Configure Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Google OAuth (use the same Client ID from Step 1)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

## Step 4: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 5: Start the Application

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## Important Notes

- The frontend and backend **must use the same Google Client ID**
- Users will be automatically created on first login if they don't exist
- The login page now **only accepts Google authentication** - traditional username/password login has been removed
- Users are identified by their Google email address
- The application uses the `@react-oauth/google` library on the frontend
- The backend uses `google-auth-library` to verify Google ID tokens

## Troubleshooting

### "process is not defined" error
- Make sure you're using `import.meta.env.VITE_GOOGLE_CLIENT_ID` in the frontend, not `process.env`
- Ensure your `.env` file uses the `VITE_` prefix for environment variables

### Google Login button not showing
- Check that `VITE_GOOGLE_CLIENT_ID` is set in your frontend `.env` file
- Verify the Client ID is correct and from a valid Google Cloud project
- Make sure the application is wrapped with `GoogleOAuthProvider` in `main.jsx`

### "Invalid credentials" or "Token verification failed"
- Ensure both frontend and backend use the same Client ID
- Check that the `GOOGLE_CLIENT_ID` is set in the backend `.env` file
- Verify your Google OAuth credentials are active in Google Cloud Console

## Security Considerations

- Never commit `.env` files to version control
- Use different Client IDs for development and production environments
- Regularly rotate your JWT_SECRET
- Consider implementing token refresh mechanisms for long sessions

