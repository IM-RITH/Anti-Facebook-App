import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { InputTextComponent, RegisterComponent } from "../../components";
import { useFocusEffect, useRoute } from "@react-navigation/native";

const FindEmail = () => {
  const [email, setEmail] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  const refreshLoginScreen = useCallback(() => {
    setEmail("");
    setEmailError("");
  }, []);
  useFocusEffect(refreshLoginScreen);
  const clearEmail = () => {
    setEmail("");
    setIsValidEmail(true);
    setEmailError("");
  };

  const handleEmailChange = (input) => {
    setEmail(input);
    if (!validateEmail(input)) {
      setEmailError("Invalid email address");
      setIsNextButtonEnabled(false);
    } else {
      setEmailError("");
      setIsNextButtonEnabled(true);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  return (
    <RegisterComponent
      title={"Enter your email address"}
      titleBtn={"Find Your Account"}
      isFindAccount={true}
      searchByText={"Search by number instead"}
      navigationFindText={"findphone"}
      navigationText={"otpcode"}
      emailFind={email}
      isNextButtonEnabled={!isNextButtonEnabled}
    >
      <InputTextComponent
        label="Email"
        value={email}
        onChangeText={handleEmailChange}
        isFocused={isEmailFocused}
        clear={email.length > 0}
        iconName="close-circle"
        InputFunction={clearEmail}
        onFocus={handleEmailFocus}
        isFlex={true}
        secureTextEntry={false}
        errorText={emailError}
      />
    </RegisterComponent>
  );
};

const styles = StyleSheet.create({});

export default FindEmail;
