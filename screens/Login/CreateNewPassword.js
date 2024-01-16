import { StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { InputTextComponent, RegisterComponent } from "../../components";
import { Alert } from "react-native";
import { publicRequest } from "../../requestMethod";

const CreateNewPassword = ({ route, navigation }) => {
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    // Update errorText based on the password length
    setErrorText(
      text.length < 6 ? "Password must be at least 6 characters long." : ""
    );
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handleResetPassword = async () => {
    const { emailFind } = route.params;

    // Set loading to true when the password reset process begins
    setIsLoading(true);

    try {
      const verifyCodeResponse = await publicRequest.post("/get_verify_code", {
        email: emailFind,
      });

      if (verifyCodeResponse.data.message === "OK") {
        const response = await publicRequest.post("/reset_password", {
          email: emailFind,
          code: verifyCodeResponse.data.data.verify_code,
          password,
        });

        if (response.data.message === "OK") {
          navigation.navigate("login");
        } else {
          Alert.alert("Error", "Failed to reset password. Please try again.");
        }
      } else {
        Alert.alert(
          "Error",
          "Failed to get verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "Error resetting password. Please try again.");
    } finally {
      // Set loading to false when the password reset process completes
      setIsLoading(false);
    }
  };

  return (
    <>
      <RegisterComponent
        title={"Create new Password"}
        subtitle={
          "You will use this password to access your account. Enter a combination of at least six numbers, letters, and punctuation marks."
        }
        titleBtn={"Reset Password"}
        onPressBtn={handleResetPassword}
        navigationText={"login"}
      >
        <InputTextComponent
          isFlex={true}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={handlePasswordChange}
          isFocused={isPasswordFocused}
          onFocus={handlePasswordFocus}
          secureTextEntry={true}
          clear={password !== ""}
          errorText={errorText}
        />
      </RegisterComponent>

      {/* Full-screen loading component */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateNewPassword;
