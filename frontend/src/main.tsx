import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.tsx'
import './index.css'
import JeopardyApp from './App.tsx'
import HomePage from '../routes/HomePage.tsx'
import ErrorPage from '../routes/Error.tsx'
import ProtectedRoute from '../routes/ProtectedRoute.tsx'
import EditBoard from "../routes/EditBoard.tsx"
import SetupPlayBoard from "../routes/SetupPlayBoard.tsx"
import PlayBoard from "../routes/PlayBoard.tsx"
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Buzzer from "../routes/Buzzer.tsx"
import WaitingRoom from "../routes/WaitingRoom.tsx"
import {SocketProvider} from "../context/SocketContext.tsx"

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Arial"',       
      '"Helvetica"',
      'sans-serif',
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        
      },
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
        disableFocusRipple: true,
      }
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
        disableFocusRipple: true,
      }
    }
  },
});

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
      <SocketProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<JeopardyApp />} />
              <Route path="home" element={<ProtectedRoute element={<HomePage />} />} />
              <Route path="edit/:slug" element={<ProtectedRoute element={<EditBoard />} />} />
              <Route path="create" element={<ProtectedRoute element={<EditBoard />} />} />  
              <Route path="setup/:slug" element={<ProtectedRoute element={<SetupPlayBoard />} />} />    
              <Route path="user/:userName" element={<ProtectedRoute element={<>yo... this is the user page</>} />} />  
              <Route path="board/:room" element={<ProtectedRoute element={<PlayBoard />} />} />  
              <Route path="player/:room" element={<ProtectedRoute element={<Buzzer />} />} />
              <Route path="waiting-room/:room" element={<ProtectedRoute element={<WaitingRoom />} />} />    
              <Route path="error" element={<ErrorPage />} />
              <Route path='game-over' element={<EndGame />} />
              <Route path="*" element={<Navigate to="/error" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SocketProvider>
    </ThemeProvider>
)
