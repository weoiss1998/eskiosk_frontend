import React, { useState } from "react";

import { useNavigate } from "react-router-dom";


const ForgotPassword = (props) => {

    const [email, setEmail] = useState("")

    const [VerifyCode, setVerifyCode] = useState("")

    const [emailError, setEmailError] = useState("")

    const [passwordError] = useState("")
    const [CodeError, setCodeError] = useState("")


    

    const navigate = useNavigate();

        

    const onSendButtonClick = async () => {

        // Check if email has an account associated with it
        checkEMailCorrect() 


    }
    const onBackButtonClick = async () => {
        navigate("/login")
    }

    /*async function Users() {
        const response = await fetch("http://fastapi.localhost:8008/users/?skip=0&limit=100")
        const todos = await response.json()
        console.log(JSON.stringify(todos))
    }*/
        //http://fastapi.localhost:8008/users/?skip=0&limit=100
       // Call the server API to check if the given email ID already exists
    async function checkEMailCorrect() {
            const response = await fetch("http://fastapi.localhost:8008/check-account", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({email: email, id: 0, is_active: true})
            });
            const obj = await response.json()
            if (obj.is_active===true){
                const new_response = await fetch("http://fastapi.localhost:8008/resetPassword", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({email: email, hash_pw: ""})
            });
            const new_obj = await new_response.json()
            if (new_obj.message==="success"){
                navigate("/changePassword")
            }
            else {
                window.alert("Something went wrong")
            }
            }
            else {
                setEmailError("Please enter a valid email")

            return
            }
    }
    return <div className={"mainContainer"}>

        <div className={"titleContainer"}>

            <div>Reset Password</div>

        </div>

        <br />

        <div className={"inputContainer"}>

        <input

            value={email}

            placeholder="Enter your Mail here"

            onChange={ev => setEmail(ev.target.value)}

            className={"inputBox"} />

        <label className="errorLabel">{emailError}</label>

        </div>

        <br />

        

        <div className={"inputContainer"}>

            <input

                className={"inputButton"}

                type="button"

                onClick={onSendButtonClick}

                value={"Reset Password"} />

        </div>
        <br />

        <div className={"inputContainer"}>

            <input

                className={"inputButton"}

                type="button"

                onClick={onBackButtonClick}

                value={"Back to Login"} />

        </div>
        <br />

    </div>

}

export default ForgotPassword