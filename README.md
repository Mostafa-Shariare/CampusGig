# 🎓 CampusGig - University Freelancing Platform

Welcome to **CampusGig**! Check out the details below to understand what this project is, how to run it, and how to study its code.

---

## 1. 🚀 Project Overview

**CampusGig** is a specialized freelancing marketplace designed exclusively for university students. It bridges the gap between students who have skills (developers, designers, writers) and those who need services. Unlike generic platforms like Fiverr or Upwork, CampusGig focuses on the unique needs of the campus community.

### 🌟 Key Features
*   **Gig Marketplace**: Students can post services (Gigs) they offer (e.g., "I will debug your C++ assignment").
*   **Community Feed**: A social-media style feed for asking questions, posting updates, and networking.
*   **Booking System**: Users can book gigs and track order status (Pending -> Completed).
*   **Review System**: Verified purchase reviews with star ratings and comments.
*   **Real-time Chat**: Message sellers directly to discuss requirements.
*   **User Profiles**: Showcase your skills, bio, and portfolio of gigs.
*   **Authentication**: Secure signup/login with JWT (JSON Web Tokens).

### 🎯 Who is it for?
*   **Students**: To earn pocket money and build a portfolio while studying.
*   **Club Leaders/Event Organizers**: To find designers or photographers for campus events.
*   **University Stuff**: To find research assistants or help with small tasks.

---

## 2. 🛠️ Tech Stack

This project is built using the **MERN Stack** (MongoDB, Express.js, React, Node.js).

### Frontend (Client)
*   **React.js (Vite)**: Fast contemporary UI library.
*   **React Router 6**: For handling navigation and pages.
*   **Axios**: For making HTTP requests to the backend.
*   **CSS3**: Custom modern styling with CSS Variables (No external UI libraries like Bootstrap/Tailwind used for core layout to demonstrate pure CSS skills).
*   **React Icons**: For lightweight vector icons.

### Backend (Server)
*   **Node.js & Express.js**: RESTful API server.
*   **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM).
*   **JWT (JSON Web Token)**: For secure stateless authentication.
*   **Bcrypt.js**: For hashing passwords securely.
*   **Multer**: For handling file uploads (images).
*   **Nodemon**: For automatic server restarts during development.

---

## 3. 📂 Folder Structure

The project is divided into two main folders: `frontend` and `backend`.

```bash
CampusGig/
├── backend/                # Server-side logic
│   ├── conn/               # Database connection logic
│   ├── middleware/         # Custom middlewares (e.g., verifyToken)
│   ├── model/              # Mongoose Data Models (User, Gig, Post, etc.)
│   ├── routes/             # API Endpoint definitions
│   ├── uploads/            # Directory for storing uploaded images
│   ├── index.js            # Entry point of the server
│   └── package.json        # Backend dependencies
│
├── frontend/               # Client-side logic
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Cards, etc.)
│   │   ├── context/        # React Context (AuthContext) for state management
│   │   ├── pages/          # Full page views (Home, Feed, Gigs, Login)
│   │   ├── App.jsx         # Main App component with Routes
│   │   ├── main.jsx        # Entry point DOM rendering
│   │   └── index.css       # Global Design System & Variables  
│   └── vite.config.js      # Vite configuration
│
└── README.md               # You are reading this!
```

---

## 4. 💻 Installation & Setup (Step-by-Step)

