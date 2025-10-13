# 🎮 BodaxGaming Website - Setup Guide

## ✅ What's Already Done

Your website is ready to use! The Firebase configuration is already connected to your project.

## 🔥 Firebase Setup (Required)

You need to complete these steps in the Firebase Console to make your website fully functional:

### Step 1: Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **bodaxgamingweb**
3. Click on **Authentication** in the left menu
4. Click **Get Started** (if not already enabled)
5. Go to **Sign-in method** tab
6. Click on **Email/Password**
7. Enable it and click **Save**

### Step 2: Create Admin User

1. In Authentication, go to the **Users** tab
2. Click **Add user**
3. Enter your email and a strong password
4. Click **Add user**

**Remember these credentials! You'll use them to log into the admin panel.**

### Step 3: Set up Firestore Database

1. Click on **Firestore Database** in the left menu
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - For production, you'll want to set up proper security rules later
4. Choose a location close to your users (e.g., us-central, europe-west)
5. Click **Enable**

### Step 4: Configure Security Rules (Important!)

Once your database is created:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read matches and players
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

3. Click **Publish**

This allows:
- ✅ Everyone can view matches and players
- ✅ Only authenticated users (admin) can create/edit/delete

## 🚀 Running Your Website

### Development Mode

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser

### Production Build

```bash
npm run build
npm run preview
```

## 📱 How to Use Your Website

### Public Pages (No Login Required)

1. **Home** - Shows next match and recent results
2. **Players** - Displays all team members
3. **Matches** - Shows all matches with filters for upcoming/past

### Admin Panel (Login Required)

1. Go to `/login` or click **Login** in the navigation
2. Enter the email and password you created in Firebase
3. You'll be redirected to the **Admin Dashboard**

### Adding Matches

1. Login to admin panel
2. Click on **Matches** tab
3. Fill in the form:
   - **Opponent Team**: Name of the opposing team
   - **Tournament**: Tournament or league name
   - **Date**: Match date
   - **Time**: Match time
   - **Our Score**: Your team's score (use 0 for upcoming matches)
   - **Opponent Score**: Opponent's score (use 0 for upcoming matches)
4. Click **Add Match**

### Adding Players

1. Login to admin panel
2. Click on **Players** tab
3. Fill in the form:
   - **Full Name**: Player's real name
   - **IGN**: In-game name
   - **Role**: Position/role (e.g., "Captain", "Support", "DPS")
   - **Bio**: Short description (optional)
   - **Photo URL**: Link to player photo (optional)
     - You can use image hosting services like Imgur
     - Or upload to Firebase Storage and use that URL
4. Click **Add Player**

## 🎨 Customization Tips

### Change Colors

Edit the colors in CSS files (located in `src/pages/` and `src/components/`):
- Primary blue: `#64b5f6`
- Purple accent: `#9575cd`
- Background: `#0a0e27`

### Add Team Logo

Update the Navbar component to include your logo image.

### Upload Player Photos

For player photos, you can:
1. Use free image hosting (Imgur, Cloudinary)
2. Or set up Firebase Storage:
   - Go to Storage in Firebase Console
   - Click Get Started
   - Upload images
   - Get the download URL
   - Use that URL in the Photo URL field

## 🔒 Security Best Practices

### For Production:

1. **Update Firestore Rules** to be more restrictive
2. **Enable Firebase App Check** to prevent abuse
3. **Set up Firebase Storage rules** if using it
4. **Use environment variables** for sensitive data (optional enhancement)

## 🆘 Troubleshooting

### "Permission denied" when adding matches/players
- Make sure you're logged in
- Check Firestore rules are set correctly

### Can't log in
- Verify you created a user in Firebase Authentication
- Check email and password are correct
- Open browser console (F12) to see error messages

### Website not loading
- Check if `npm run dev` is running
- Look for error messages in the terminal
- Clear browser cache and reload

### No data showing
- Make sure Firestore database is created
- Check that you've added some matches/players through admin panel

## 📞 Need Help?

If you encounter issues:
1. Check the browser console (F12) for errors
2. Check the terminal for error messages
3. Verify all Firebase services are enabled
4. Make sure you're using the correct Firebase project

## 🎉 You're All Set!

Once you complete the Firebase setup steps above, your website will be fully functional! 

Add some players and matches through the admin panel to see your website come to life!

---

**Tech Stack:**
- React + Vite
- Firebase (Auth + Firestore)
- React Router
- Modern CSS with gradients and animations

