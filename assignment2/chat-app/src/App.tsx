import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Petitions from "./components/Petitions";
import NotFound from "./components/NotFound";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                <Route path="/petitions" element={<Petitions/>}/>
                <Route path="" element={<Petitions/>}/>
              <Route path="/petitions/:id" element={<Petitions/>}/>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}
export default App;
