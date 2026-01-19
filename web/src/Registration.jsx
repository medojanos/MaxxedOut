import "./style/form.css"
import "./main.css"
import { useState } from "react";

export default function Registration() {

  const[email, setEmail] = useState();
  const[password, setPassword] = useState();
  const[repassword, setRepassword] = useState();
  const[status, setStatus] = useState();
  const[pwdStrength, setPwdStrength] = useState();
  
  function HandleForm(event){
    event.preventDefault();

    if(password != repassword) {
        setStatus("Passwords do not match");
        return;
    }

    if(pwdStrength == "Weak"){
        setStatus("Password is weak");
        return;
    }

    fetch(import.meta.env.VITE_API_URL + "/register", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        setStatus(data.message);
        setTimeout(() => {
            window.location.href = "/";
        }, 2000);
    })
  }
  
  function HandleInput(e){
    switch(e.target.name){
        case "email":
            setEmail(e.target.value);
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

  return (
    <section className="form">
      <form onSubmit={HandleForm} className="container">
        <h3>Registration</h3>
        <input name="email" type="email" autoComplete="on" onInput={HandleInput} required placeholder="E-mail address"></input>
        <input name="password" type="password" onInput={HandleInput} required placeholder="Password"></input>
        <input name="repassword" type="password" onInput={HandleInput} required placeholder="Confirm password"></input>
        <p>{pwdStrength ? "Password strength: " + pwdStrength : ""}</p>
        <input type="submit" value={"Register"}></input>
        {status}
      </form>
    </section>
  )
}

