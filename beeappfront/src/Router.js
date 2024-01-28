import {BrowserRouter, Routes, Route} from "react-router-dom"
import LandingPage from "./components/LandingPage"
import NotFound from "./components/NotFound";
import Login from "./components/Login";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<LandingPage />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default Router