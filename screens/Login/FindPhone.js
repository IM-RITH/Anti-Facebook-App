import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  ButtonComponent,
  InputTextComponent,
  RegisterComponent,
} from "../../components";

const FindPhone = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNumberFocused, setIsPhoneNumberFocused] = useState(false);

  const clearPhoneNumber = () => {
    setPhoneNumber("");
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
  };

  const handlePhoneNumberFocus = () => {
    setIsPhoneNumberFocused(true);
  };

  return (
    <RegisterComponent
      title={"Enter your phone number"}
      titleBtn={"Find Your Account"}
      isFindAccount={true}
      searchByText={"Search by email instead"}
      navigationFindText={"findemail"}
      navigationText={"otpcode"}
    >
      <InputTextComponent
        label="Phone number"
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        isFocused={isPhoneNumberFocused}
        clear={phoneNumber.length > 0}
        iconName="close-circle"
        InputFunction={clearPhoneNumber}
        onFocus={handlePhoneNumberFocus}
        isFlex={true}
        secureTextEntry={false}
      />
    </RegisterComponent>
  );
};

export default FindPhone;

const styles = StyleSheet.create({});
