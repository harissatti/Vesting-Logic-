import { useEffect, useState } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import { NavBar } from "./components/navbar";
import { User } from "./components/user";
import {Main} from "./main";

function App() {

  return (
    
   
     
    <div >
      <Routes> 
        <Route exact path="/" element={<Main/>}/>
      <Route exact path="/user" element={<User/>}/>
    </Routes>
         
    </div>
   
   
  );
}

export default App;
