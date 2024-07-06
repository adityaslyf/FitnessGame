import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
  } from "react-native";
  import React, { useState } from "react";
  import { FIREBASE_AUTH } from "../../Firebase";
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  
  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
  
    const signIn = async () => {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in");
        alert("User signed in");
      } catch (error) {
        console.log(error);
        alert(error);
      }
      setLoading(false);
    };
  
    const signUp = async () => {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed in");
        alert("Check your email to verify your account");
      } catch (error) {
        console.log(error);
        alert(error);
      }
      setLoading(false);
    };
  
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Welcome</Text>
          <TextInput
            value={email}
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            value={password}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
          />
          {loading ? (
            <ActivityIndicator size="large" color="#6200ee" />
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={signIn}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={signUp}
              >
                <Text style={[styles.buttonText, styles.buttonOutlineText]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default Login;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    innerContainer: {
      width: "80%",
      alignItems: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#6200ee",
    },
    input: {
      width: "100%",
      padding: 15,
      borderRadius: 10,
      backgroundColor: "#fff",
      marginBottom: 15,
      borderColor: "#ddd",
      borderWidth: 1,
    },
    button: {
      width: "100%",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: "#6200ee",
      marginBottom: 10,
    },
    buttonOutline: {
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: "#6200ee",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    buttonOutlineText: {
      color: "#6200ee",
    },
  });
  