import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { TokenRequest, setupTokenRequest } from "../requestMethod";
import { useNavigation } from "@react-navigation/native";
import { CoinContext } from "../hooks/useCoinContext";
import playSound from "../sounds/playSound";
import * as SecureStore from "expo-secure-store";

const PostComponent = ({
  username,
  time,
  location,
  postText,
  images,
  profileImage,
  likes,
  commentsCount,
  tagUsername,
  tagText,
  videos,
  showModal,
  postId,
  setPostId,
  handleEditAndReport,
  userId,
  fetchData,
  liked,
  userTokenId,
}) => {
  const { setCoin } = useContext(CoinContext);
  const [reactionType, setReactionType] = useState(null);

  useEffect(() => {
    // Load liked status from SecureStore on component mount
    loadLikedStatus();
  }, []);

  useEffect(() => {
    // Update liked status when the 'liked' prop changes
    setReactionType(liked ? 1 : null);
  }, [liked]);

  const loadLikedStatus = async () => {
    try {
      const storedLikedStatus = await SecureStore.getItemAsync(
        `liked_${postId}`
      );

      if (storedLikedStatus) {
        setReactionType(parseInt(storedLikedStatus, 10));
      }
    } catch (error) {
      console.error("Error loading liked status:", error);
    }
  };

  const handleRemoveLike = async () => {
    try {
      const response = await TokenRequest.post("/delete_feel", {
        id: postId,
      });

      // Set the reaction type to null as the user has removed the like
      setReactionType(null);

      // Save updated liked status to SecureStore
      saveLikedStatus(null);
      fetchData();
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  const saveLikedStatus = async (type) => {
    try {
      // Save liked status to SecureStore
      await SecureStore.setItemAsync(
        `liked_${postId}`,
        type ? type.toString() : ""
      );
    } catch (error) {
      console.error("Error saving liked status:", error);
    }
  };
  const handleLikeClick = async () => {
    if (reactionType === 1) {
      // If the user has already liked the post, remove the like
      await handleRemoveLike();
      playSound();
    } else {
      // If the user hasn't liked the post, add the like and play music
      await handleReactionClick(1);
      playSound();
    }
  };
  const handleReactionClick = async (type) => {
    if (postId) {
      try {
        const response = await TokenRequest.post("/feel", {
          id: postId,
          type,
        });

        // Set the reaction type to the provided type
        setReactionType(type);

        // Save updated liked status to AsyncStorage
        saveLikedStatus(type);

        setCoin(response.data.coins);
        fetchData();
      } catch (error) {
        console.error("Error handling reaction:", error);
      }
    }
  };
  const handleCommentClick = () => {
    showModal();
    setPostId(postId);
  };

  const handleShareClick = () => {
    // Handle share click
  };
  const handleToProfile = async () => {
    if (userId != userTokenId) {
      navigation.navigate("ProfileDetail", { UserIDInfo: userId });
    } else {
      navigation.navigate("Profile");
    }
  };
  const video = React.useRef(null);
  const navigation = useNavigation();
  const [status, setStatus] = React.useState({});

  const remainingImagesCount =
    images && images.length > 4 ? images.length - 4 : 0;
  const formatPostTime = (timeDifferenceMinutes) => {
    if (timeDifferenceMinutes < 1) {
      return "Just now";
    } else if (timeDifferenceMinutes < 60) {
      return `${timeDifferenceMinutes}m ago`;
    } else if (timeDifferenceMinutes < 1440) {
      const hours = Math.floor(timeDifferenceMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(timeDifferenceMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const postDate = new Date(time);
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = currentDate - postDate;

  // Convert milliseconds to minutes
  const timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
  const handleImageClick = async (postId) => {
    try {
      const response = await TokenRequest.post("/get_post", {
        id: postId.toString(),
      });
      const postDetails = response.data.data;
      navigation.navigate("PostDetailScreen", { postDetails });
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  const renderImageItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleImageClick(postId)}
      style={{
        width: images?.length > 1 ? "50%" : "100%",
      }}
    >
      <Image source={{ uri: item.url }} style={styles.postImage} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleToProfile}>
          <Image
            source={
              profileImage && typeof profileImage === "string"
                ? { uri: profileImage }
                : null
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.username}>
            {username} <Text style={{ fontWeight: "normal" }}>{tagText} </Text>
            {tagUsername}
          </Text>
          <View style={styles.timeLocation}>
            <Text style={styles.time}>
              {formatPostTime(timeDifferenceMinutes)}
            </Text>
            <EvilIcons
              name="location"
              size={20}
              color="black"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleEditAndReport(postId, userId)}>
          <Ionicons
            name="ellipsis-vertical"
            style={styles.moreIcon}
            color="#333"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.postText}>{postText}</Text>
      {images && images.length > 0 ? (
        <View style={styles.imageContainer}>
          <FlatList
            data={images.slice(0, 4).reverse()}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
          {images.length > 4 && remainingImagesCount > 0 && (
            <Text style={styles.remainingImagesText}>
              +{remainingImagesCount}
            </Text>
          )}
        </View>
      ) : (
        videos && (
          <View style={styles.imageContainer}>
            <Video
              ref={video}
              style={{ width: "100%", height: 200 }}
              source={{
                uri: videos.url,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
            {/* <View style={styles.buttons}>
            <Button
              title={status.isPlaying ? "Pause" : "Play"}
              onPress={() =>
                status.isPlaying
                  ? video.current.pauseAsync()
                  : video.current.playAsync()
              }
            />
          </View> */}
          </View>
        )
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLikeClick}>
          <EvilIcons
            name="like"
            size={30}
            color={reactionType === 1 ? "blue" : "black"}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleDisappointClick}>
          <Ionicons
            name="sad-outline"
            size={25}
            color={reactionType === 0 ? "red" : "black"}
          />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleCommentClick}>
          <EvilIcons name="comment" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareClick}>
          <EvilIcons name="share-apple" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.likesComments}>
        <View style={styles.likeCommentIcons}>
          <EvilIcons name="like" size={20} color="black" />
          <Ionicons name="sad-outline" size={15} color="black" />
          <Text style={styles.likeText}>{likes} Likes</Text>
        </View>
        <Text style={styles.commentCount}>{commentsCount} Comments</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // margin: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",

    // padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16, // Increased font size
  },
  timeLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    marginRight: 5,
    color: "#888", // Lighter color for time
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    fontSize: 14, // Increased font size
    color: "#888", // Lighter color for location
  },
  moreIcon: {
    fontSize: 24,
  },
  postText: {
    // marginTop: 10,
    fontSize: 16,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  postImage: {
    // width: "100%",
    // height: 200,
    // resizeMode: "cover",
    height: 200,
    resizeMode: "cover",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  actionIcon: {
    fontSize: 24,
    color: "#333",
  },
  likesComments: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  likeCommentIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallIcon: {
    fontSize: 16,
    color: "#333",
    marginRight: 5,
  },
  likeText: {
    color: "#555",
    marginLeft: 2,
  },
  commentCount: {
    marginTop: 5,
    color: "#555",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    // marginBottom: 10,
  },
  remainingImagesText: {
    color: "#ffff",
    textAlign: "center",
    fontSize: 30,
    position: "absolute",
    right: 80,
    bottom: 80,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  commenterImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentTextContainer: {
    marginLeft: 10,
  },
  commenterName: {
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 16,
  },
  newCommentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
  },
  commentInput: {
    flex: 1,
    marginRight: 10,
  },
  closeModalButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeModalText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PostComponent;
