import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './home';

import Login from './loginProcedures/login';

import VerifyMail from './loginProcedures/VerifyMail';

import './App.css';

import { useEffect, useState } from 'react';
import Register from './loginProcedures/register';
import ForgotPassword from './loginProcedures/forgotPassword';
import ChangePassword from './loginProcedures/changePassword';
//import Shop from './Shop';

function App() {

  const [loggedIn, setLoggedIn] = useState(false)

  const [email, setEmail] = useState("")


  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem("user"))

    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }
    //http://fastapi.localhost:8008/users/?skip=0&limit=100
    // If the token exists, verify it with the auth server to see if it is valid
    fetch("http://localhost:3080/verify", {
          method: "POST",
          headers: {
              'jwt-token': user.token
            }
      })
      .then(r => r.json())
      .then(r => {
          setLoggedIn('success' === r.message)
          setEmail(user.email || "")
      })
}, [])


  return (

    <div className="App">

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />

          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />

          <Route path="/Register" element={<Register setLoggedIn={setLoggedIn} setEmail={setEmail} />} />

          <Route path="/Verifymail" element={<VerifyMail setLoggedIn={setLoggedIn} setEmail={setEmail} />} />

          <Route path="/ForgotPassword" element={<ForgotPassword setLoggedIn={setLoggedIn} setEmail={setEmail} />} />

          <Route path="/ChangePassword" element={<ChangePassword setLoggedIn={setLoggedIn} setEmail={setEmail} />} />

        </Routes>

      </BrowserRouter>

    </div>

  );

}
/*
          <Route path="/Shop" element={<Shop setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          */

export default App;