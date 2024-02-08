// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./components/profile"
import Login from "./components/login";
import Homepage from "./components/homepage";
import Signup from "./components/signup";
import People from "./components/people";
import User from "./components/user";
import Sample from "./components/sample";

//Utils
import ProtectedRoute from "../src/utils/protectedRoute"

function App() {
  return (
    <>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/people" element={<People />} />
        </Routes>
      </BrowserRouter> */}



      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/sample" element={<Sample />} /> */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Homepage />}  />
            <Route path="/profile" element={<Profile />}  />
            <Route path="/people" element={<People />}  />
            <Route path="/user" element={<User />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
