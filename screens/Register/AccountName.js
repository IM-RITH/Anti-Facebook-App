import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { InputTextComponent, RegisterComponent } from "../../components";
import { useState } from "react";

const AccountName = () => {
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleFirstNameFocus = () => {
    setFirstNameFocused(true);
    setLastNameFocused(false);
  };

  const handleLastNameFocus = () => {
    setFirstNameFocused(false);
    setLastNameFocused(true);
  };

  const clearFirstName = () => {
    setFirstName("");
  };

  const clearLastName = () => {
    setLastName("");
  };

  return (
    <RegisterComponent
      title={"What's is your name ?"}
      subtitle={"Enter the name you use in real life"}
      titleBtn={"Next"}
      navigationText={"birthday"}
    >
      <InputTextComponent
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        isFocused={firstNameFocused}
        clear={firstName !== ""}
        Inputunction={clearFirstName}
        onFocus={handleFirstNameFocus}
        isFlex={true}
        iconName={"ios-close"}
      />
      <InputTextComponent
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        isFocused={lastNameFocused}
        clear={lastName !== ""}
        Inputunction={clearLastName}
        onFocus={handleLastNameFocus}
        isFlex={true}
        iconName={"ios-close"}
      />
    </RegisterComponent>
  );
};

export default AccountName;

const styles = StyleSheet.create({});
