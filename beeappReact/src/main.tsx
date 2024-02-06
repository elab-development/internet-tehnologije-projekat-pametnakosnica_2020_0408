import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BeehiveDash from './pages/BeehiveDash';
import BeehiveStats from './components/BeehiveStats';
import Generic404 from './pages/Generic404';
import UserProvider from './context/UserContext';
import theme from './utils/themes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<LandingPage/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='beehivedash/:apiaryId' element={<BeehiveDash/>} errorElement={<Generic404/>}/>
      <Route path='beehivedash/:apiaryId/beehivestats/:beehiveId' element={<BeehiveStats/>} errorElement={<Generic404/>}/>
      <Route path='*' element={<Generic404/>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <UserProvider>
        <RouterProvider router={router}/>
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>
);