# Je-parody

A full-stack multiplayer Jeopardy game application with real-time buzzer functionality, custom board creation, and game hosting capabilities.

## Tech Stack

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Material-UI (MUI)** for (some) UI components
- **Vite** as build tool
- WebSocket for real-time game interactions

### Backend
- **Rust** with Axum web framework
- Session-based authentication
- WebSocket support for real-time gameplay
- RESTful API architecture

## Features

- **User Authentication**: Secure login and signup system with session management
- **Board Creation & Editing**: Create custom Jeopardy boards with categories and questions
- **Game Hosting**: Set up and host games with custom boards
- **Real-time Buzzer System**: Players can buzz in during live games
- **Waiting Room**: Pre-game lobby for players to join
- **Protected Routes**: Secure access to authenticated features
- **User Profiles**: Personal user pages and game history

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable version)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LPAshurst/je-parody
   cd je-parody
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   (p)npm install
   ```

3. **Set up the backend**
   ```bash
   cd rust-server 
   cargo build
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the frontend directory. It should be based on the .env.example that is provided:

### Running the Application

1. **Start the backend server**
   ```bash
   cd rust-server
   cargo run
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173` (or whatever port Vite assigns)

## Project Structure

```
.
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context (Auth, etc.)
│   │   ├── routes/          # Page components
│   │   ├── styles/          # CSS and MUI styled components
│   │   ├── ui/              # Reusable UI components
|   |   ├── types/           # Important types for server commmunication
|   |   ├── utils/           # Utility/setup pure typescript files
|   |   └── hooks/           # React hooks for persistant data
│   └── ...
├── rust-server/
|   ├── migations/           # SQL files
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── misc/            # Helper funcions/structs
│   │   ├── extractors/      # Custom axum data extractors
│   │   ├── socket/          # Socket logic
│   │   └── models/          # Data models
│   └── ...
└── README.md
```

## Development Workflow

### Branching Strategy

**Primary workflow:** Create branches to address specific issues
```bash
# For bug fixes
git checkout -b fix/issue-123-login-error

# For new features
git checkout -b feature/issue-456-add-daily-double

# For enhancements
git checkout -b enhancement/issue-789-improve-ui
```

**Secondary workflow:** Branches for development work not tied to an issue
```bash
# For exploratory work
git checkout -b dev/experiment-websocket-optimization

# For refactoring
git checkout -b dev/refactor-auth-context

# For documentation
git checkout -b dev/update-api-docs
```

### Commit Convention

Use clear, descriptive commit messages:
```bash
git commit -m "fix: resolve session timeout on navigation"
git commit -m "feat: add support for image questions"
git commit -m "docs: update API endpoint documentation"
git commit -m "refactor: simplify auth context logic"
```

### Pull Request Process

1. Create a branch following the guidelines above
2. Make your changes and commit with clear messages
3. Push your branch to the remote repository
4. Open a Pull Request with:
   - Clear title describing the change
   - Description of what was changed and why
   - Reference to related issues (if applicable)
   - Screenshots (for UI changes)
5. Request review from team members
6. Address any feedback
7. Merge once approved

## Contributing

1. Check existing issues or create a new one
2. Fork the repository (if external contributor)
3. Create a branch following the branching strategy
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Known Issues

Check the [Issues](https://github.com/LPAshurst/je-parody/issues) tab for current bugs and feature requests.

---

**Note**: This project is under active development. Features and documentation may change.
