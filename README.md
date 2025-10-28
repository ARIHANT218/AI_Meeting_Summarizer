AI Meeting Summarizer

--------------------


A full-stack MERN application that uses AI to generate, edit, and share meeting summaries based on custom prompts.


----------------
LIVE : https://ai-meeting-summarizer-6800.onrender.com/dashboard

------------------
photos:

----------------------------------------------
<img width="1330" height="654" alt="image" src="https://github.com/user-attachments/assets/9b3500f9-9027-4cb8-9546-7003c1f1cf62" />
----------------------------------------------


## Features

- **AI-Powered Summarization**: Generate structured summaries using Google's Gemini AI models
- **Custom Prompts**: Input specific instructions for how you want your summary formatted
- **File Upload**: Support for text file uploads (.txt, .md)
- **Editable Summaries**: Edit generated summaries before sharing
- **Email Sharing**: Share summaries directly via email
- **User Authentication**: Secure user registration and login
- **Dashboard**: Manage and search through all your summaries
- **Responsive Design**: Modern UI that works on all devices

--------------------



## Tech Stac
### Backend
- **Node.js** with Express.js
- 
- **MongoDB** with Mongoose ODM
- 
- **JWT** for authentication
- 
- **Google Gemini API** for AI summarization
- 
- **Nodemailer** for email functionality

### Frontend
- **React.js** with React Router
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key
- Email service credentials (Gmail recommended for testing)

----------
## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-meeting-summarizer
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `env.example` to `.env`
   - Fill in your configuration:
     ```env
     MONGODB_URI=mongodb://localhost:27017/ai-meeting-summarizer
     GEMINI_API_KEY=your_gemini_api_key_here
     JWT_SECRET=your_jwt_secret_here
     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASS=your_app_password_here
     PORT=5000
     NODE_ENV=development
     ```

5. **Start the application**
   ```bash
   # Development mode (runs both backend and frontend)
   npm run dev
   
   # Or run separately:
   npm run server    # Backend only
   npm run client    # Frontend only
   ```

## Usage

### 1. User Registration/Login
- Create an account or sign in with existing credentials
- JWT tokens are automatically managed

### 2. Creating Summaries
- Navigate to "Create New Summary"
- Enter a title for your summary
- Paste meeting transcript or upload a text file
- Provide custom instructions (e.g., "Summarize in bullet points for executives")
- Click "Generate Summary" to create AI-powered summary

### 3. Editing Summaries
- View generated summaries in the dashboard
- Click on any summary to edit the content
- Save changes when satisfied

### 4. Sharing Summaries
- Use the "Share" button on any summary
- Enter recipient email addresses
- Add optional subject and message
- Send via email

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Summaries
- `POST /api/summary/generate` - Generate new summary
- `GET /api/summary` - Get all user summaries
- `GET /api/summary/:id` - Get specific summary
- `PUT /api/summary/:id` - Update summary
- `DELETE /api/summary/:id` - Delete summary

### Email
- `POST /api/email/share` - Share summary via email
- `POST /api/email/test` - Test email configuration

## File Structure

```
├── server.js                 # Main server file
├── models/                   # MongoDB models
│   ├── User.js
│   └── Summary.js
├── routes/                   # API routes
│   ├── auth.js
│   ├── summary.js
│   └── email.js
├── middleware/               # Custom middleware
│   └── auth.js
├── client/                   # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── Dashboard.js
│   │   │   ├── CreateSummary.js
│   │   │   └── SummaryDetail.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## Configuration

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key to your `.env` file
3. Add it to your `.env` file

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in your `.env` file

### MongoDB
- Use MongoDB Atlas for cloud hosting
- Or install MongoDB locally
- Update connection string in `.env`

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Multiple AI model support
- [ ] Advanced analytics and insights
- [ ] Integration with calendar apps
- [ ] Voice transcription support
- [ ] Team workspaces
- [ ] Export to various formats (PDF, Word, etc.) 
