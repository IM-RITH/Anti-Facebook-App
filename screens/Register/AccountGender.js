import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckBoxComponent, RegisterComponent } from "../../components";
import { COLORS } from "../../constants/theme";

const AccountGender = () => {
  const [customText, setCustomText] = useState("");

  return (
    <RegisterComponent
      title={"What's your gender?"}
      subtitle={"You can change who sees your gender on your profile later"}
      titleBtn={"Next"}
      navigationText={"number"}
    >
      <View>
        <CheckBoxComponent
          label="Female"
          checkboxSize={16}
          checkboxColor={COLORS.blue}
          checkboxWidth={300}
        />

        <CheckBoxComponent
          label="Male"
          checkboxSize={16}
          checkboxColor={COLORS.blue}
          checkboxWidth={300}
        />
        <CheckBoxComponent
          label="Custom"
          checkboxSize={16}
          checkboxColor={COLORS.blue}
          checkboxWidth={300}
          isCustom={true}
          onCustomInputChange={setCustomText}
        />
      </View>
    </RegisterComponent>
  );
};

const styles = StyleSheet.create({});

export default AccountGender;
