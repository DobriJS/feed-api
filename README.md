## Project Documentation Introduction
This project is a social media platform where users can create posts, like and comment on posts, and follow other users. 
The project is built using Node.js, Express, MongoDB, and JWT for authentication.

## Getting Started
To get started with the project, follow the steps below:
- Clone the repository to your local machine
- Install the dependencies using npm install
- Create a .env file in the root directory and add the following variables:
- MONGO_DB_CONN_STRING=<your_mongodb_connection_string>
- JWT_SECRET=<your_jwt_secret_key>
- Start the server using npm start

### API Endpoints


### Middleware

The following middleware functions are used:
- requiresAuth: Checks if the user is authenticated using JWT

### Services
- authService: Handles user authentication
- postService: Handles post-related operations
- userService: Handles user-related operations

### Models
- User: Represents a user in the system
- Post: Represents a post in the system

### Controllers
- authController: Handles authentication-related requests
- postController: Handles post-related requests
- userController: Handles user-related requests


### Conclusion

This project provides a basic social media platform with user authentication, post creation, liking, commenting, and following functionality. 
It can be used as a starting point for building more complex social media applications.
