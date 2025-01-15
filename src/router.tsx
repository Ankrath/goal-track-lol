import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import WidgetPage from './pages/WidgetPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/widget',
    element: <WidgetPage />,
  },
]);
