import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import RootLayout from './pages/RootLayout'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BeehiveDash from './pages/BeehiveDash'
import BeehiveStats from './components/BeehiveStats'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout/>}>
      <Route index element={<LandingPage/>}/>
      <Route path='login' element={<Login/>}/>
      <Route path='register' element={<Register/>}/>
      <Route path='dashboard' element={<Dashboard/>}/>
      <Route path='beehivedash/:apiaryId' element={<BeehiveDash/>}/>
      <Route path='beehivedash/:apiaryId/beehivestats/:beehiveId' element={<BeehiveStats/>}/>
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
