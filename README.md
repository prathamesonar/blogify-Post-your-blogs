# 📝 Blogify - A Modern Blogging Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</p>

### **Live Demo**: [https://blogify-post-your-blogs.onrender.com/](https://blogify-post-your-blogs.onrender.com/)

---

## 📸 Project Preview

![Blogify Application Screenshot](https://github.com/user-attachments/assets/3dc1450f-a4c8-4ffd-8d36-9cba116544fa)

---

## 📖 About The Project

**Blogify** is a full-stack web application designed to provide a seamless and modern blogging experience. It empowers writers to create, manage, and share their stories with a global audience. The platform includes a rich text editor, social features like following, liking, and commenting, and a powerful admin dashboard for site management.

---

## 🚀 Features

-   **✍️ Rich Text Editor**: Create beautiful and engaging posts with a full-featured WYSIWYG editor.
-   **👤 User Authentication**: Secure user registration and login system using JSON Web Tokens (JWT).
-   **🤝 Social Interactions**: Follow/unfollow users, like posts, and engage in discussions through a nested commenting system.
-   **🔍 User & Post Search**: Easily find other users or posts with a dynamic search bar.
-   **📱 Fully Responsive Design**: A clean and modern UI that looks great on all devices, from desktops to mobile phones.
-   **🛠️ Admin Dashboard**: A dedicated dashboard for administrators to view site statistics, manage users, and moderate content.
-   **🔒 Secure & Scalable**: Built with security best practices, including password hashing and protected API routes.

---

## 🛠️ Tech Stack

This project is a MERN stack application with modern tools for a great developer experience.

-   **Frontend**: React, Vite, React Router, Tailwind CSS, Axios
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (with Mongoose)
-   **Authentication**: JSON Web Tokens (JWT), bcryptjs

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm (Node Package Manager)
-   MongoDB (local instance or a cloud instance like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/blogify-post-your-blogs.git](https://github.com/your-username/blogify-post-your-blogs.git)
    cd blogify-post-your-blogs
    ```

2.  **Install Backend Dependencies:**
    ```sh
    cd Backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```sh
    cd ../Frontend
    npm install
    ```

4.  **Set Up Environment Variables:**
    Create a `.env` file in the `Backend` directory and add the following variables.

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    CORS_ORIGIN=http://localhost:5173

    # Optional: For default admin user creation
    ADMIN_EMAIL=admin@example.com
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=adminpassword123
    ```

5.  **Run the Application:**
    -   **Run the Backend Server:** (from the `Backend` directory)
        ```sh
        npm start
        ```
    -   **Run the Frontend Development Server:** (from the `Frontend` directory)
        ```sh
        npm run dev
        ```

    Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

---

## 🌐 API Endpoints

The backend provides a RESTful API to manage users, posts, and admin functions.

### User Routes (`/api/users`)

-   `POST /register`: Register a new user.
-   `POST /login`: Log in a user.
-   `POST /logout`: Log out a user.
-   `POST /follow/:id`: Follow or unfollow another user.
-   `GET /search`: Search for users by name or username.
-   `GET /:username`: Get a user's profile details.
-   `PUT /change-password`: Change the logged-in user's password.
-   `DELETE /delete-account`: Delete the logged-in user's account.

### Post Routes (`/api/posts`)

-   `POST /`: Create a new post.
-   `GET /feed`: Get the feed of posts for the logged-in user.
-   `GET /my-posts`: Get all posts created by the logged-in user.
-   `POST /like/:id`: Like or unlike a post.
-   `POST /comment/:id`: Add a comment to a post.
-   `PUT /:id`: Update an existing post.
-   `DELETE /:id`: Delete a post.

### Admin Routes (`/api/admin`)
-   `GET /users`: Get a list of all users.
-   `GET /posts`: Get a list of all posts.
-   `GET /stats`: Get dashboard statistics.
-   `DELETE /users/:userId`: Delete a user and their content.
-   `DELETE /posts/:postId`: Delete a post.
