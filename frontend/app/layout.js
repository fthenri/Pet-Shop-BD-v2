import './globals.css'; 
import Header from '../components/Header'; 

export const metadata = {
  title: 'Sistema de Gerenciamento',
  description: 'Gerenciamento de Pet Shop',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <Header /> 
        <main className="main-content">
          {children} 
        </main>
      </body>
    </html>
  );
}