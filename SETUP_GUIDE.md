# Setup Guide for CausalFunnel Quiz Application

## 🚀 Prerequisites Installation

### Step 1: Install Node.js

**For Windows:**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version (recommended for most users)
3. Run the installer and follow the installation wizard
4. Make sure to check "Add to PATH" during installation

**For macOS:**
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
```

**For Linux (Ubuntu/Debian):**
```bash
# Using apt
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using snap
sudo snap install node --classic
```

### Step 2: Verify Installation

Open a new terminal/command prompt and run:
```bash
node --version
npm --version
```

You should see version numbers (e.g., v18.17.0 for Node.js and 9.6.7 for npm).

## 📦 Project Setup

### Step 3: Install Dependencies

Navigate to the project directory and install dependencies:
```bash
cd Causal_Funnel_Project
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Material-UI
- Tailwind CSS
- And other dependencies

### Step 4: Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. "npm is not recognized" Error**
- **Solution**: Reinstall Node.js and make sure to check "Add to PATH"
- **Alternative**: Use the full path to npm or restart your terminal

**2. Port 3000 Already in Use**
- **Solution**: Kill the process using port 3000 or use a different port
- **Command**: `npx kill-port 3000` or `npm run dev -- -p 3001`

**3. TypeScript Errors**
- **Solution**: Make sure TypeScript is installed globally
- **Command**: `npm install -g typescript`

**4. Material-UI Styling Issues**
- **Solution**: Clear cache and reinstall
- **Commands**: 
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

### Alternative Package Managers

If npm doesn't work, try using yarn:

**Install Yarn:**
```bash
npm install -g yarn
```

**Then use yarn commands:**
```bash
yarn install
yarn dev
```

## 🌐 Accessing the Application

Once the development server is running:

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You should see the quiz application start page

## 📱 Testing the Application

### Basic Functionality Test

1. **Start Page**: Enter a valid email address (e.g., `test@example.com`)
2. **Quiz Loading**: Wait for questions to load from the API
3. **Timer**: Verify the 30-minute countdown starts
4. **Navigation**: Click on question numbers to navigate
5. **Answering**: Select answers and see them marked as answered
6. **Results**: Complete the quiz and view detailed results

### API Connection Test

The application fetches questions from: `https://opentdb.com/api.php?amount=15`

If you see loading errors, check:
- Internet connection
- API availability
- Browser console for error messages

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Option 2: Netlify

1. Build the project: `npm run build`
2. Upload the `.next` folder to Netlify

### Option 3: Manual Build

```bash
npm run build
npm start
```

## 📋 Environment Requirements

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 1GB free space

## 🔍 Verification Checklist

After setup, verify these features work:

- [ ] Start page loads with email input
- [ ] Email validation works correctly
- [ ] Questions load from API
- [ ] Timer counts down from 30 minutes
- [ ] Question navigation grid shows status
- [ ] Can answer questions and see progress
- [ ] Results page shows score and details
- [ ] Responsive design works on mobile
- [ ] No console errors in browser

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify Node.js and npm are properly installed
3. Try clearing cache and reinstalling dependencies
4. Check the README.md for additional information

## 🎯 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

**Note**: Make sure to restart your terminal after installing Node.js to ensure the PATH is updated. 