<h1>MaxxedOut 💪🏋️‍♂️</h1>
<b>Max out your workouts</b>

<h2>Overview</h2>
<p>MaxxedOut is a comprehensive fitness application suite designed to help users track, analyze, and optimize their workout routines. The app provides a seamless experience, empowering users to achieve their fitness goals with personalized plans and powerful analytics.</p>

<hr>

<h2>✨ Features 🌟</h2>

<h3>For Users</h3>
<ul>
  <li>Detailed Statistics: Track progress with workout duration, weight lifted, and personal records</li>
  <li>Workout Plans: Create and follow personalized workout plans</li>
  <li>Exercise Database: Access a comprehensive list of exercises with muscle group information</li>
  <li>Push Notifications: Get reminders and updates on your progress</li>
  <li>Resting Timer: Built-in timer for optimal rest periods</li>
  <li>Workout Streaks: Stay motivated with streak tracking</li>
  <li>Best Lift Statistics: Monitor your personal best lifts</li>
</ul>

<h3>For Admins</h3>
<ul>
  <li>Exercise Management: Add, edit, and delete exercises</li>
  <li>Muscle Group Management: Organize and manage muscle groups</li>
  <li>User Management: Create, update, and delete user accounts</li>
  <li>Admin Dashboard: Comprehensive control over all aspects of the platform</li>
</ul>

<h3>For Developers</h3>
<ul>
  <li>Modular Architecture: Clean separation between frontend, backend, and admin interfaces</li>
  <li>RESTful API: Well-documented API for easy integration</li>
  <li>Extensible Design: Easy to add new features and functionality</li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>

<h3>Frontend</h3>
<ul>
  <li>Mobile App: React Native, Expo</li>
  <li>Website: React, Vite</li>
  <li>UI Components: React Navigation, React Native Screens, Bootstrap (web)</li>
  <li>State Management: React Context API</li>
  <li>Styling: Native styling (mobile), CSS (web)</li>
</ul>

<h3>Backend</h3>
<ul>
  <li>Server: Node.js, Express</li>
  <li>Database: SQLite</li>
  <li>Authentication: JWT (JSON Web Tokens)</li>
  <li>Email Service: Nodemailer</li>
  <li>Environment Management: Dotenv</li>
</ul>

<h3>Admin Interface</h3>
<ul>
  <li>Language: C#</li>
  <li>Framework: Windows Forms</li>
  <li>Database Interaction: REST API calls</li>
</ul>

<h3>DevOps & Tools</h3>
<ul>
  <li>Build Tool: EAS CLI (Expo)</li>
  <li>Version Control: Git</li>
  <li>Testing: Manual and automated testing (via API endpoints)</li>
</ul>

<hr>

<h2>📦 Installation</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js (v18 or higher)</li>
  <li>npm (comes with Node.js)</li>
  <li>.NET SDK (for admin interface)</li>
</ul>

<h3>Quick Start</h3>

<p><b>1. Clone the Repository</b></p>
<pre><code>git clone https://github.com/medojanos/MaxxedOut.git
cd MaxxedOut
</code></pre>

<p><b>2. Set Up Environment Variables</b></p>

<p><b>Admin Interface:</b></p>
<pre><code>API_URL=http://localhost:6600
API_KEY=your_admin_api_key_here
</code></pre>

<p><b>API Server:</b></p>
<pre><code>EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_API_KEY=your_admin_api_key_here
API_PORT=6600
</code></pre>

<p><b>Mobile App:</b></p>
<pre><code>API_URL=http://localhost:6600
WEB_URL=http://localhost:6800
</code></pre>

<p><b>Website:</b></p>
<pre><code>VITE_API_URL=http://localhost:6600
</code></pre>

<p><b>3. Install Dependencies</b></p>
<p>API Server</p>
<pre><code>cd api
npm install
</code></pre>

<p>Mobile App</p>
<pre><code>cd app
npm install
</code></pre>

<p>Website</p>
<pre><code>cd web
npm install
</code></pre>

<p><b>4. Start the Services</b></p>
<p>API Server</p>
<pre><code>cd api
npm run dev
</code></pre>

<p>Mobile App (in a separate terminal)</p>
<pre><code>cd app
npm run dev
</code></pre>

<p>Website (in a separate terminal)</p>
<pre><code>cd web
npm start
</code></pre>

<hr>

