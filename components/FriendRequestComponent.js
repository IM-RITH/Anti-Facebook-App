import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
const FriendRequestComponent = ({
  name,
  mutualFriends,
  age,
  avatar,
  onConfirm,
  onDelete,
}) => {
  return (
    <View style={styles.friendCard}>
      <Image source={{ uri: avatar }} style={styles.profileImage} />
      <View style={styles.friendInfo}>
        <View style={styles.friendInfoHeader}>
          <View>
            <Text style={styles.friendName}>{name}</Text>
            <Text style={styles.mutualFriends}>
              {mutualFriends} mutual friend(s)
            </Text>
          </View>
          <Text style={styles.friendAge}>{age}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  friendCard: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },
  friendInfo: {
    marginLeft: 16,
    flex: 1,
  },
  friendInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  friendName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mutualFriends: {
    fontSize: 14,
    color: "#65676b",
  },
  friendAge: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#65676b",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  confirmButton: {
    borderRadius: 4,
    backgroundColor: "#1877f2",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },

  confirmButtonText: {
    fontSize: 16,
    color: "white",
  },
  deleteButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e4e6eb",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#65676b",
  },
});

export default FriendRequestComponent;
