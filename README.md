
# NewsApp Microservices Implementation

This project is a microservices-based implementation of our NewsApp system, an Ionic mobile app where users can manage their profiles, view personalized newsfeeds, and update their interests. This implementation consists of the following back-end services:

- **User Service**: Manages user data like registration, login, and profile updates.
- **Interest Service**: Handles user interests and categories.
- **Newsfeed Service**: Provides personalized newsfeeds based on user interests.
- **API Gateway**: Acts as a central entry point, forwarding requests to the appropriate services.

---

## How to Run the Application

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Ionic CLI](https://ionicframework.com/docs/cli)

### Step 1: Clone the Repository
```bash
git clone https://github.com/goobyn/CS440_NewsApp
cd newsapp
git checkout microservice
```

### Step 2: Build and Run Backend Services Using Docker Compose
Navigate to the root of the project and run the following commands:

```bash
docker-compose build
docker-compose up
```

This will:
1. Build Docker images for all services.
2. Start the containers for the User Service, Interest Service, Newsfeed Service, API Gateway, and MongoDB.

### Step 3: Run the Ionic Frontend
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Ionic development server:
```bash
ionic serve
```

This will start the frontend at `http://localhost:8100`.

### Step 4: Access the Application
Once the services are running:
- Backend API Gateway: `http://localhost:4000`
- Frontend: `http://localhost:8100`

### Step 5: Stop the Services
To stop the running backend containers, use:
```bash
docker-compose down
```

To stop the Ionic frontend server, press `Ctrl + C` in the terminal where it is running.

---

## Notes
- The `frontend` directory contains the Ionic application, and its dependencies are managed separately from the backend.

For any issues, feel free to email njg234@nau.edu or goobyn@gmail.com.
