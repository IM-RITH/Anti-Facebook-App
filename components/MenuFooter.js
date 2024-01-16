import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const MenuFooter = ({ iconName, label }) => {
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
    
})
export default MenuFooter;
