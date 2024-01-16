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

const Block = () => {
  const [blockfriends, setBlockFriends] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetctBlockFriends = async () => {
    try {
      const response = await TokenRequest.post("get_list_blocks", {
        index: "0",
        count: "20",
      });
      console.log(response.data);
      if (response && response.data && response.data.data) {
        setBlockFriends(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching block list:", error);
    }
  };
  useEffect(() => {
    fetctBlockFriends();
  }, []);
  const handleUnBlock = async (id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("unblock", {
        user_id: id,
      });
      console.log(response.data);
      if (response.data.code === "1000") {
        alert("Successfully unblock.");
      } else {
        alert("Failed to unblock. Please try again.");
      }
    } catch (error) {
      console.error("Error unblocking:", error);
      alert("An error occurred while attempting to unblock.");
    }
  };
  // refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetctBlockFriends();
    setRefreshing(false);
  };

  const FriendSuggestionItem = ({ name, avatarUri, onUnBlock }) => {
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
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={onUnBlock}>
            <Text style={styles.buttonText}>UnBlock</Text>
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
            fontSize: 22,
            color: "white",
          }}
        >
          Block List
        </Text>
      </View>
      <FlatList
        data={blockfriends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FriendSuggestionItem
            name={item.name}
            avatarUri={item.avatar}
            onUnBlock={() => handleUnBlock(item.id)}
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

export default Block;
