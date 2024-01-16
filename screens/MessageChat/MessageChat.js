import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const MessageChat = ({ navigation }) => {
  const [message, setMessage] = useState("");
  const messageData = [
    { type: "system", text: "Hi, how are you today?", timestamp: "21:32" },
    { type: "user", text: "Hi", timestamp: "21:32" },
    // Add more messages as needed
  ];
  const handleSend = () => {
    console.log("Message sent:", message);
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("message")}>
          <Ionicons name="ios-arrow-back" size={24} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("chatproflie")}>
          <View style={styles.userInfo}>
            <Image
              source={require("../../assets/images/story4.png")}
              style={styles.avatar}
            />
            <View style={styles.userInfoText}>
              <Text style={styles.username}>John Doe</Text>
              <Text style={styles.activeStatus}>Active 21 minutes ago</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.callIcons}>
          <Ionicons name="call-outline" size={24} color="#34B7F1" />
          <Ionicons name="videocam-outline" size={24} color="#34B7F1" />
        </View>
      </View>
      <FlatList
        data={messageData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <View
              style={{
                alignItems: "center",
                gap: 5,
                marginBottom: 5,
              }}
            >
              <Image
                source={require("../../assets/images/story4.png")}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  resizeMode: "contain",
                }}
              />
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Maisy Hupheri
              </Text>
              <Text>You’re friends on Facebook</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={{ flexDirection: "row", position: "relative" }}>
                <Image
                  source={require("../../assets/images/story3.png")}
                  style={[styles.avatar, { position: "absolute", right: -15 }]}
                />
                <Image
                  source={require("../../assets/images/story4.png")}
                  style={[styles.avatar, { position: "absolute", left: -15 }]}
                />
              </View>
              <Text style={{ marginTop: 45 }}>
                Say hi to your new Facebook friend, Maisy.
              </Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <View>
            <View style={styles.chatMessages}>
              <View style={styles.messageContainer}>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
                {item.type === "system" ? (
                  <View style={styles.systemMessage}>
                    <Text style={styles.systemMessageText}>{item.text}</Text>
                  </View>
                ) : (
                  <View
                    style={
                      item.type === "user"
                        ? styles.userMessage
                        : styles.otherMessage
                    }
                  >
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <View style={styles.actionIcons}>
          <TouchableOpacity>
            <Ionicons name="camera-outline" size={24} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="image-outline" size={24} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="microphone" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity>
            <Ionicons name="happy-outline" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  justifyContent: "flex-end",
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfoText: {},
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  activeStatus: { alignItems: "center", color: "#888888" },
  callIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  chatMessages: {
    flex: 1,
  },
  actionIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  messageContainer: {
    marginBottom: 10,
  },
  timestamp: {
    textAlign: "center",
    marginBottom: 5,
    color: "#888888",
    fontSize: 12,
  },
  systemMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5E5",
    padding: 8,
    borderRadius: 10,
  },
  systemMessageText: {
    color: "#000",
    fontSize: 16,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4267B2",
    padding: 8,
    borderRadius: 10,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MessageChat;
