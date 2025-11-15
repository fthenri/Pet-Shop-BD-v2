import './globals.css'; 
import Sidebar from '../components/Sidebar'; 
import { ThemeProvider } from '../contexts/ThemeContext';
import { NotificationProvider } from '../contexts/NotificationContext'; 
import NotificationToast from '../components/NotificationToast'; 

export const metadata = {
  title: 'Sistema de Gerenciamento',
  description: 'Gerenciamento de Pet Shop',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider> 
          <NotificationProvider> 
            <Sidebar /> 
            <main className="main-content">
              {children} 
            </main>
            <NotificationToast /> 
          </NotificationProvider>
        </ThemeProvider> 
      </body>
    </html>
  );
}