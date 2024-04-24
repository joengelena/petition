import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions";
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Login from "./components/Login";

import NavBar from "./components/NavBar";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
              <NavBar />
            <Routes>
                <Route path="" element={<Petitions/>}/>
                <Route path="/petitions" element={<Petitions/>}/>
                <Route path="/petitions/:id" element={<Petitions/>}/>
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
