import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FriendRequestComponent } from "../../components";

import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";

const FriendScreen = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchFriendRequests();
    fetchFriendCount();
  }, []);
  const fetchFriendRequests = async () => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("get_requested_friends", {
        index: "0",
        count: "10",
      });
      console.log(response.data);
      if (response.data.code === "1000") {
        setFriendRequests(response.data.data.requests);
        setFriendRequestCount(response.data.data.total);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  // fetch the number of friends
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

  // delete friend request
  const deleteFriendRequest = async (id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("del_request_friend", {
        user_id: id,
      });
      if (response.data.code === "1000") {
        console.log("Friend request deleted successfully.");
        // Filter out the deleted request from the state
        setFriendRequests((currentRequests) =>
          currentRequests.filter((request) => request.id !== id)
        );
      } else {
        console.log("Failed to delete friend request:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  // accept friends
  const acceptFriendRequest = async (id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("set_accept_friend", {
        user_id: id,
        is_accept: "1",
      });
      console.log(response.data);
      if (response.data.code === "1000") {
        console.log("Friend request accepted successfully.");
        // Remove the accepted request from the state
        setFriendRequests((currentRequests) =>
          currentRequests.filter((request) => request.id !== id)
        );
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriendRequests();
    await fetchFriendCount();
    setRefreshing(false);
  };

  return (
    <FlatList
      ListHeaderComponent={
        <>
          {/* <ScrollView showsHorizontalScrollIndicator={false} style={styles.container}> */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Friends</Text>
            {/* <Ionicons name="search" style={styles.searchIcon} /> */}
          </View>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionTitle}
              onPress={() => navigation.navigate("Suggest")}
            >
              <Text style={styles.sectionTitle}>Suggestions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sectionTitle}
              onPress={() => navigation.navigate("YourFriend")}
            >
              <Text style={styles.sectionSubtitle}>Your friend</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.yourFriendSection}>
            <View style={styles.friendCountContainer}>
              <Text style={styles.friendTitle}>New Friend Request:</Text>
              <Text style={styles.friendCount}>{friendRequestCount}</Text>
            </View>
            {/* <Text style={styles.seeAllText}>See all</Text> */}
          </View>
        </>
      }
      data={friendRequests}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const timeAgo = moment(item.created).fromNow();
        return (
          <FriendRequestComponent
            name={item.username}
            mutualFriends={item.same_friends}
            age={timeAgo}
            avatar={item.avatar}
            onConfirm={() => acceptFriendRequest(item.id)}
            onDelete={() => deleteFriendRequest(item.id)}
          />
        );
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  searchIcon: {
    fontSize: 28,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#1877f2",
    padding: 4,
    color: "white",
    borderRadius: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#1877f2",
    padding: 4,
    color: "white",
    borderRadius: 4,
  },
  yourFriendSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
    paddingBottom: 10,
  },
  friendCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  friendCount: {
    marginLeft: 8,
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 16,
    color: "#1877f2",
  },
});

export default FriendScreen;
