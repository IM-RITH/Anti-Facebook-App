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
import { Ionicons } from "@expo/vector-icons";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";

const SuggestionsScreen = () => {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSuggestedFriends = async () => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("get_suggested_friends", {
        index: "0",
        count: "20",
      });
      console.log(response.data);
      if (response && response.data && response.data.data) {
        setSuggestedFriends(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
    }
  };

  useEffect(() => {
    fetchSuggestedFriends();
  }, []);
  const handleAddFriend = async (id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("set_request_friend", {
        user_id: id,
      });
      if (response.data.code === "1000") {
        // Friend request was successfully sent
        alert("Friend request sent successfully!");
      } else {
        alert("Failed to send friend request. Please try again.");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("An error occurred while sending the friend request.");
    }
  };
  // refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSuggestedFriends();
    setRefreshing(false);
  };

  const handleRemoveFriend = (friendId) => {
    console.log("Remove friend:", friendId);
  };
  const FriendSuggestionItem = ({
    name,
    mutualFriends,
    avatarUri,
    onAddFriend,
    onRemove,
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
          <TouchableOpacity style={styles.addButton} onPress={onAddFriend}>
            <Text style={styles.buttonText}>Add friend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Text style={styles.buttonText}>Remove</Text>
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
            fontWeight: "700",
            padding: 10,
            fontSize: 24,
            color: "white",
          }}
        >
          People You May Know
        </Text>
      </View>
      <FlatList
        data={suggestedFriends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FriendSuggestionItem
            name={item.username}
            mutualFriends={item.same_friends}
            avatarUri={item.avatar}
            onAddFriend={() => handleAddFriend(item.id)}
            onRemove={() => handleRemoveFriend(item.id)}
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

export default SuggestionsScreen;
