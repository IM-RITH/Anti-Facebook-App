// ButtonComponent.js
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";

const ButtonComponent = ({ onPress, title, isNextButtonEnabled }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isNextButtonEnabled && styles.disabledButton]}
      disabled={isNextButtonEnabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    backgroundColor: COLORS.blue,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: "rgba(28, 120, 255, 0.5)",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 9,
    shadowOpacity: 1,
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
});
