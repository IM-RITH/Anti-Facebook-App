import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { InputTextComponent, RegisterComponent } from "../../components";
import { useFocusEffect, useRoute } from "@react-navigation/native";

const AccountEmail = () => {
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  const refreshLoginScreen = useCallback(() => {
    setEmail("");
    setEmailError("");
  }, []);
  useFocusEffect(refreshLoginScreen);
  const clearEmail = () => {
    setEmail("");
    setEmailError("");
  };

  const handleEmailFocus = () => {
    setEmailFocused(true);
  };

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
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

  return (
    <RegisterComponent
      title={"Enter your email"}
      subtitle={
        "Enter your email address where you can be reached. No one else will see this on your profile."
      }
      titleBtn={"Next"}
      navigationText={"password"}
      emailRegister={email}
      isNextButtonEnabled={!isNextButtonEnabled}
    >
      <InputTextComponent
        label={"Email address"}
        value={email}
        onChangeText={handleEmailChange}
        isFocused={emailFocused}
        clear={email !== ""}
        iconName="close-circle"
        InputFunction={clearEmail}
        onFocus={handleEmailFocus}
        isFlex={true}
        keyboardType={"email-address"}
        errorText={emailError}
      />
    </RegisterComponent>
  );
};

const styles = StyleSheet.create({});

export default AccountEmail;
