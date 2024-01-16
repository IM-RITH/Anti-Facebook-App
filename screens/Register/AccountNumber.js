import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { InputTextComponent, RegisterComponent } from "../../components";

const AccountNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);

  const clearPhoneNumber = () => {
    setPhoneNumber("");
  };

  const handlePhoneNumberFocus = () => {
    setPhoneNumberFocused(true);
  };

  return (
    <RegisterComponent
      title={"Enter your mobile number"}
      subtitle={
        "Enter your mobile number where you can be reached. No one else will see this on your profile."
      }
      titleBtn={"Next"}
      navigationText={"password"}
    >
      <InputTextComponent
        label={"Mobile number"}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        isFocused={phoneNumberFocused}
        clear={phoneNumber !== ""}
        clearFunction={clearPhoneNumber}
        onFocus={handlePhoneNumberFocus}
        isFlex={true}
      />
    </RegisterComponent>
  );
};
const styles = StyleSheet.create({});

export default AccountNumber;
