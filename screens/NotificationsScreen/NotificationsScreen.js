import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";

const NotificationScreen = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Notifications</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={styles.searchIcon}
      >
        <Ionicons name="ios-search" size={24} color="#fff" />
        <View style={styles.searchUser}>
          <Text style={{ fontWeight: "600", color: "white" }}>
            {" "}
            Search user...
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // fetch notification
  const fetchNotifications = async () => {
    try {
      setIsRefreshing(true);
      await setupTokenRequest();
      const response = await TokenRequest.post("get_notification", {
        index: "0",
        count: "10",
      });
      console.log(response.data);
      if (response && response.data && response.data.data) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  const onRefresh = useCallback(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationTitle = (item) => {
    switch (item.type) {
      case "1":
        return `${item.user.username} sent you a friend request.`;
      case "2":
        return `${item.user.username} confirmed you.`;
      case "3":
        return `${item.user.username} posted a new post.`;
      case "4":
        return `${item.user.username} shared your post.`;
      case "5":
        return `${item.user.username} liked your post.`;
      case "6":
        return `${item.user.username} commented on your post.`;
      default:
        return item.title;
    }
  };
  const navigateToFriendPage = (userId) => {
    navigation.navigate("Friends", { userId });
  };
  const onNotificationPress = (item) => {
    if (item.type === "1" || item.type === "2") {
      navigateToFriendPage(item.user.id);
    }
  };
  const renderNotificationItem = ({ item }) => {
    const notificationTitle = getNotificationTitle(item);
    return (
      <TouchableOpacity onPress={() => onNotificationPress(item)}>
        <View style={styles.notificationItem}>
          <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>{notificationTitle}</Text>
            <Text style={styles.notificationTime}>
              {moment(item.created).fromNow()}
            </Text>
          </View>
          <Ionicons
            name="ios-chevron-forward"
            size={20}
            color="#000"
            style={styles.chevronIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {renderHeader()}
      <FlatList
        data={notifications}
        keyExtractor={(item, index) =>
          item.notification_id.toString() || String(index)
        }
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#DCF2F1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3b5998",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  searchIcon: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "#1B4242",
    width: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "grey",
  },
  searchUser: {
    justifyContent: "center",
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: "#000",
  },
  notificationTime: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  chevronIcon: {
    padding: 5,
  },
  listContainer: {
    paddingBottom: 10,
  },
});

export default NotificationScreen;
