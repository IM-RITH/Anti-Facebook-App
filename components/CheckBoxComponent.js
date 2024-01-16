import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { COLORS } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const CheckBoxComponent = ({
  label,
  checkboxSize,
  checkboxColor,
  checkboxWidth,
  isCustom,
  onCustomInputChange,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [customText, setCustomText] = useState("");

  const handleCheckChange = (newIsChecked) => {
    setIsChecked(newIsChecked);
    if (label === "Custom" && !newIsChecked) {
      setCustomText("");
    }
  };

  const handleCustomInputChange = (text) => {
    setCustomText(text);
    onCustomInputChange(text);
  };

  return (
    <SafeAreaView style={[styles.checkboxRow, { width: checkboxWidth }]}>
      <Text>{label}</Text>
      <BouncyCheckbox
        size={checkboxSize}
        isChecked={isChecked}
        onPress={handleCheckChange}
        fillColor={checkboxColor}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: COLORS.dark,
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 20,
  },
});

export default CheckBoxComponent;
