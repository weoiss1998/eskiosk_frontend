import React, { useState } from "react";

import { useNavigate } from "react-router-dom";


const Login = (props) => {

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [emailError, setEmailError] = useState("")

    const [passwordError, setPasswordError] = useState("")

    const navigate = useNavigate();

    const onForgetButtonClick = async () => {
        navigate("/forgotPassword")
    }

    const onButtonClick = async () => {

        // Set initial error values to empty
        //var emailfilter=/^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i;
        setEmailError("")

        setPasswordError("")


        // Check if the user has entered both fields correctly

        if ("" === email) {

            setEmailError("Please enter your email")

            return

        }


        /*if (emailfilter.test(email)) {

            setEmailError("Please enter a valid email")

            return

        }*/


        if ("" === password) {

            setPasswordError("Please enter a password")

            return

        }


        if (password.length < 2) {

            setPasswordError("The password must be 8 characters or longer")

            return

        }


        // Check if email has an account associated with it
        checkAccountExists() 


    }

    /*async function Users() {
        const response = await fetch("http://fastapi.localhost:8008/users/?skip=0&limit=100")
        const todos = await response.json()
        console.log(JSON.stringify(todos))
    }*/
        //http://fastapi.localhost:8008/users/?skip=0&limit=100
       // Call the server API to check if the given email ID already exists
    async function checkAccountExists() {
        const response = await fetch("http://fastapi.localhost:8008/check-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email: email})
        });
        const obj = await response.json()
        console.log(JSON.stringify(obj))
        if (obj.is_active===true){
            console.log("yes")
            logIn() 
        }
        else {
            if (window.confirm("An account does not exist with this email address: " + email + ". Do you want to create a new account?")) {
                navigate("/register")
            }  
            else {
                navigate("/")
            }
        }
    }
    async function logIn() {
       const response = await fetch("http://fastapi.localhost:8008/auth", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({email: email, hash_pw: password})
    });
    const obj = await response.json();
    console.log(JSON.stringify(obj));
    if ('success' === obj.message) {
        sessionStorage.setItem("email", email)
        sessionStorage.setItem("user_id", obj.user_id)
        sessionStorage.setItem("is_admin", obj.is_admin)
        sessionStorage.setItem("token", obj.token)
        navigate("/dashboard")
    } else {
        window.alert("Wrong email or password")
    }
    }
    return <div className={"mainContainer"}>

        <div className={"titleContainer"}>

            <div>Login</div>

        </div>

        <br />

        <div className={"inputContainer"}>

            <input

                value={email}

                placeholder="Enter your email here"

                onChange={ev => setEmail(ev.target.value)}

                className={"inputBox"} />

            <label className="errorLabel">{emailError}</label>

        </div>

        <br />

        <div className={"inputContainer"}>

            <input

                value={password}

                placeholder="Enter your password here"

                onChange={ev => setPassword(ev.target.value)}

                className={"inputBox"} />

            <label className="errorLabel">{passwordError}</label>

        </div>

        <br />

        <div className={"inputContainer"}>

            <input

                className={"inputButton"}

                type="button"

                onClick={onButtonClick}

                value={"Log in"} />

        </div>

        <div className={"inputContainer"}>

            <input

                className={"inputButton"}

                type="button"

                onClick={onForgetButtonClick}

                value={"Forgot Password?"} />

            </div>

    </div>

}


export default Login