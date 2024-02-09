import {useContext} from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Dashboard from '../components/Dashboard'

const DashboardPage = () => {
  const {user } = useContext(UserContext)
  const navigate = useNavigate()

  return (
    <>
    {user.token == null ?? user.token == "" ? navigate('/login') : <Dashboard/>}
    </>
  )
}

export default DashboardPage