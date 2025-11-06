import { useState } from "react";

export default function Registration() {

  const[email, setEmail] = useState();
  const[password, setPassword] = useState();
  const[repassword, setRepassword] = useState();
  
  function HandleForm(event){
    event.preventDefault();

    if(password != repassword) return ;

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
    .then(data => console.log(data.message))
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
        <input name="email" type="email" autoComplete="on" onInput={HandleInput}></input><br></br>
        <input name="password" type="password" onInput={HandleInput}></input><br></br>
        <input name="repassword" type="password" onInput={HandleInput}></input><br></br>
        <input type="submit" className="me-2" onInput={HandleInput}></input>
        <input type="reset"></input>
      </form>
    </section>
  )
}

