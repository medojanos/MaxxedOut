import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import Style from "../misc/Style";
import { storeData } from "../misc/Storage";
import { useEffect } from "react";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [isLoggedIn, setLogin] = useState();
    useEffect(() => storeData("isLoggedIn", isLoggedIn), []);

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
        .then(data => {
          if (data.status) {
            alert(data.message);
            useEffect(() => {
              async function set() {
                setLogin(true)
              }
              set();
            })
          } else {
            alert(data.message)
          }
        })
        .catch(err => console.log(err))
    }

    return (
        <View style={Style.container}>
            <View>
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