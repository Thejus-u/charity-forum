# DonationForum - MERN Stack Donation Platform

A modern, elegant donation forum built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that enables communities to create and support meaningful donation campaigns.

## 🌟 Features

### Core Features
- **User Authentication & Authorization** - Secure JWT-based authentication with role-based access
- **Donation Campaigns** - Create, manage, and support fundraising campaigns
- **Community Forum** - Engage in discussions, share stories, and build connections
- **Real-time Updates** - Track campaign progress and receive notifications
- **Responsive Design** - Beautiful, modern UI that works on all devices

### Donation Features
- Create and manage donation campaigns
- Set fundraising goals and deadlines
- Track progress with visual progress bars
- Accept anonymous donations
- Campaign updates and messaging
- Multiple currency support
- Category-based organization

### Forum Features
- Create and participate in discussions
- Like/dislike posts and comments
- Category-based organization
- Search and filter functionality
- User profiles and reputation system
- Moderation tools

### User Features
- User profiles with avatars and bios
- Donation history and statistics
- Forum activity tracking
- Email notifications
- Password management

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd donation-forum
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/donation-forum
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   ```

5. **Run the application**
   ```bash
   # From the root directory
   npm run dev
   
   # Or run separately:
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Project Structure

```
donation-forum/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Donation.js
│   │   └── ForumPost.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── donations.js
│   │   └── forum.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   ├── donations/
│   │   │   └── forum/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Donations
- `GET /api/donations` - Get all campaigns
- `POST /api/donations` - Create campaign
- `GET /api/donations/:id` - Get specific campaign
- `POST /api/donations/:id/donate` - Make donation
- `PUT /api/donations/:id` - Update campaign
- `DELETE /api/donations/:id` - Delete campaign
- `POST /api/donations/:id/updates` - Add campaign update

### Forum
- `GET /api/forum` - Get all posts
- `POST /api/forum` - Create post
- `GET /api/forum/:id` - Get specific post
- `PUT /api/forum/:id` - Update post
- `DELETE /api/forum/:id` - Delete post
- `POST /api/forum/:id/like` - Like post
- `POST /api/forum/:id/dislike` - Dislike post
- `POST /api/forum/:id/comments` - Add comment
- `GET /api/forum/categories` - Get categories

## 🎨 Design Features

- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Responsive Design** - Mobile-first approach with breakpoint optimization
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Dark Mode Ready** - Prepared for future dark theme implementation
- **Loading States** - Skeleton screens and progress indicators
- **Error Handling** - User-friendly error messages and fallbacks

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Helmet security headers
- Protected routes
- Role-based access control

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create Heroku app
2. Set environment variables
3. Deploy using Git:
   ```bash
   heroku git:remote -a your-app-name
   git push heroku main
   ```

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder to your preferred platform

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update connection string in environment variables
3. Configure network access and security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- All contributors and community members

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@donationforum.com
- Documentation: [docs.donationforum.com](https://docs.donationforum.com)

---

Made with ❤️ for the community 