import { useState } from "react";

export default function Registration() {

  const[email, setEmail] = useState();
  const[password, setPassword] = useState();
  const[repassword, setRepassword] = useState();
  const[status, setStatus] = useState();
  
  function HandleForm(event){
    event.preventDefault();

    if(password != repassword) {
      setStatus("Passwords do not match")
      return;
    };

    fetch("http://localhost:4000/register", {
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
    .then(data => setStatus(data.status))
    .catch(err => console.log(err))
  }
  
  function HandleInput(e){
    switch(e.target.name){
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "repassword":
        setRepassword(e.target.value);
        break;
    }
  }

  return (
    <section>
      <form onSubmit={HandleForm}>
        <h3>Registration</h3>
        <input name="email" type="email" autoComplete="on" onInput={HandleInput} required></input><br></br>
        <input name="password" type="password" onInput={HandleInput} required></input><br></br>
        <input name="repassword" type="password" onInput={HandleInput} required></input><br></br>
        <input type="submit" className="me-2" onInput={HandleInput}></input>
        <input type="reset"></input>
        {status ? status : ""}
      </form>
    </section>
  )
}

