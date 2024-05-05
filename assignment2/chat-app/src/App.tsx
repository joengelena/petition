import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions";
import NotFound from "./components/NotFound";
import Register from "./components/Register";
//import Users from "./components/Users";
import User from "./components/User";
import Login from "./components/Login";
import NavBar from "./components/NavBar";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
              <NavBar />
            <Routes>
                <Route path="/petitions" element={<Petitions/>}/>
                <Route path="/register" element={<Register/>}/>
                {/*<Route path="/users" element={<Users/>}/>*/}
                <Route path="/user" element={<User/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}
export default App;
