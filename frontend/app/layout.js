import './globals.css'; 
import Sidebar from '../components/Sidebar'; 
import { ThemeProvider } from '../contexts/ThemeContext';

export const metadata = {
  title: 'Sistema de Gerenciamento',
  description: 'Gerenciamento de Pet Shop',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider> 
          <Sidebar /> 
          <main className="main-content">
            {children} 
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}