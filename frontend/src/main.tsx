import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.tsx'
import './index.css'
import App from './App.tsx'
import HomePage from '../routes/HomePage.tsx'
import ErrorPage from '../routes/Error.tsx'
import ProtectedRoute from '../routes/ProtectedRoute.tsx'

import { createTheme, ThemeProvider } from "@mui/material/styles";

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
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<App />} />} />
            <Route path="home" element={<ProtectedRoute element={<HomePage />} />} />          
            <Route path="error" element={<ErrorPage />} />
            <Route path="*" element={<Navigate to="/error" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
