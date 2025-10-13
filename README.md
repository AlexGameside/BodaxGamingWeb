# BodaxGaming Team Website

A modern, full-featured esports team website built with React and Firebase.

## Features

- 🏠 **Home Page** - Hero section with upcoming matches and recent results
- 👥 **Players Page** - Showcase your team roster with profiles
- 🎮 **Matches Page** - Display all matches with filtering (upcoming/past)
- 🔐 **Admin Panel** - Secure admin dashboard to manage matches and players
- 🔥 **Firebase Integration** - Real-time database with Firestore
- 📱 **Responsive Design** - Beautiful UI that works on all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. The Firebase configuration is already set up in `src/firebase.js`

3. Set up Firebase Authentication:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project: `bodaxgamingweb`
   - Navigate to Authentication → Sign-in method
   - Enable "Email/Password" authentication
   - Go to Authentication → Users
   - Click "Add user" and create an admin account with your email and password

4. Set up Firestore Database:
   - In Firebase Console, go to Firestore Database
   - Click "Create database"
   - Start in **production mode** or **test mode** (test mode for development)
   - Choose a location closest to your users

### Running the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

### Admin Login

1. Navigate to `/login`
2. Enter your Firebase admin credentials
3. You'll be redirected to the admin dashboard

### Adding Matches

1. Go to Admin → Matches tab
2. Fill in the match details:
   - Opponent team name
   - Tournament name
   - Date and time
   - Scores (leave as 0 for upcoming matches)
3. Click "Add Match"

### Adding Players

1. Go to Admin → Players tab
2. Fill in player details:
   - Full name
   - In-game name (IGN)
   - Role
   - Bio (optional)
   - Photo URL (optional)
3. Click "Add Player"

## Project Structure

```
BodaxGamingWeb/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Players.jsx
│   │   ├── Matches.jsx
│   │   ├── Admin.jsx
│   │   ├── Login.jsx
│   │   └── [corresponding CSS files]
│   ├── firebase.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── package.json
└── README.md
```

## Firestore Data Structure

### Matches Collection
```javascript
{
  opponent: "Team Name",
  tournament: "Tournament Name",
  date: Timestamp,
  ourScore: Number,
  opponentScore: Number,
  createdAt: Timestamp
}
```

### Players Collection
```javascript
{
  name: "Full Name",
  ign: "InGameName",
  role: "Position/Role",
  bio: "Player biography",
  photoURL: "https://...",
  createdAt: Timestamp
}
```

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **Firebase** - Backend services
  - Firestore - Database
  - Authentication - User management
  - Storage - File storage (configured)
- **React Router** - Navigation
- **date-fns** - Date formatting

## Security Notes

⚠️ **Important**: Your Firebase API key is public in the code. This is normal for Firebase web apps, but make sure to:

1. Set up proper Firestore security rules
2. Enable Firebase App Check for production
3. Restrict API key usage in Firebase Console

### Recommended Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all for matches and players
    match /matches/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /players/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
