# EV Vehicle Monitoring Dashboard

This project is a comprehensive vehicle dashboard application that displays real-time data fetched from a backend system. The application allows users to interact with the dashboard, modifying the vehicle's state, which is then reflected in the backend database.

# Live Deployment
The complete application is deployed and available at the following URLs:

- Frontend: https://ev-status-dashboard.netlify.app/
- Backend API: [https://ev-vehicle-monitoring-system.uw.r.appspot.com](https://vehicle-dashboard-179965013028.asia-east1.run.app)


# Technologies Used

# Frontend
- React.js: The user interface is built using the React.js JavaScript library.
- React Hooks: Functional components with React Hooks are used for state management and data fetching.
- Recharts: A popular charting library used to create the power and RPM gauges.
- Tailwind CSS: A utility-first CSS framework used for styling the components.


# Backend
- Python: The backend is implemented using the Flask web framework.
- Google Cloud Firestore: A NoSQL document database service used to store and manage the vehicle state data.
- Google Cloud Platform: The backend application is deployed on Google App Engine, a fully managed serverless platform.

# Deployment
- Netlify: The frontend application is hosted on Netlify, a static site hosting platform.
- Google Cloud Firestore: The database is hosted on Google Cloud Firestore, a fully managed NoSQL document database.

# API Endpoints
The application exposes the following API endpoints:

- GET /api/vehicle/state: Retrieves the current vehicle state from the database.
- POST /api/vehicle/motor-speed: Updates the motor speed setting in the database.
- POST /api/vehicle/charging: Toggles the charging state in the database.
- POST /api/vehicle/reset: Resets the vehicle state to default values in the database.

# How to Getting Started
To run the application locally, follow these steps:

1. Clone the repository from GitHub:
   ~~~
   git clone https://github.com/your-username/ev-vehicle-monitoring-dashboard.git
   ~~~

2. Change to the project directory:
   ~~~
   cd ev-vehicle-monitoring-dashboard
   ~~~
3. Install the required dependencies:
   ~~~
   pip install -r requirements.txt
   ~~~
4. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of your Google Cloud service account JSON file.

5. Start the backend server:
   ~~~
   python main.py
   ~~~
6. In a separate terminal, navigate to the frontend directory and start the development server:
   ~~~
   cd frontend
   npm run dev
   ~~~
The frontend application should now be available at http://localhost:3000, and the backend API can be accessed at http://localhost:5000/api.
   
# License
This project is licensed under the MIT License.
The main changes in this updated README are:
1. Updated the "Frontend" section to mention Vite as the build tool used for the React application.
2. Changed the command to start the frontend development server to npm run dev instead of npm start.
