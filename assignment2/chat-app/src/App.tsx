import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions";
import CreatePetition from "./components/CreatePetition"
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Login from "./components/Login"
import UploadImage from "./components/UploadImage";
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
                <Route path="/createPetition" element={<CreatePetition/>}/>
                <Route path="/petitions/:petitionId" element={<Petition/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/users/:userId/uploadImage" element={<UploadImage />} />
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}
export default App;