Follow these steps to get the project running on your local machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Installed locally or use MongoDB Atlas)
*   [Git](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/CampusGig.git
cd CampusGig
```

### Step 2: Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm run dev
    ```
    *You should see: `Server is running on port 3000` and `Connected to MongoDB`.*

### Step 3: Frontend Setup
1.  Open a **new terminal** (keep backend running).
2.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the react app:
    ```bash
    npm run dev
    ```
5.  Open the link shown (usually `http://localhost:5173`) in your browser.

### 🛑 Common Setup Issues
*   **MongoDB Connection Error**: Ensure MongoDB is running locally (`mongod` command) or check your connection string in `conn.js` or `.env`.
*   **CORS Error**: If frontend can't talk to backend, ensure `cors` is enabled in `backend/index.js`.
*   **Image Uploads**: Ensure the `backend/uploads` folder exists. If not, create it manually.

---

## 5. 🔑 Environment Variables

Ideally, you should create a `.env` file in the `backend/` directory to keep secrets safe.

**backend/.env** (Example)
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/campusgig
JWT_SECRET=your_super_secret_random_string_here
```

*Note: In this educational version, some configuration might be hardcoded in `backend/conn/conn.js` or `index.js` for simplicity. Always migrate specific strings to `.env` for production.*

---

## 6. 🗄️ Database Setup

*   The project typically uses a local MongoDB instance.
*   **Database Name**: `campusgig` (or similar, check backend/conn/conn.js).
*   **Seeding Data**: There is a `seed.js` file in the backend folder. You can run it to populate dummy data:
    ```bash
    cd backend
    node seed.js
    ```

---

## 7. 📡 API Overview

The backend exposes RESTful endpoints at `http://localhost:3000/api/`.

| Feature | Method | Route | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/register` | Register new user |
| | POST | `/api/auth/login` | Login user & return JWT |
| **Gigs** | GET | `/api/gigs` | Fetch all gigs (supports filtering) |
| | POST | `/api/gigs` | Create a new gig (Protected) |
| | GET | `/api/gigs/:id` | Get single gig details |
| **Feed** | GET | `/api/posts` | Get community posts |
| **Orders** | POST | `/api/orders/:gigId` | Book a gig |
| **Reviews**| POST | `/api/reviews` | Leave a review for completed order |

*Note: Routes marked "Protected" require a valid JWT token in the `Authorization` header.*

---

## 8. 📚 How to Study This Project (Learning Guide)

If you are a student trying to understand how this platform works, follow this reading order:

### 1. High-Level Architecture
Understand that the **Frontend** calls the **Backend** API. The Backend talks to the **Database**. Data flows in JSON format.

### 2. Backend Entry Point (`backend/index.js`)
Start here. See how `express` is initialized, how `cors` and `json` middleware are used, and how the routes (`app.use('/api/...')`) are wired up.

### 3. Database Connection (`backend/conn/conn.js`)
See how Mongoose connects to your local MongoDB.

### 4. Models (`backend/model/`)
Open `User.js` and `Gig.js`. Understand the Schema—this defines the "shape" of your data.

### 5. Authentication Flow
*   Look at `backend/routes/auth.js`: How registration hashes the password (bcrypt).
*   Look at `backend/middleware/auth.js`: How we verify the token for protected routes.

### 6. Functionality Routes
Pick one feature, e.g., **Gigs**.
*   Trace the route from `index.js` -> `routes/gigs.js`.
*   See how it uses the `Gig` model to `.find()` or `.save()` data.

### 7. Frontend Structure
*   **`frontend/src/main.jsx`**: Results in the root render.
*   **`frontend/src/App.jsx`**: Defines the Routing (which URL shows which Page).
*   **`frontend/src/context/AuthContext.jsx`**: Very important! This manages the global "Logged In" state.

### 8. Connecting Front & Back
Open `frontend/src/pages/Gigs.jsx`. Look for `axios.get(...)`. This is where the frontend fetches data from your backend API.

---

## 9. 🎨 Common Customizations

Want to make this project your own?

1.  **Change Branding**:
    *   Go to `frontend/src/index.css`.
    *   Change the `--primary-color` and `--secondary-color` variables to your university colors!
2.  **Rename Project**:
    *   Search and replace "CampusGig" in `index.html`, `Navbar.jsx`, and `README.md`.
3.  **Add Payment Gateway**:
    *   Currently, orders are "mocked". You can integrate **Stripe** or **Razorpay** in the `backend/routes/orders.js` file before saving the order.

---

## 10. 🚀 Deployment (Optional)

To take this live:
1.  **Frontend**: Deploy the `frontend` folder to **Vercel** or **Netlify**. You will need to update the API calls to point to your live backend URL instead of localhost.
2.  **Backend**: Deploy the `backend` folder to **Render**, **Railway**, or **Heroku**.
3.  **Database**: Use **MongoDB Atlas** (Free Tier) to host your database in the cloud.

---

## 11. 🤝 Contribution Guidelines

We welcome contributions!
1.  Fork the repo.
2.  Create a new branch (`git checkout -b feature-amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

## 12. 📄 License & Credits

**License**: MIT License - Free to use and modify for educational purposes.

**Created by**: [Mostafa Shariare]
**Credit**: Built as part of the University Hackathon Project.

---


