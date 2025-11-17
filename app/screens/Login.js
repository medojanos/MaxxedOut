import { View, Text, TextInput, Pressable } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle";
import { StyleSheet } from "react-native";
const LoginStyle = StyleSheet.create({
  loginContainer : {
    flex: 1,
    backgroundColor: Var.black,
    justifyContent: "center",
    padding: 20
  },
  statusText : {
    color: Var.white,
    fontSize: 20,
    textAlign: "center"
  }
})

import { useContext, useState } from "react";
import { Context } from "../misc/Provider";
import { setData } from "../misc/Storage";

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
          setData("token", data.token);
          setLogin("true");
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
        <View style={LoginStyle.loginContainer}>
          <Text style={LoginStyle.statusText}>{status}</Text>
          <View style={MainStyle.container}>
          <Text style={MainStyle.screenTitle}>Login</Text>
            <TextInput 
              placeholder="Enter your email..."
              style={MainStyle.input}
              onChangeText={setEmail}
            />
            <TextInput 
              placeholder="Enter your password..."
              style={MainStyle.input}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable
              onPress={Authenticate}
              style={MainStyle.button}>
              <Text style={MainStyle.buttonText}>Login</Text>
            </Pressable>
          </View>
        </View>
    );
}