import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES } from "../../constants/theme";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent, InputTextComponent } from "../../components";
import { publicRequest } from "../../requestMethod";
import * as SecureStore from "expo-secure-store";

const EmailPasswordInput = ({ onClose, onOpen, selectedUser }) => {
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
    setErrorMessage("");
  };

  const refreshLoginScreen = React.useCallback(() => {
    setPassword("");
    setErrorMessage("");
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    if (selectedUser) {
      const emailLogin = selectedUser.email;
      try {
        const response = await publicRequest.post("/login", {
          email: emailLogin,
          password,
          uuid: "a12345",
        });

        if (response && response.data && response.data.message === "OK") {
          const loginToken = response?.data?.data.token;
          const coins = response?.data?.data.coins;
          await SecureStore.setItemAsync("loginToken", loginToken);
          await SecureStore.setItemAsync("coins", coins);
          navigation.navigate("TabNavigator", {
            coin: coins,
          });
        } else {
          setErrorMessage("Invalid email or password. Please try again.");
        }
      } catch (error) {
        console.error("Login error:", error);
        console.log(error.response?.data);
        setErrorMessage("Invalid email or password. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal visible={onOpen} animationType="slide" transparent={true}>
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
        </KeyboardAvoidingView>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      {/* Full-screen loading component */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </Modal>
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
    backgroundColor: "white", // Change the background color here
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
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  closeButtonText: {
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default EmailPasswordInput;
