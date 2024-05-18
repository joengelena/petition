import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions";
import CreatePetition from "./components/CreatePetition"
import NotFound from "./components/NotFound";
import Register from "./components/Register";
import Login from "./components/Login"
import Profile from "./components/Profile"
import UploadImageUser from "./components/UploadImageUser";
import UploadImagePetition from "./components/UploadImagePetition";
import NavBar from "./components/NavBar";
import Petition from "./components/Petition";
import MyPetitions from "./components/MyPetitions";
import EditProfile from "./components/EditProfile";

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
                <Route path="/petitions/:petitionId/uploadImage" element={<UploadImagePetition />} />

                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/editProfile" element={<EditProfile/>}/>
                <Route path="/users/:userId/uploadImage" element={<UploadImageUser />} />
                <Route path="/myPetitions" element={<MyPetitions />} />

                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}
export default App;
