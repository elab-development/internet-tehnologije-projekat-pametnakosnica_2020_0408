import {useContext} from 'react'
import { UserContext } from '../context/UserContext'
import Login from '../components/Login'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const {user } = useContext(UserContext)
  const navigate = useNavigate()

  return (
    <>
    {user.token ? navigate('/dashboard') : <Login/>}
    </>
  )
}

export default LoginPage