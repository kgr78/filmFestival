import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Films from "./components/Films";
import NotFound from "./components/NotFound";
import Film from "./components/Film";
import RegisterUser from "./components/RegisterUser";
import LoginUser from "./components/LoginUser";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import CreateFilm from "./components/CreateFilm";
import EditFilm from "./components/EditFilm";


function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/user" element={<UserProfile/>}/>
                <Route path="/creatFilm" element={<CreateFilm/>}/>
                <Route path="/films" element={<Films/>}/>
                <Route path="/films/:id" element={<Film/>}/>
                <Route path="/register" element={<RegisterUser/>}/>
                <Route path="/login" element={<LoginUser/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
