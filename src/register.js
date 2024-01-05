import React, { useState } from "react";

import { useNavigate } from "react-router-dom";


const Register = (props) => {

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [passwordTwice, setPasswordTwice] = useState("")

    const [emailError, setEmailError] = useState("")

    const [passwordError, setPasswordError] = useState("")

    

    const navigate = useNavigate();

        

    const onButtonClick = async () => {

        if ("" === password) {

            setPasswordError("Please enter a password")

            return

        }


        if (password.length < 2) {

            setPasswordError("The password must be 8 characters or longer")

            return

        }
        // Check if email has an account associated with it
        startRegisterProcess() 


    }

    /*async function Users() {
        const response = await fetch("http://fastapi.localhost:8008/users/?skip=0&limit=100")
        const todos = await response.json()
        console.log(JSON.stringify(todos))
    }*/
        //http://fastapi.localhost:8008/users/?skip=0&limit=100
       // Call the server API to check if the given email ID already exists
    async function startRegisterProcess() {
        if (password!==passwordTwice){
            setPasswordError("Passwords do not match");
        return}
        else {
        const response = await fetch("http://fastapi.localhost:8008/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email: email, hash_pw: password})
        });
        const obj = await response.json()
        if (response.status===400){
                setEmailError("Email already exists")
                return
        }
        if (obj.message==="success"){
            console.log("nextStep")
            navigate("/verifyMail")
        }
        else {
            if (window.confirm("Internal Server Error. Do you want to try again?")) {
                navigate("/register")
            }  
        }
    }
}
    return <div className={"mainContainer"}>

        <div className={"titleContainer"}>

            <div>Register</div>

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
        <div className={"inputContainer"}>

            <input

                value={passwordTwice}

                placeholder="Reenter your password here"

                onChange={ev => setPasswordTwice(ev.target.value)}

                className={"inputBox"} />

            <label className="errorLabel">{passwordError}</label>

        </div>

        <br />

        <div className={"inputContainer"}>

            <input

                className={"inputButton"}

                type="button"

                onClick={onButtonClick}

                value={"Register"} />

        </div>

    </div>

}


export default Register