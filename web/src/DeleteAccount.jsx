import "./style/form.css"
import "./main.css"
import { useState } from "react";

export default function DeleteAccount() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [status, setStatus] = useState();

  function HandleForm(event){
    event.preventDefault();

    fetch(import.meta.env.VITE_API_URL + "/user", {
      method: "DELETE",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => res.json())
    .then(data => setStatus(data.message))
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
    }
  }

  return (
    <>
      <section className="form">
        <form onSubmit={HandleForm} className="container">
          <h3>Account deletion</h3>
          <input name="email" type="email" autoComplete="on" onInput={HandleInput} required placeholder="E-mail address"></input>
          <input name="password" type="password" onInput={HandleInput} required placeholder="Password"></input>
          <input type="checkbox" required className="checkbox"></input>
          <label for="checkbox">I understand that this action is irreversible</label>
          <input type="submit" value={"Delete my account"}></input>
          {status}
        </form>
      </section>
    </>
  )
}