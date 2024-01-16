import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const MessageScreen = ({ navigation }) => {
  const [chats, setChats] = useState([
    {
      id: "1",
      avatar: require("../../assets/images/story2.png"),
      username: "Tocky Parker",
      lastMessage: "Okay fine",
    },
    {
      id: "2",
      avatar: require("../../assets/images/story3.png"),
      username: "John Doe",
      lastMessage: "How are you?",
    },
    {
      id: "3",
      avatar: require("../../assets/images/story4.png"),
      username: "Jane Smith",
      lastMessage: "Let's catch up later.",
    },
    {
      id: "4",
      avatar: require("../../assets/images/story1.png"),
      username: "Bob Johnson",
      lastMessage: "Sure thing!",
    },
    {
      id: "5",
      avatar: require("../../assets/images/story2.png"),
      username: "Alice Brown",
      lastMessage: "See you soon!",
    },
    {
      id: "6",
      avatar: require("../../assets/images/story3.png"),
      username: "Eva White",
      lastMessage: "What's up?",
    },
    {
      id: "7",
      avatar: require("../../assets/images/story2.png"),
      username: "Michael Black",
      lastMessage: "Doing well, thanks!",
    },
    {
      id: "8",
      avatar: require("../../assets/images/story1.png"),
      username: "Sophia Gray",
      lastMessage: "I'm busy right now.",
    },
    {
      id: "9",
      avatar: require("../../assets/images/story4.png"),
      username: "William Green",
      lastMessage: "Sure, let's talk later.",
    },
    {
      id: "10",
      avatar: require("../../assets/images/story1.png"),
      username: "Olivia Red",
      lastMessage: "Good to hear!",
    },
  ]);

  const story = [
    {
      id: "1",
      avatar: require("../../assets/images/story2.png"),
      username: "Lihou",
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
      avatar: require("../../assets/images/story2.png"),
      username: "Bob Johnson",
    },
    {
      id: "5",
      avatar: require("../../assets/images/story4.png"),
      username: "Alice Brown",
    },
    {
      id: "6",
      avatar: require("../../assets/images/story2.png"),
      username: "Eva White",
    },
    {
      id: "7",
      avatar: require("../../assets/images/story1.png"),
      username: "Michael Black",
    },
    {
      id: "8",
      avatar: require("../../assets/images/story3.png"),
      username: "Sophia Gray",
    },
    {
      id: "9",
      avatar: require("../../assets/images/story2.png"),
      username: "William Green",
    },
    {
      id: "10",
      avatar: require("../../assets/images/story1.png"),
      username: "Olivia Red",
    },
    {
      id: "11",
      avatar: require("../../assets/images/story1.png"),
      username: "Olivia Red",
    },
    {
      id: "12",
      avatar: require("../../assets/images/story1.png"),
      username: "Olivia Red",
    },
    {
      id: "13",
      avatar: require("../../assets/images/story1.png"),
      username: "Olivia Red",
    },
    {
      id: "14",
      avatar: require("../../assets/images/story1.png"),
      username: "Olivia Red",
    },
    {
      id: "15",
      avatar: require("../../assets/images/story1.png"),
      username: "Olivia Red",
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("chat", { userId: item.id })}
    >
      <View style={styles.chatItem}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.chatContent}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        <Text style={styles.time}>12:30 PM</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItemStory = ({ item, index }) => (
    <View style={styles.storyItem}>
      {index === 0 && (
        <View
          style={{
            paddingLeft: 16,
            paddingRight: 8,
            alignItems: "center",
          }}
        >
          <View style={styles.icon}>
            <MaterialCommunityIcons name="video" size={24} color="#0177F1" />
          </View>
          <Text
            style={styles.storyUsername}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.username}
          </Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate("chat", { userId: item.id })}
      >
        <View style={{ alignItems: "center" }}>
          <Image source={item.avatar} style={styles.storyImage} />
          <Text
            style={styles.storyUsername}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.username}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.headerImage}
          source={require("../../assets/images/story4.png")}
        />
        <Text style={styles.headerText}>Chats</Text>
        <View
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="camera-outline" size={24} color="black" />
          <TouchableOpacity onPress={() => navigation.navigate("newMessage")}>
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View style={styles.searchContainer}>
              <View style={styles.searchContent}>
                <Ionicons name="search" size={24} color="black" />
                <TextInput style={styles.textInput} placeholder="Search" />
              </View>
              <Text style={styles.unreadText}>Unread</Text>
            </View>
            <View style={styles.storyList}>
              <FlatList
                data={story}
                keyExtractor={(item) => item.id}
                renderItem={renderItemStory}
                horizontal
              />
            </View>
          </>
        )}
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    padding: 16,
  },
  headerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginRight: 16,
    backgroundColor: "#EEEEEE",
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#EEEEEE",
  },
  unreadText: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#EEEEEE",
    padding: 11,
    borderRadius: 8,
  },
  storyList: {
    // paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: "center",
    flexDirection: "row",

    marginRight: 8,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyUsername: {
    marginTop: 4,
    textAlign: "center",
    maxWidth: 40,
  },
  flatList: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  chatContent: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#888888",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  time: {
    color: "#888888",
    fontSize: 12,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default MessageScreen;
