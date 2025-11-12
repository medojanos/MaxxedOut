import { View, Text, TextInput, Pressable } from "react-native";

import Style from "../style/Style";

import { useContext, useState } from "react";
import { Context } from "../misc/Provider";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [status, setStatus] = useState(); 

    const { setLogin } = useContext(Context);

    function Authenticate() {
      if (email == "") {
        setStatus("Enter a valid email");
        return;
      }
      if (password == "") {
        setStatus("Enter a valid password");
        return;
      }
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
      .then(data => {
        if (data.status) {
          setLogin(true);
        } else {
          setStatus(data.message);
        }
      })
      .catch(err => console.log(err))
    }

    return (
        <View style={Style.container}>
            <View>
                <Text>{status}</Text>
                <Text>Email:</Text>
                <TextInput 
                  autoComplete="email"
                  id="email"
                  placeholder="Enter your email..."
                  style={Style.input}
                  onChangeText={setEmail}
                />
                <Text>Password:</Text>
                <TextInput 
                  autoComplete="password"
                  id="password"
                  placeholder="Enter your password..."
                  style={Style.input}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Pressable
                  onPress={Authenticate}
                  style={Style.button}>
                    <Text>Login</Text>
                </Pressable>
            </View>
        </View>
    );
}