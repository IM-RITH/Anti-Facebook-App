import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";

const YourFriendScreen = () => {
  const [friends, setFriends] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetctFriends = async () => {
    try {
      await setupTokenRequest();
      const userId = await SecureStore.getItemAsync("id");
      if (!userId) {
        console.error("User ID not found");
        return;
      }
      const response = await TokenRequest.post("get_user_friends", {
        index: "0",
        count: "20",
        user_id: userId,
      });
      console.log(response.data);
      if (response && response.data && response.data.data) {
        setFriends(response.data.data.friends);
      }
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
  };
  const fetchFriendCount = async () => {
    try {
      const userId = await SecureStore.getItemAsync("id");
      if (!userId) {
        console.error("User ID not found");
        return;
      }
      await setupTokenRequest();
      const response = await TokenRequest.post("get_user_friends", {
        index: "0",
        count: "10",
        user_id: userId,
      });
      if (response.data.code === "1000") {
        setFriendCount(response.data.data.total);
      }
    } catch (error) {
      console.error("Error fetching friend count:", error);
    }
  };

  useEffect(() => {
    fetctFriends();
    fetchFriendCount();
  }, []);
  const handleUnFriend = async (id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("unfriend", {
        user_id: id,
      });
      if (response.data.code === "1000") {
        alert("Successfully unfriended.");
        // await fetctFriends();
      } else {
        alert("Failed to unfriend. Please try again.");
      }
    } catch (error) {
      console.error("Error unfriending:", error);
      alert("An error occurred while attempting to unfriend.");
    }
  };
  // refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetctFriends();
    await fetchFriendCount();
    setRefreshing(false);
  };

  const handleBlockFriend = async (id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("set_block", {
        user_id: id,
      });
      if (response.data.code === "1000") {
        alert("Successfully Block Friended.");
      } else {
        alert("Failed to block friend. Please try again.");
      }
    } catch (error) {
      console.error("Error blocking:", error);
      alert("An error occurred while attempting to block friend.");
    }
  };
  const FriendSuggestionItem = ({
    name,
    mutualFriends,
    avatarUri,
    onUnfriend,
    onBlock,
  }) => {
    return (
      <View style={styles.friendSuggestionItem}>
        <Image
          source={
            avatarUri
              ? { uri: avatarUri }
              : require("../../assets/images/user_search.jpg")
          }
          style={styles.avatar}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.mutualFriends}>
            {mutualFriends} mutual friends
          </Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={onUnfriend}>
            <Text style={styles.buttonText}>Unfriend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={onBlock}>
            <Text style={styles.buttonText}>Block</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textHeader}>
        <Text
          style={{
            fontWeight: "600",
            padding: 10,
            fontSize: 24,
            color: "white",
          }}
        >
          Your Total Friends:{" "}
          <Text style={{ color: "#FAEF5D" }}>{friendCount}</Text>
        </Text>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FriendSuggestionItem
            name={item.username}
            mutualFriends={item.same_friends}
            avatarUri={item.avatar}
            onUnfriend={() => handleUnFriend(item.id)}
            onBlock={() => handleBlockFriend(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  textHeader: {
    backgroundColor: "#365486",
  },
  friendSuggestionItem: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mutualFriends: {
    fontSize: 12,
    color: "gray",
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 6,
  },
  removeButton: {
    backgroundColor: "#F44336",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default YourFriendScreen;
