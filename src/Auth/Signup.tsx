import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity
} from "react-native";
import {
  Button,
  Text,
  TextInput,
  Banner,
} from "react-native-paper";
import { auth, db,  storage } from "../config/firebase";
import styles from "./styles";

import { API_URL as baseURL } from "../constants/index";
import axios from "axios";

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import LottieView from "lottie-react-native";
import { uriToBlob } from "../components/uriToBlob";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchUser } from "../modules/data";

import { useDispatch } from "react-redux";
import { ToastAndroid, Platform } from "react-native";


export default function Signup({ navigation }) {


  const [Name, setName] = useState("");
  const [securedpassword, setSecuredpassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [color, setColor] = useState("#9d9d9d");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  
  const dispatch = useDispatch();


  //SnackBar manage
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation({ type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude] });
    })();
}, []);






  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
    }
   
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1
    });

    if (!result.cancelled) {
        setImage(result.uri);
    }
};


  
  

  const onSignUp = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(Email)) {
      setLabel("Please enter a valid email address");
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    } else if (Name == "" || Email == "" || Password == "") {
      setLabel("Please fill all the fields");
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
    else if (Password != confirmPassword) {
      setLabel("Passwords do not match");
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
     else {
      const obj = {
        name: Name,
        email: Email,
        password: Password,
        location: location,
        eventsAttending: [],
        friends: [],
        posts: [],
        bio: "",
        uuid: "",
        image: "https://firebasestorage.googleapis.com/v0/b/plantifyus.appspot.com/o/logo.png?alt=media&token=f0aadb2a-e1d0-480a-96f0-ca9e60221694"
      }
     
      setLoading(true)
      await auth.createUserWithEmailAndPassword(Email, Password)
        .then(async (result) => {
          if(image !== null){
            const blob = await uriToBlob(image);
            const childPath = `images/${auth?.currentUser?.uid}/${Math.random().toString(36)}`;
            await storage.ref().child(childPath).put(blob)
            const url = await storage.ref().child(childPath).getDownloadURL();
            obj.image = url;
          }
          // verfication email
          await result.user.sendEmailVerification();
          await axios.post(`${baseURL}/users/register`, obj)
          .then(async (res) => {
            console.log(res);
            await AsyncStorage.setItem("user", JSON.stringify(res?.data?.user));
            setLoading(false);
            setEmail("");
            setPassword("");
            if(Platform.OS === "android"){
              ToastAndroid.show("Verification email has been sent to your email address", ToastAndroid.SHORT);
            }
            navigation.navigate("Login"),
            setVisible(false);
            setLabel("");
          })
          .catch(async (err) => {
            setLoading(false);
            console.log(err);
            Alert.alert("Error", err.message);
            await auth?.currentUser?.delete();
            
          })
         
        })
        .catch(async (error) => {
          console.log(error);
          setLabel(error.message);
          setLoading(false)
          setVisible(true);
        });
    }
  };

  const eyeColor = () => {
    if (!securedpassword) {
      setColor("#9d9d9d");
    } else {
      setColor("#3d3d3d");
    }
  };


  if(errorMsg){
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{errorMsg}</Text>
    </View>
  }




  return (
    <ScrollView style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../../assets/lottie/login.json")}
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>

      <Text
        style={{
          textAlign: "center",
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Sign up
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#9d9d9d",
          marginBottom: 20,
          marginHorizontal: 20,
        }}
      >
        Create an account to get started. After that, you can contribute to our community by posting your own events and attending others.
        </Text>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={pickImage}>
          {image ? <Image source={{ uri: image }} style={{ width: 200, height: 200, borderRadius: 100 }} /> : <Image source={require("../../assets/logo.png")} style={{ width: 200, height: 200, borderRadius: 100 }} /> }
        </TouchableOpacity>
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
            backgroundColor: '#8d8d8d',
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
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <TextInput
          label="Name"
          value={Name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Email"
          value={Email}
          onChangeText={(email) => setEmail(email)}
          type="email"
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
        />

        <TextInput
          Password
          label="Password"
          value={Password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
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

        <TextInput
          Password
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          style={styles.input}
          mode="outlined"
          secureTextEntry={securedpassword}
        />
        <Text
          style={{
            textAlign: "center",
            color: "#9d9d9d",
            marginBottom: 20,
            marginHorizontal: 20,
          }}
        >
          By continuing, you agree to our Terms of Use and Privacy Policy
        </Text>

        <Button style={styles.button}
          mode="contained" 
          onPress={onSignUp}
          loading={loading}
        >
          Sign up
        </Button>

        <Text style={{ textAlign: "center", color: "#9d9d9d", marginTop: 20, marginBottom: 5 }}>
          Already have an account?
        </Text>
        <Button
          style={{ textAlign: "center", marginBottom: 30, fontWeight: "bold" }}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Button>
          
        
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
