import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import WidgetPage from './pages/WidgetPage';
import Track from './pages/Track';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/track',
    element: <Track />,
  },
  {
    path: '/widget',
    element: <WidgetPage />,
  },
]);
