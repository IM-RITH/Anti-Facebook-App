import React, { useState } from "react";
import { Dimensions } from "react-native";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Get the full height of the device screen
// const screenHeight = Dimensions.get("window").height;

const PostProfileSection = ({
  username,
  time,
  caption,
  ImagePost,
  countLike,
  countComment,
  countShare,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(countLike);

  // function to handle like press
  const handleLikePress = () => {
    const newCount = isLiked ? likeCount - 1 : likeCount + 1; // Determine the new count.
    setLikeCount(newCount); // Set the new like count.
    setIsLiked(!isLiked); // Toggle the isLiked state.
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/man.jpg")}
          style={styles.profileImag}
        />

        <View style={styles.userInfo}>
          <View style={styles.name_updateIcon}>
            <Text style={styles.userName}>{username}</Text>
            <TouchableOpacity>
              <Ionicons
                name="ellipsis-horizontal"
                style={{ fontSize: 25, fontWeight: 500, left: 200 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.time_earth}>
            <Text style={styles.timePosted}>{time}</Text>
            <Ionicons name="earth-outline" style={styles.earth} />
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.postText}>{caption}</Text>
      </View>
      <View>
        <Image source={ImagePost} resizeMode="cover" style={styles.postImage} />
      </View>
      <View style={styles.reactions}>
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={handleLikePress}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            style={[styles.reactions, isLiked ? { color: "red" } : {}]}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" style={[styles.reactions]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="share-outline" style={[styles.reactions]} />
        </TouchableOpacity>
      </View>
      <View style={styles.reactionText}>
        <Text style={{ fontSize: 16 }}>{likeCount}</Text>
        <Text style={{ fontSize: 16 }}>{countComment} </Text>
        <Text style={{ fontSize: 16 }}>{countShare} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A1C0CD",
    bottom: 50,
  },
  header: { flexDirection: "row", alignItems: "center" },
  profileImag: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: "#3CA0C7",
    borderWidth: 1,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 15,
  },
  timePosted: {
    color: "grey",
  },
  postText: {
    marginVertical: 10,
    fontSize: 15,
  },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  reactions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    fontSize: 26,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  reactionText: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    bottom: 10,
    left: 5,
  },
  likecount: {
    left: 10,
  },
  time_earth: {
    flexDirection: "row",
    justifyContent: "space",
    bottom: 5,
  },
  earth: {
    color: "grey",
    fontSize: 15,
    marginLeft: 10,
    top: 1,
  },
  name_updateIcon: {
    flexDirection: "row",
  },
});

export default PostProfileSection;
