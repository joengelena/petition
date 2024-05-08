import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions";
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Petition from "./components/Petition";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
              <NavBar />
            <Routes>
                <Route path="/" element={<Petitions/>}/>
                <Route path="/petitions" element={<Petitions/>}/>
                <Route path="/petitions/:petitionId" element={<Petition/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}
export default App;
