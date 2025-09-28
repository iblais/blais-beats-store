# 🔥 Firebase Setup for Blais Beats Store

## 🚀 Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Name it "blais-beats-store"
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Required Services

**Firestore Database:**
1. Go to "Firestore Database" in sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location close to you

**Firebase Storage:**
1. Go to "Storage" in sidebar
2. Click "Get started"
3. Choose "Start in test mode"
4. Use the same location as Firestore

**Authentication (Optional):**
1. Go to "Authentication" in sidebar
2. Click "Get started"
3. Enable "Email/Password" provider

### 3. Get Your Config
1. Click the gear icon → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Name your app "Blais Beats Store"
5. Copy the config object

### 4. Update Your Files

**Replace the config in `script.js`:**
```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-actual-app-id"
};
```

**Update the same config in `admin-upload.html`**

### 5. Test Your Setup
1. Open `index.html` in your browser
2. Check the browser console - you should see:
   ```
   🔥 Firebase initialized for Blais Beats Store
   📥 Loading beats from Firebase...
   ⚠️ No beats found in Firebase, using mock data
   ```

3. Open `admin-upload.html` to upload your first beat

## 📁 What Firebase Stores

### Firestore Collections:

**`beats` collection:**
```javascript
{
  id: "midnight-vibes",
  title: "Midnight Vibes",
  bpm: 140,
  key: "C Minor",
  genre: "Hip Hop",
  price: 39.99,
  description: "Dark, melodic hip hop beat",
  tags: ["Hip Hop", "BLAIS", "Beat"],
  wavUrl: "https://firebasestorage.../beat.wav",
  mp3Url: "https://firebasestorage.../preview.mp3",
  stemsUrl: "https://firebasestorage.../stems.zip",
  artworkUrl: "https://firebasestorage.../artwork.jpg",
  createdAt: timestamp,
  status: "active",
  downloads: 0
}
```

**`orders` collection:**
```javascript
{
  items: [beatIds],
  customer: { email, name },
  total: 79.98,
  status: "completed",
  createdAt: timestamp,
  downloadExpires: timestamp
}
```

### Firebase Storage Structure:
```
beats/
├── midnight-vibes/
│   ├── wav/beat.wav
│   ├── mp3/preview.mp3
│   ├── stems/stems.zip
│   └── artwork/cover.jpg
├── neon-dreams/
│   ├── wav/beat.wav
│   └── mp3/preview.mp3
```

## 🔐 Security Rules (Production)

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Beats are readable by everyone, writable only by admin
    match /beats/{beatId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Orders are only accessible by the customer who created them
    match /orders/{orderId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.customerId;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Beat files are readable by everyone, writable only by admin
    match /beats/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 💰 Adding Payment Processing

### Stripe Integration:
1. Install Stripe: Add to your HTML:
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   ```

2. Create checkout session:
   ```javascript
   async function createCheckoutSession(cartItems) {
     const response = await fetch('/create-checkout-session', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ items: cartItems })
     });
     const session = await response.json();

     const stripe = Stripe('pk_test_your_publishable_key');
     await stripe.redirectToCheckout({ sessionId: session.id });
   }
   ```

## 🚀 Deploy Your Store

### Firebase Hosting:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

Your store will be live at: `https://your-project.firebaseapp.com`

## 📊 Analytics & Monitoring

Firebase provides built-in analytics for:
- User behavior
- Popular beats
- Conversion rates
- Download statistics

## 🛠️ Advanced Features

### User Accounts:
- Customer can create accounts
- View purchase history
- Re-download previous purchases

### Admin Dashboard:
- Upload beats in bulk
- View sales statistics
- Manage inventory

### Search & Filtering:
- Search beats by name, BPM, key
- Filter by genre, price range
- Sort by popularity, date

## 🔧 Troubleshooting

**"Permission denied" errors:**
- Check your Firestore rules
- Make sure you're authenticated if required

**Files not uploading:**
- Check Storage rules
- Verify file size limits (Firebase has limits)

**Config not working:**
- Double-check your Firebase config
- Make sure all services are enabled

## 📞 Next Steps

1. **Test the upload system** with `admin-upload.html`
2. **Add real payment processing** with Stripe
3. **Secure your database** with proper rules
4. **Deploy to Firebase Hosting**
5. **Set up your domain** and SSL

Your beautiful beat store is now powered by Firebase! 🔥