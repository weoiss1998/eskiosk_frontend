import React, { useState } from "react";

import { useNavigate } from "react-router-dom";


const ChangePassword = (props) => {

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [passwordTwice, setPasswordTwice] = useState("")

    const [emailError, setEmailError] = useState("")

    const [passwordError, setPasswordError] = useState("")
    const [CodeError, setCodeError] = useState("")
    
    const [VerifyCode, setVerifyCode] = useState("")

    

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

        if (password!==passwordTwice){
            setPasswordError("Passwords do not match");
            return
        }
        // Check if email has an account associated with it
        changeToNewPassword() 


    }

    async function changeToNewPassword() {
        const response = await fetch("http://fastapi.localhost:8008/updatePassword", {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email: email, auth_code: VerifyCode, new_pw: password})
        });
        const obj = await response.json()
        if (response.status===400){
            setCodeError("Auth Code is wrong")
            return
        }
        if (obj.message==="success"){
            navigate("/login")
        }
        else {
            if (window.confirm("Internal Server Error. Do you want to try again?")) {
                navigate("/changePassword")
            }  
        }
}
    return <div className={"mainContainer"}>

        <div className={"titleContainer"}>

            <div>Change Password</div>

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

                value={VerifyCode}

                placeholder="Enter your Code here"

                onChange={ev => setVerifyCode(ev.target.value)}

                className={"inputBox"} />

            <label className="errorLabel">{CodeError}</label>

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

                value={"Change Password"} />

        </div>

    </div>

}


export default ChangePassword