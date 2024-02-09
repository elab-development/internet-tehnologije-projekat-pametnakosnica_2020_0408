import {useContext} from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import Admin from '../components/Admin'

const AdminDash = () => {
  const {user } = useContext(UserContext)
  const navigate = useNavigate()

  return (
    <>
    {user.token == null ?? user.token == "" ? navigate('/login') : <Admin/>}
    </>
  )
}

export default AdminDash