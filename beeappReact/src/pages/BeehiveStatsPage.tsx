import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import BeehiveStats from "../components/BeehiveStats";

const BeehiveStatsPage = () => {
  const {user } = useContext(UserContext)
  const navigate = useNavigate()
  
  return (
    <>
    {user.token == null ?? user.token == "" ? navigate('/login') : <BeehiveStats/>}
    </>
  );
};
export default BeehiveStatsPage