import { View, Text, TextInput, Pressable } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle";
import { StyleSheet } from "react-native";
const LoginStyle = StyleSheet.create({
  container : {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Var.darkGray
  },
  input : {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Var.paleWhite,
    marginBottom: 15,
    padding: 10,
    width: 250
  },
  button : {
    borderWidth: 1,
    backgroundColor: Var.paleRed,
    borderRadius: 5,
    color: Var.white,
    padding: 10
  },
  buttonText: {
    color: Var.white,
    textAlign: "center"
  }
})

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
          setStatus(data.message);
          setLogin(true);
        } else {
          setStatus(data.message);
        }
      })
      .catch(err => {
        setStatus("Something went wrong!");
        console.log(err)
      })
    }

    return (
        <View style={LoginStyle.container}>
            <View>
                <Text>{status}</Text>
                <TextInput 
                  autoComplete="email"
                  id="email"
                  placeholder="Enter your email..."
                  style={LoginStyle.input}
                  onChangeText={setEmail}
                />
                <TextInput 
                  autoComplete="password"
                  id="password"
                  placeholder="Enter your password..."
                  style={LoginStyle.input}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <Pressable
                  onPress={Authenticate}
                  style={LoginStyle.button}>
                    <Text style={LoginStyle.buttonText}>Login</Text>
                </Pressable>
            </View>
        </View>
    );
}