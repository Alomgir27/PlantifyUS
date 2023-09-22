import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, View, Alert, ScrollView } from "react-native";
import { Button, Text, TextInput, Banner, Colors } from "react-native-paper";
import { auth } from "../config/firebase";
import styles from "./styles";

import { API_URL as baseURL } from "../constants/index";
import axios from "axios";

import { COLORS } from "../constants/index";

import LottieView from "lottie-react-native";

import { fetchUser } from "../modules/data";

import { useDispatch } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { ToastAndroid, Platform } from "react-native";

export default function Login({ navigation }) {

  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  const [securedpassword, setSecuredpassword] = useState(true);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [color, setColor] = useState("#9d9d9d");
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");

  const dispatch = useDispatch();

  

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Error",
          "Failed to get push token for push notification!"
        );
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
      console.log(token);
    })();
  }, []);





  const onSignin = () => {
    setLoading(true)
    auth.signInWithEmailAndPassword(Email, Password)
      .then(async (result) => {
        if(result?.user?.emailVerified === false){
          setLoading(false);
          setLabel("Please verify your email address first");
          setVisible(true);
          return;
        }
        await axios.post(`${baseURL}/users/login`, {
          email: Email,
          password: Password,
          pushToken: expoPushToken,
        })
        .then(async (res) => {
          dispatch(fetchUser(res?.data?.user?._id));
          console.log(res?.data?.user);
          await AsyncStorage.setItem("user", JSON.stringify(res?.data?.user));
          setLoading(false);
          console.log(res);
          setEmail("");
          setPassword("");
          if(Platform.OS === "android"){
            ToastAndroid.show("Login Successful", ToastAndroid.SHORT);
          }
          navigation.navigate("Home"),
          setVisible(false);
          setLabel("");
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          Alert.alert("Error", err.message);
        })

      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        setLabel(error.message);
        setVisible(true);

      });
  };
  const eyeColor = () => {
    if (!securedpassword) {
      setColor("#9d9d9d");
    } else {
      setColor("#3d3d3d");
    }
  };
  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../../assets/lottie/login-and-sign-up.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 }}>
          Login
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center", color: COLORS.gray, marginBottom: 20 }}>
          Welcome back! Login to your existing account
        </Text>
      </View>
      <Banner
          visible={visible}
          actions={[
            {
              label: "Ok",
              onPress: () => setVisible(false),
            },
          ]}
          contentStyle={{
            backgroundColor: '#f8d7da',
            borderRadius: 9,
          }}
          style={{
            margin: 10,
            borderRadius: 9,
            marginBottom: 20,
            
          }}
        >
          <Text style={{ fontSize: 15, color: "#000" }}>{label}</Text>
        </Banner>


      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", padding: 20, bottom: 50, marginTop: 20 }}
      >
        <TextInput
          label="Email"
          style={styles.input}
          value={Email}
          onChangeText={(text) => setEmail(text)}
          type="email"
          keyboardType="email-address"
          mode="outlined"
        />

        <TextInput
          label="Password"
          style={styles.input}
          value={Password}
          type="password"
          onChangeText={(text) => setPassword(text)}
          mode="outlined"
          secureTextEntry={securedpassword}
          right={
            <TextInput.Icon
              name={securedpassword ? "eye-off" : "eye"}
              size={30}
              color={color}
              onPress={() => {
                setSecuredpassword(!securedpassword);
                eyeColor();
              }}
            />
          }
        />

        <Text style={{ textAlign: "center", color: COLORS.gray, marginBottom: 5 }}>
          By continuing, you agree to our Terms of Use and Privacy Policy
        </Text>

        <Button style={styles.button} mode="contained" onPress={onSignin} color="#000" loading={loading}>
          Sign in
        </Button>
        <Button
          uppercase={false}
          style={[styles.button, { marginBottom: -20 }]}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Forgot password?
        </Button>
        <Text style={{ textAlign: "center", color: COLORS.gray, marginTop: 10}}>
          Don't have an account?
        </Text>
        <Button
          style={{ textAlign: "center", marginBottom: 30, fontWeight: "bold" }}
          onPress={() => navigation.navigate("Signup")}
        >
          Sign up
        </Button>
        
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
