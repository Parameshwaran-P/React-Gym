// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from '../src/app/routes';

function App() {
  return <RouterProvider router={router} />;
}

export default App;