import React from "react";
import { StyleSheet, View, StatusBar, Image, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { auth } from "../config/firebase";
import styles from "./styles";
import LottieView from "lottie-react-native";

import * as Icon from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

import { COLORS } from "../constants";

export default function ForgotPassword({ navigation }) {
  const [Email, setEmail] = React.useState("");
  const [label, setLabel] = React.useState("");

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const onPasswordReset = () => {
    auth
      .sendPasswordResetEmail(Email)
      .then((res) => {
        console.log(res);
        onToggleSnackBar();
        visible ? "Hide" : "Show";
        setLabel(`Reset password link has been sent to you email id: ${Email}`);
      })
      .catch((error) => {
        setLabel(error);
        onToggleSnackBar();
        visible ? "Hide" : "Show";
      });
  };
  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      <TouchableOpacity style={{ position: 'absolute', top: 1, left: 1, zIndex: 100}}
      onPress={() => navigation.goBack()}>
        <Icon.MaterialCommunityIcons name="arrow-left" size={27} color={'black'} />
      </TouchableOpacity>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../../assets/lottie/forgot-password.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <TextInput
          label="Email"
          value={Email}
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          type="email"
          keyboardType="email-address"
          mode="outlined"
        />
         <Text style={{ textAlign: "center", color: COLORS.gray, marginBottom: 5 }}>
          By continuing, you agree to our Terms of Use and Privacy Policy
        </Text>
        

        <Button
          style={styles.button}
          mode="contained"
          onPress={onPasswordReset}
        >
          Verify
        </Button>
      </KeyboardAvoidingView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ textAlign: "center", color: COLORS.gray, marginBottom: 5 }}>
            Back to Login Page
          </Text>
        </TouchableOpacity>
      </View>
     
      
    </ScrollView>
  );
}
