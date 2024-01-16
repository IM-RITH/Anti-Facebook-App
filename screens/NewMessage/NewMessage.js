import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const NewMessage = ({ navigation }) => {
  const suggestedChats = [
    {
      id: "1",
      avatar: require("../../assets/images/story2.png"),
      username: "Tocky Parker",
    },
    {
      id: "2",
      avatar: require("../../assets/images/story3.png"),
      username: "John Doe",
    },
    {
      id: "3",
      avatar: require("../../assets/images/story4.png"),
      username: "Jane Smith",
    },
    {
      id: "4",
      avatar: require("../../assets/images/story1.png"),
      username: "Alice Johnson",
    },
    {
      id: "5",
      avatar: require("../../assets/images/story3.png"),
      username: "Bob Williams",
    },
    {
      id: "6",
      avatar: require("../../assets/images/story1.png"),
      username: "Eva Brown",
    },
    {
      id: "7",
      avatar: require("../../assets/images/story2.png"),
      username: "Chris Taylor",
    },
    {
      id: "8",
      avatar: require("../../assets/images/story4.png"),
      username: "Olivia White",
    },
    {
      id: "9",
      avatar: require("../../assets/images/story3.png"),
      username: "Michael Black",
    },
    {
      id: "10",
      avatar: require("../../assets/images/story1.png"),
      username: "Sophia Grey",
    },
    {
      id: "11",
      avatar: require("../../assets/images/story2.png"),
      username: "David Green",
    },
  ];
  const handleBackPress = () => {
    navigation.navigate("message");
  };

  const renderSuggestedChatItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <View style={styles.header}>
          <View style={styles.actionContainer}>
            <View style={styles.actionItem}>
              <Ionicons name="people-outline" size={24} color="black" />
              <Text>Create a new group</Text>
            </View>
            <View style={styles.actionItem}>
              <Ionicons name="videocam-outline" size={24} color="black" />
              <Text>Create a new video call</Text>
            </View>
          </View>
          <View style={styles.suggestedContainer}>
            <Text style={styles.suggestedTitle}>Suggested</Text>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.chatItem}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.chatContent}>
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="ios-arrow-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>New Message</Text>
      </View>
      <View style={styles.recipientContainer}>
        <Text>To:</Text>
        <TextInput
          style={styles.recipientInput}
          placeholder="Type a name or group"
          placeholderTextColor="#A9A9A9"
        />
      </View>
      <FlatList
        data={suggestedChats}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderSuggestedChatItem}
        ListFooterComponent={<View style={styles.footer} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //     padding: 16,
  },
  header: {
    marginBottom: 20,
    marginHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  recipientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 16,
  },
  recipientInput: {
    marginLeft: 8,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  actionContainer: {
    marginBottom: 16,
    marginTop: 16,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  suggestedContainer: {
    flex: 1,
  },
  suggestedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    //     marginBottom: 8,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginHorizontal: 16,
  },
  chatContent: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  footer: {
    marginBottom: 20,
  },
});

export default NewMessage;
