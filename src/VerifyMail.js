import React, { useState } from "react";

import { useNavigate } from "react-router-dom";


const VerifyMail = (props) => {

    const [email, setEmail] = useState("")

    const [VerifyCode, setVerifyCode] = useState("")

    //const [emailError, setEmailError] = useState("")

    const [passwordError] = useState("")
    const [CodeError, setCodeError] = useState("")


    

    const navigate = useNavigate();

        

    const onVerifyButtonClick = async () => {

        // Check if email has an account associated with it
        checkCodeCorrect() 


    }
    const onBackButtonClick = async () => {
        navigate("/register")
    }

    /*async function Users() {
        const response = await fetch("http://fastapi.localhost:8008/users/?skip=0&limit=100")
        const todos = await response.json()
        console.log(JSON.stringify(todos))
    }*/
        //http://fastapi.localhost:8008/users/?skip=0&limit=100
       // Call the server API to check if the given email ID already exists
    async function checkCodeCorrect() {
        const response = await fetch("http://fastapi.localhost:8008/verify", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({email: email, auth_code: VerifyCode})
        });
        const obj = await response.json()
        if (response.status!==200){
            setCodeError("Wrong E-Mail address or Code")
            return
        }
        console.log(JSON.stringify(obj))
        if (obj.message==="success"){
            console.log("yes")
            navigate("/login")
        }
        else {
            setCodeError("Internal Error, please try again")
            return
        }
    }
    return <div className={"mainContainer"}>

        <div className={"titleContainer"}>

            <div>Verify Mail</div>

        </div>

        <br />

        <div className={"inputContainer"}>

        <input

            value={email}

            placeholder="Enter your Mail here"

            onChange={ev => setEmail(ev.target.value)}

            className={"inputBox"} />

        <label className="errorLabel">{passwordError}</label>

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

                className={"inputButton"}

                type="button"

                onClick={onVerifyButtonClick}

                value={"Verify"} />

        </div>
        <br />

        <div className={"inputContainer"}>

            <input

                className={"inputButton"}

                type="button"

                onClick={onBackButtonClick}

                value={"Back to Register"} />

        </div>
        <br />

    </div>

}

export default VerifyMail