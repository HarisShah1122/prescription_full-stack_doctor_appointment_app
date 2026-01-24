# 🏥 Prescription Full-Stack Doctor Appointment App

**Prescription** is a modern, AI-powered full-stack medical appointment booking platform that makes healthcare more accessible through intelligent automation and seamless user experience. The application features three distinct user roles (Patient, Doctor, and Admin) and includes an advanced AI medical assistant to guide users 24/7.

## ✨ Key Features

### 🤖 AI Medical Assistant (NEW!)
- **Smart Chatbot**: Intelligent medical assistant available 24/7 on every page
- **Symptom Guidance**: Provides general health information and recommendations
- **Appointment Booking**: AI-assisted appointment scheduling and doctor recommendations
- **Emergency Support**: Guides users to appropriate emergency services
- **Clinic Information**: Hours, contact details, and service information
- **Context-Aware Responses**: Intelligent responses based on user queries

### 👥 Multi-Role Authentication

#### Patient Portal
- **Easy Registration**: Quick and secure user signup with email verification
- **Doctor Search**: Find doctors by specialty, availability, and location
- **Online Booking**: Schedule appointments with preferred doctors
- **Appointment Management**: View, cancel, and track appointment history
- **Profile Management**: Update personal information and medical history
- **Secure Payments**: Multiple payment options (Stripe, EasyPaisa, JazzCash)

#### Doctor Dashboard
- **Personal Dashboard**: Manage appointments and patient information
- **Schedule Management**: Set availability and working hours
- **Earnings Tracking**: Monitor revenue from completed appointments
- **Profile Customization**: Update professional information and specialties
- **Patient Communication**: View appointment details and patient history

#### Admin Panel
- **Doctor Management**: Add, edit, and manage doctor profiles
- **Appointment Oversight**: View all appointments and schedules
- **User Management**: Monitor and manage user accounts
- **Analytics Dashboard**: Track platform usage and statistics
- **System Control**: Manage platform settings and configurations

### 💳 Payment Integration
- **Multiple Payment Options**: Stripe, EasyPaisa, JazzCash
- **Secure Transactions**: Encrypted payment processing
- **Currency Support**: PKR and international currencies
- **Payment Tracking**: Complete payment history and receipts

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI with hooks and context API
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first styling framework
- **React Toastify**: User-friendly notifications
- **Axios**: HTTP client for API communication
- **Vite**: Fast development server and build tool

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: Object data modeling for MongoDB
- **JWT**: Secure authentication tokens
- **Cloudinary**: Cloud-based image storage
- **Stripe**: Payment processing platform
- **bcrypt**: Password hashing and security

### Development Tools
- **Nodemon**: Auto-restart development server
- **ESLint**: Code quality and linting
- **Git**: Version control system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB 6.0+ running locally or cloud instance
- Git for version control

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HarisShah1122/prescription_full-stack_doctor_appointment_app.git
   cd prescription_full-stack_doctor_appointment_app
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables Setup**:
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=4000
   NODE_ENV=development
   
   # MongoDB Local
   MONGO_URI=mongodb://127.0.0.1:27017/prescription_full-stack_doctor
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # JWT & Stripe
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   CURRENCY=PKR
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```

5. **Start the Application**:
   
   Start Backend Server:
   ```bash
   cd backend
   npm start
   ```
   
   Start Frontend Server:
   ```bash
   cd frontend
   npm run dev
   ```

## 📱 Responsive Design
- **Mobile-First**: Optimized for all devices and screen sizes
- **Cross-Browser**: Compatible with modern browsers
- **Accessible**: WCAG compliant UI components
- **Progressive Web App**: PWA capabilities for mobile experience

## 🔒 Security Features
- **JWT Authentication**: Secure user sessions and API access
- **Password Hashing**: bcrypt encryption for user passwords
- **Input Validation**: Server-side data validation and sanitization
- **CORS Protection**: Cross-origin request security
- **Environment Variables**: Secure configuration management
- **Rate Limiting**: API request throttling for protection

## 🌟 Project Highlights
- **AI-Powered**: Intelligent medical assistant for user guidance
- **Real-Time Updates**: Live appointment availability and booking
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Scalable Architecture**: Modular code structure for easy maintenance
- **Production Ready**: Optimized for deployment and scaling
- **Multi-Platform**: Works seamlessly on desktop, tablet, and mobile

## 📊 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/get-profile` - Get user profile
- `POST /api/user/update-profile` - Update user profile

### Doctors & Appointments
- `GET /api/doctor/list` - Get all doctors
- `GET /api/doctor/:speciality` - Get doctors by specialty
- `POST /api/user/book-appointment` - Book appointment
- `GET /api/user/appointments` - Get user appointments
- `POST /api/user/cancel-appointment` - Cancel appointment

### AI Assistant
- `POST /api/user/ai-chat` - AI chatbot interaction
- `GET /api/user/available-doctors` - Get available doctors

### Payments
- `POST /api/user/payment-stripe` - Process Stripe payment
- `POST /api/user/verify-stripe` - Verify Stripe payment
- `POST /api/user/payment-easypaisa` - Process EasyPaisa payment
- `POST /api/user/payment-jazzcash` - Process JazzCash payment

## 📦 Project Structure

```plaintext
prescription_full-stack_doctor_appointment_app/
├── backend/                 # Backend Application
│   ├── config/             # Database and service configurations
│   ├── controllers/        # API controllers and business logic
│   ├── middleware/         # Authentication and validation middleware
│   ├── models/            # MongoDB data models and schemas
│   ├── routes/            # API route definitions
│   ├── .env               # Backend environment variables
│   └── server.js          # Main server entry point
├── frontend/               # Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page-level components
│   │   ├── assets/        # Static assets and images
│   │   └── App.jsx        # Main application component
│   ├── public/            # Public static files
│   └── .env               # Frontend environment variables
└── README.md              # Project documentation
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgements

- Thanks to the open-source community for the amazing tools and libraries
- Special thanks to MongoDB, Express.js, React.js, Node.js, Stripe, and Cloudinary
- Built with ❤️ for better healthcare accessibility

---

**Note**: This application is for demonstration purposes. For production use, ensure all security measures are properly implemented and compliance requirements are met.

