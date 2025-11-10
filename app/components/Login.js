import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";

import Style from "../misc/Style";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    function HandleInput(e){
        switch(e.target.id){
          case "email":
            setEmail(e.target.value);
            break;
          case "password":
            setPassword(e.target.value); 
            break;
        }
      }

    function Authenticate() {
        fetch("http://localhost:4000/login", {
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
        .then(data => console.log(data.status))
        .catch(err => console.log(err))
    }

    return (
        <View style={Style.container}>
            <View>
                <Text>Email:</Text>
                <TextInput 
                    id="email"
                    placeholder="Enter your email..."
                    style={Style.input}
                    onChange={HandleInput}
                />
                <Text>Password:</Text>
                <TextInput 
                    id="password"
                    placeholder="Enter your password..."
                    style={Style.input}
                    onChange={HandleInput}
                />
                <Pressable onPress={Authenticate}>
                    <Text>Login</Text>
                </Pressable>
            </View>
        </View>
    );
}