import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Additem from "./pages/Additem";
import Deleteitem from "./pages/Deleteitem";
import Contact from "./pages/Contact";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./components/Routes/Private";
import ForgotPasssword from "./pages/Auth/ForgotPasssword";
import Profile from "./pages/user/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="user/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />                 
        <Route path="/forgot-password" element={<ForgotPasssword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/additem" element={<Additem />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/deleteitem" element={<Deleteitem />} />
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;


//<Route path="/deleteitem" element={<Deleteitem />} />