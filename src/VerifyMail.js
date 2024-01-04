import React, { useState } from "react";

//import { useNavigate } from "react-router-dom";


const VerifyMail = (props) => {

    const [email] = useState("")

    const [VerifyCode, setVerifyCode] = useState("")

    //const [emailError, setEmailError] = useState("")

    const [passwordError] = useState("")


    

    //const navigate = useNavigate();

        

    const onButtonClick = async () => {

        // Check if email has an account associated with it
        checkCodeCorrect() 


    }

    /*async function Users() {
        const response = await fetch("http://fastapi.localhost:8008/users/?skip=0&limit=100")
        const todos = await response.json()
        console.log(JSON.stringify(todos))
    }*/
        //http://fastapi.localhost:8008/users/?skip=0&limit=100
       // Call the server API to check if the given email ID already exists
    async function checkCodeCorrect() {
        const response = await fetch("http://fastapi.localhost:8008/check-account", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email: email, id: 0, is_active: true})
        });
        logIn()
        const obj = await response.json()
        console.log(JSON.stringify(obj))
        /*
        if (obj.is_active===true){
            console.log("yes")
            logIn() 
        }
        else {
            if (window.confirm("An account does not exist with this email address: " + email + ". Do you want to create a new account?")) {
                navigate("/register")
            }  
        }*/
    }
    async function logIn() {
       /*const response = await fetch("http://fastapi.localhost:8008/auth", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({email: email, hash_pw: password+"notreallyhashed"})
    });
    const obj = await response.json();
    console.log(JSON.stringify(obj));
    if ('success' === obj.message) {
        localStorage.setItem("user", JSON.stringify({email, token: obj.token}))
        props.setLoggedIn(true)
        props.setEmail(email)
        navigate("/")
    } else {
        window.alert("Wrong email or password")
    }*/
    }
    return <div className={"mainContainer"}>

        <div className={"titleContainer"}>

            <div>Login</div>

        </div>

        <br />


        <div className={"inputContainer"}>

            <input

                value={VerifyCode}

                placeholder="Enter your Code here"

                onChange={ev => setVerifyCode(ev.target.value)}

                className={"inputBox"} />

            <label className="errorLabel">{passwordError}</label>

        </div>

        <br />

        <div className={"inputContainer"}>

            <input

                className={"inputButton"}

                type="button"

                onClick={onButtonClick}

                value={"Verify"} />

        </div>
        <br />

        <div className={"inputContainer"}>

            <input

                className={"inputButton"}

                type="button"

                onClick={onButtonClick}

                value={"Resend Mail"} />

        </div>
        <br />

    </div>

}

export default VerifyMail