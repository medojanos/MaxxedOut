import "./style/form.css"
import "./main.css"
import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState();
    const [code, setCode] = useState();
    const [status, setStatus] = useState();
    const [step, setStep] = useState(0);
    const [password, setPassword] = useState();
    const [repassword, setRepassword] = useState();
    const [pwdStrength, setPwdStrength] = useState();

    function SendCode(event){
        event.preventDefault();
        fetch("http://localhost:4000/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email}),
        })
        .then(res => res.json())
        .then(data => {
            setStatus("");
            data.success ? setStep(1) : setStatus(data.message);
        });
    }

    function VerifyCode(event){
        event.preventDefault();
        fetch("http://localhost:4000/verify-code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email, code: code}),
        })
        .then(res => res.json())
        .then(data => {
            setStatus("");
            data.success ? setStep(2) : setStatus(data.message);
        })
    }

    function ResetPassword(event){
        event.preventDefault();
        if(password !== repassword || pwdStrength === "Weak" || pwdStrength === ""){
            setStatus("Passwords do not match");
            return;
        }
        fetch("http://localhost:4000/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email, code: code, password: password}),
        })
        .then(res => res.json())
        .then(data => {
            setStatus(data.message);
            if(data.success){
                setStatus("Password successfully changed! Redirecting to homepage...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            }
        })
    }

    function HandleInput(e){
        setStatus("");
        switch(e.target.name){
        case "email":
            setEmail(e.target.value);
            break;
        case "code":
            setCode(e.target.value);
            break;
        case "password":
            setPassword(e.target.value); 
            evaluatePwdStrength(e.target.value);
            break;
        case "repassword":
            setRepassword(e.target.value);
            break;
        }
    }

    function evaluatePwdStrength(password){
        let score = 0;
    
        if(password.length >= 8) score += 2;
        if(password.length >= 12) score++;
        if(/[a-z]/.test(password)) score++;
        if(/[A-Z]/.test(password)) score++;
        if(/[0-9]/.test(password)) score++;
        if(/[^A-Za-z0-9]/.test(password)) score++;
      
        if (score == 7) setPwdStrength("Very strong")
        else if (score >= 6) setPwdStrength("Strong")
        else if (score > 4) setPwdStrength("Medium")
        else if (score > 0) setPwdStrength("Weak")
        else if (score == 0) setPwdStrength("")
      }

    function renderStep(){
        switch(step){
            case 0:
                return (
                    <form onSubmit={SendCode} className="container">
                        <h3>Password recovery</h3>
                        <input name="email" value={email || ""} type="email" onChange={HandleInput} required placeholder="E-mail address"></input>
                        <input name="codeSend" type="submit" value={"Send a code"}></input>
                        {status}
                    </form>
                    
                )
            case 1:
                return (
                    <form onSubmit={VerifyCode} className="container">
                        <h3>Verify your code</h3>
                        <p>We have sent a code to your email.</p>
                        <input name="code" value={code || ""} type="text" onChange={HandleInput} required placeholder="Recovery code"></input>
                        <input type="submit" value={"Verify my code"}></input>
                        {status}
                    </form>
                    
                )
            case 2:
                return (
                    <form onSubmit={ResetPassword} className="container">
                        <h3>Reset password</h3>
                        <input name="password" value={password || ""} type="password" onChange={HandleInput} required placeholder="New password"></input>
                        <input name="repassword" value={repassword || ""} type="password" onChange={HandleInput} required placeholder="Confirm new password"></input>
                        <p>{pwdStrength ? "Password strength: " + pwdStrength : ""}</p>
                        <input type="submit" value={"Change password"}></input>
                        {status}
                    </form>
                    
                )
        }
    }

  return (
    <section className="form">
        {renderStep()}
    </section>
  )
}