<h2>📁 Project Structure</h2>
<pre><code>
MaxxedOut/
├── admin/                  # Admin Interface (C# Windows Forms)
│   ├── ApiClient.cs        # API communication client
│   ├── Models/             # Data models
│   ├── Forms/              # UI forms
│   ├── Program.cs          # Entry point
│   └── ...
├── api/                    # Backend API (Node.js, Express)
│   ├── db/                 # Database scripts and migrations
│   │   ├── schema.sql      # Database schema
│   │   ├── seed.sql        # Initial data seed
│   │   └── migration.js    # Database initialization script
│   ├── server/             # Server code
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Middleware functions
│   │   ├── routes/         # Route definitions
│   │   └── server.js       # Server entry point
│   ├── package.json        # Node.js dependencies
│   └── ...
├── app/                    # Mobile App (React Native)
│   ├── index.js            # Entry point
│   ├── Root.js             # Root component
│   ├── package.json        # Dependencies
│   └── ...
├── web/                    # Website (React)
│   ├── src/                # Source files
│   │   ├── pages/          # Page components
│   │   └── ...
│   ├── index.html          # HTML entry point
│   ├── package.json        # Dependencies
│   └── ...
├── CHANGELOG.md            # Change log
├── README.md               # Project documentation
└── ...
</code></pre>

<hr>

<h2>🔧 Configuration</h2>

<h3>Environment Variables</h3>
<p>Each component of MaxxedOut uses environment variables for configuration. Here's a summary of the available variables:</p>
<table border="1">
<tr>
<th>Directory</th>
<th>Variable</th>
<th>Description</th>
</tr>
<tr><td>admin</td><td>API_URL</td><td>URL of the API server</td></tr>
<tr><td>admin</td><td>API_KEY</td><td>Admin API key for authentication</td></tr>
<tr><td>api</td><td>EMAIL_USER</td><td>Email address for sending notifications</td></tr>
<tr><td>api</td><td>EMAIL_PASS</td><td>App password for email service</td></tr>
<tr><td>api</td><td>ADMIN_API_KEY</td><td>Admin API key for authentication</td></tr>
<tr><td>api</td><td>API_PORT</td><td>Port for the API server</td></tr>
<tr><td>app</td><td>API_URL</td><td>URL of the API server</td></tr>
<tr><td>app</td><td>WEB_URL</td><td>URL of the website</td></tr>
<tr><td>web</td><td>VITE_API_URL</td><td>URL of the API server</td></tr>
</table>

<h3>Database Schema</h3>
<p>The database schema is defined in <code>api/db/schema.sql</code>. It includes tables for:</p>
<ul>
  <li>users: User accounts</li>
  <li>workouts: User workouts</li>
  <li>exercises: Exercise database</li>
  <li>sets: Sets of exercises within workouts</li>
  <li>muscle_groups: Muscle groups</li>
  <li>muscle_groups_exercises: Relationship between muscle groups and exercises</li>
  <li>plans: User workout plans</li>
  <li>plans_exercises: Exercises within plans</li>
  <li>codes: Password recovery codes</li>
  <li>tokens: Authentication tokens</li>
</ul>

<h3>Admin Interface Usage</h3>
<p>The admin interface allows you to manage exercises, muscle groups, and users. Here's a quick overview of its features:</p>
<ul>
  <li>Exercises Management: Add, edit, and delete exercises, and assign muscle groups and roles to each exercise.</li>
  <li>Muscle Groups Management: Create and manage muscle groups.</li>
  <li>Users Management: Create, update, and delete user accounts.</li>
</ul>

<p><b>Example: Adding a New Exercise</b></p>
<ol>
  <li>Navigate to the Exercises tab in the admin interface.</li>
  <li>Click the "Add" button.</li>
  <li>Fill in the exercise details (name, type, muscle groups worked, and role).</li>
  <li>Click "Save" to add the exercise to the database.</li>
</ol>

<hr>

<h2>📝 License</h2>
<p>MaxxedOut is open-source software licensed under the <b>MIT License</b>. You are free to use, modify, and distribute the code as per the terms of the license.</p>

<hr>

<h2>🚀 Get Started Today!</h2>
<p>Ready to take control of your fitness journey? Join the MaxxedOut community and start maximizing your workouts today!</p>

<h3>Star the Repository</h3>
<p>Show your support by starring the MaxxedOut repository on GitHub.</p>

<h3>Contribute</h3>
<p>Want to help improve MaxxedOut? Contribute code, suggest features, or report bugs.</p>

<hr>

<h3>Badges</h3>
<p>
<a href="https://github.com/medojanos/MaxxedOut/stargazers"><img src="https://img.shields.io/github/stars/medojanos/MaxxedOut?style=social"></a>
<a href="https://github.com/medojanos/MaxxedOut/fork"><img src="https://img.shields.io/github/forks/medojanos/MaxxedOut?style=social"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
<a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-v18+-green.svg"></a>
<a href="https://docs.expo.dev/"><img src="https://img.shields.io/badge/Expo-v54.0.33-blue.svg"></a>
</p>
