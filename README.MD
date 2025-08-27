# BuddyAgents Frontend

A modern, multi-agent companion platform built with Next.js, TypeScript, and Tailwind CSS. This frontend provides an intuitive interface for interacting with AI agents for personal development, interviews, conversations, and more.

## 🚀 Features

- **Multi-Agent Support**: Interact with different AI agents for various purposes
- **Video Interviews**: Advanced interview interface with real-time communication
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Communication**: WebSocket support for live interactions

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed on your system:

### Required Software

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 1GB free space
- **Internet Connection**: Required for initial setup and package installation

## 🛠️ Installation Guide

### For Windows

1. **Install Node.js**:
   - Download Node.js from [nodejs.org](https://nodejs.org/)
   - Run the installer and follow the setup wizard
   - Verify installation:
     ```cmd
     node --version
     npm --version
     ```

2. **Install Git**:
   - Download Git from [git-scm.com](https://git-scm.com/)
   - Run the installer with default settings

3. **Clone the repository**:
   ```cmd
   git clone https://github.com/JITESH-KUMAR05/SkillSaathiFrontEnd.git
   cd SkillSaathiFrontEnd
   ```

4. **Install dependencies**:
   ```cmd
   npm install
   ```

### For macOS

1. **Install Node.js**:
   ```bash
   # Using Homebrew (recommended)
   brew install node
   
   # Or download from nodejs.org
   ```

2. **Install Git** (if not already installed):
   ```bash
   # Git usually comes pre-installed on macOS
   git --version
   
   # If not installed, use Homebrew
   brew install git
   ```

3. **Clone the repository**:
   ```bash
   git clone https://github.com/JITESH-KUMAR05/SkillSaathiFrontEnd.git
   cd SkillSaathiFrontEnd
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

### For Linux (Ubuntu/Debian)

1. **Update package index**:
   ```bash
   sudo apt update
   ```

2. **Install Node.js and npm**:
   ```bash
   # Method 1: Using NodeSource repository (recommended)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Method 2: Using snap
   sudo snap install node --classic
   
   # Method 3: Using package manager (may install older version)
   sudo apt install nodejs npm
   ```

3. **Install Git**:
   ```bash
   sudo apt install git
   ```

4. **Clone the repository**:
   ```bash
   git clone https://github.com/JITESH-KUMAR05/SkillSaathiFrontEnd.git
   cd SkillSaathiFrontEnd
   ```

5. **Install dependencies**:
   ```bash
   npm install
   ```

### For Linux (CentOS/RHEL/Fedora)

1. **Install Node.js and npm**:
   ```bash
   # For CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   
   # For Fedora
   sudo dnf install nodejs npm
   ```

2. **Install Git**:
   ```bash
   # CentOS/RHEL
   sudo yum install git
   
   # Fedora
   sudo dnf install git
   ```

3. **Clone and setup** (same as Ubuntu):
   ```bash
   git clone https://github.com/JITESH-KUMAR05/SkillSaathiFrontEnd.git
   cd SkillSaathiFrontEnd
   npm install
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Other environment variables (add as needed)
# NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000/ws
# NEXT_PUBLIC_APP_ENV=development
```

### Backend API Setup

This frontend requires a backend API running on `http://localhost:8000`. Make sure your backend server is running before starting the frontend.

## 🚀 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

### Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

### Using the Start Script

For convenience, you can use the provided start script:

```bash
# Make it executable (Linux/macOS)
chmod +x start_frontend.sh

# Run the script
./start_frontend.sh
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   
   # Or use a different port
   npm run dev -- -p 3001
   ```

2. **Node version issues**:
   ```bash
   # Check Node.js version
   node --version
   
   # Update Node.js to latest LTS version
   ```

3. **Package installation fails**:
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Permission errors (Linux/macOS)**:
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   ```

### Performance Issues

- Ensure you have at least 4GB RAM available
- Close unnecessary applications
- Use `npm run build` for better performance in production

## 🏗️ Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js 13+ app directory
│   │   ├── (app)/        # Protected app routes
│   │   ├── agents/       # Agent-specific pages
│   │   └── interview/    # Interview functionality
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── lib/             # Utility functions
│   ├── services/        # API services
│   └── types/           # TypeScript type definitions
├── package.json          # Project dependencies
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 Technology Stack

- **Framework**: Next.js 15.5.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Headless UI
- **State Management**: React Context + React Query
- **Form Handling**: React Hook Form + Zod
- **Icons**: Heroicons, Lucide React
- **Animations**: Framer Motion

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

If you encounter any issues during setup or have questions:

1. Check the troubleshooting section above
2. Review the [Issues](https://github.com/JITESH-KUMAR05/SkillSaathiFrontEnd/issues) on GitHub
3. Create a new issue if your problem isn't already documented

## 🔄 Updates

To update the project to the latest version:

```bash
git pull origin main
npm install
npm run build
```

---

**Happy Coding! 🎉**