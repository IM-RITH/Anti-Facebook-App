import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants/theme";
import { ButtonComponent, InputTextComponent } from "../../components";
import { publicRequest } from "../../requestMethod";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../../hooks/AuthContext";
import { Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const clearEmail = () => {
    setEmail("");
  };
  const handleEmailFocus = () => {
    setEmailFocused(true);
    setPasswordFocused(false);
    setErrorMessage("");
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    setEmailFocused(false);
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const refreshLoginScreen = useCallback(() => {
    setEmail("");
    setPassword("");
    setErrorMessage("");
  }, []);
  useFocusEffect(refreshLoginScreen);
  const handleLogin = async () => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const response = await publicRequest.post("/login", {
        email,
        password,
        uuid: "a12345",
      });
      if (response.data.message === "OK") {
        const loginToken = response?.data?.data.token;
        const coins = response?.data?.data.coins;
        const userInfo = response?.data?.data;
        const userId = response?.data?.data.id;
        await SecureStore.setItemAsync("loginToken", loginToken);
        await SecureStore.setItemAsync("coins", coins);
        await SecureStore.setItemAsync("id", userId.toString());
        // Retrieve existing account information
        const storedAccountInfoString = await SecureStore.getItemAsync(
          "accountInfo"
        );

        let storedAccountInfo = [];
        if (storedAccountInfoString) {
          try {
            storedAccountInfo = JSON.parse(storedAccountInfoString);
          } catch (error) {
            console.error("Error parsing account info:", error);
          }
        }

        // Check if the new account ID already exists in the array
        const isNewAccount = storedAccountInfo.some(
          (account) => String(account.userInfo.id) === String(userInfo.id)
        );

        if (!isNewAccount) {
          // Add the new account information to the array along with email
          storedAccountInfo.push({ userInfo, email });
          // Store the updated array along with email
          await SecureStore.setItemAsync(
            "accountInfo",
            JSON.stringify(storedAccountInfo)
          );
        }

        // Navigate to TabNavigator after successful login
        navigation.navigate("TabNavigator", {
          coin: coins,
        });
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        resizeMode="cover"
        source={require("../../assets/images/Rectangle1.png")}
        style={styles.backgroundImage}
      />
      <Image
        resizeMode="cover"
        source={require("../../assets/images/Rectangle2.png")}
        style={[styles.backgroundImage, { top: -10, left: 0 }]}
      />
      <Image
        resizeMode="cover"
        source={require("../../assets/images/Rectangle3.png")}
        style={[styles.backgroundImage, { top: 10, left: 0 }]}
      />
      <Image
        resizeMode="cover"
        source={require("../../assets/images/Rectangle4.png")}
        style={[styles.backgroundImage, { top: 40, left: 0 }]}
      />
      <View style={styles.contentContainer}>
        <Image
          resizeMode="cover"
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputContainer}
        >
          <InputTextComponent
            label="Phone or Email"
            value={email}
            onChangeText={setEmail}
            isFocused={emailFocused}
            clear={email !== ""}
            InputFunction={clearEmail}
            onFocus={handleEmailFocus}
            iconName="ios-close"
          />
          <InputTextComponent
            label="Password"
            value={password}
            onChangeText={setPassword}
            isFocused={passwordFocused}
            clear={password !== ""}
            onFocus={handlePasswordFocus}
            InputFunction={setShowPassword}
            iconName={showPassword ? "eye-outline" : "eye-off-outline"}
            secureTextEntry={!showPassword}
          />
          <ButtonComponent title={"Log In"} onPress={handleLogin} />
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity onPress={() => navigation.navigate("findphone")}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={styles.createAccountButtonText}>
              Create new Facebook account
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
      {/* Full-screen loading component */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "30%",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logo: {},
  inputContainer: {
    width: "100%",
  },
  forgotPasswordText: {
    textAlign: "center",
    color: "blue",
    fontWeight: "bold",
  },
  createAccountButton: {
    padding: 10,
    borderRadius: SIZES.large,
    borderColor: "blue",
    borderWidth: 2,
    marginTop: 15,
    alignItems: "center",
    fontSize: 18,
  },
  createAccountButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
