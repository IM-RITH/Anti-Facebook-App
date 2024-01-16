import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const ShortcutMenu = ({ iconName, label }) => {
  return (
    <View style={[styles.container]}>
      <Ionicons style={{ fontSize: 25, right: 10 }} name={iconName} />
      <Text style={[styles.TextLabel, { fontWeight: 500, fontSize: 16 }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 350,
    height: 50,
    backgroundColor: "#FAF6F0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: 10,
    top: 10,
  },
  TextLabel: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  //   Icon: {
  //     left: 10,
  //   },
});

export default ShortcutMenu;
