import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  InputTextComponent,
  PickerDateComponent,
  RegisterComponent,
} from "../../components";
import { useState } from "react";

const AccountBirthDay = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };
  return (
    <RegisterComponent
      title={"What's is your birthday ?"}
      subtitle={
        "Choose your date of birth. You can always make this private later"
      }
      titleBtn={"Next"}
      navigationText={"gender"}
    >
      <PickerDateComponent
        date={selectedDate}
        onDateChange={handleDateChange}
      />
    </RegisterComponent>
  );
};

export default AccountBirthDay;

const styles = StyleSheet.create({});
