import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { InputTextComponent, RegisterComponent } from "../../components";
import { useFocusEffect, useRoute } from "@react-navigation/native";

const AccountPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  const route = useRoute();
  const emailRegister = route.params?.emailRegister;
  const refreshLoginScreen = useCallback(() => {
    setPassword("");
    setPasswordError("");
  }, []);
  useFocusEffect(refreshLoginScreen);
  const clearPassword = () => {
    setPassword("");
    setPasswordError("");
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordChange = (input) => {
    setPassword(input);
    if (input.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setIsNextButtonEnabled(false);
    } else {
      setPasswordError("");
      setIsNextButtonEnabled(true);
    }
  };

  return (
    <RegisterComponent
      title={"Choose a password"}
      subtitle={
        "Create a password with at least 6 characters. It should be something others couldn't guess."
      }
      titleBtn={"Next"}
      navigationText={"terms"}
      password={password}
      emailRegister={emailRegister}
      isNextButtonEnabled={!isNextButtonEnabled}
    >
      <InputTextComponent
        label={"Password"}
        value={password}
        onChangeText={handlePasswordChange}
        iconName="close-circle"
        isFocused={passwordFocused}
        clear={password !== ""}
        InputFunction={clearPassword}
        onFocus={handlePasswordFocus}
        isFlex={true}
        secureTextEntry={true}
        errorText={passwordError}
      />
    </RegisterComponent>
  );
};

const styles = StyleSheet.create({});

export default AccountPassword;
