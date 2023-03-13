import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ThemeProvider } from '../components/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.css';

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
