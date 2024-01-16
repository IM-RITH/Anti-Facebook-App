import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const MessageProfile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/story4.png")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Maisy Hupheri</Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="ios-call" size={24} color="#0084FF" />
          <Text style={styles.actionText}>Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="ios-videocam" size={24} color="#0084FF" />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="ios-person" size={24} color="#0084FF" />
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="ios-mic-off" size={24} color="#0084FF" />
          <Text style={styles.actionText}>Mute</Text>
        </TouchableOpacity>
      </View>
      {renderSettingsSection("Settings", [
        "Theme",
        "Emoji",
        "Nickname",
        "Word effects",
      ])}
      {renderSettingsSection("More Actions", [
        "View photos & videos",
        "Search in conversation",
        "Secret conversation",
        "Create group with Maisy",
      ])}
      {renderSettingsSection("Privacy", ["Notifications", "Block", "Report"])}
    </SafeAreaView>
  );
};

const renderSettingsSection = (title, items) => (
  <View style={styles.settingsSection}>
    <Text style={styles.settingsText}>{title}</Text>
    {items.map((item, index) => (
      <Text style={{ fontSize: 14, fontWeight: "400" }} key={index}>
        {item}
      </Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 25,
    resizeMode: "contain", // Use "contain" instead of "objectFit"
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 16,
  },
  actionItem: {
    alignItems: "center",
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: "#555",
  },
  settingsSection: {
    marginBottom: 16,
    borderTopColor: "#eee",
    borderTopWidth: 1,
    gap: 10,
  },
  settingsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
});

export default MessageProfile;
