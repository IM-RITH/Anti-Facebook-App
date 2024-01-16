import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TokenRequest } from "../requestMethod";
import { Video, ResizeMode } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import { CoinContext } from "../hooks/useCoinContext";

const ModalPostComponent = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [status, setStatus] = useState({});
  const video = useRef(null);
  const [text, setText] = useState("");
  const navigation = useNavigation();
  const route = useRoute();

  const [postDetails, setPostDetails] = useState(route.params?.postDetails);
  const [userWithNewPost, setUserWithNewPost] = useState(route.params?.user);
  const [isPostUpdate, setIsPostUpdate] = useState(
    route.params?.isPostUpdate || false
  );
  const [isNewPost, setIsNewPost] = useState(route.params?.isNewPost || false);
  const { setCoin } = useContext(CoinContext);
  useFocusEffect(
    React.useCallback(() => {
      setIsNewPost(route.params?.isNewPost || false);
      setIsPostUpdate(route.params?.isPostUpdate || false);
      setPostDetails(route.params?.postDetails);
      setUserWithNewPost(route.params?.user);
    }, [])
  );
  useEffect(() => {
    setText(postDetails?.described || "");

    if (postDetails) {
      const imagesWithIdAndUri = postDetails.image.map(({ id, url }) => ({
        id,
        uri: url,
      }));
      setSelectedImages(imagesWithIdAndUri || []);
    }

    if (postDetails?.video && postDetails.video.url) {
      const videoUri = postDetails.video.url;
      setSelectedVideo({ uri: videoUri });
    }
  }, []);

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("described", text);

      selectedImages.forEach((image, index) => {
        formData.append(`image`, {
          uri: image.uri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });

      if (selectedVideo) {
        formData.append("video", {
          uri: selectedVideo.uri,
          type: "video/mp4",
          name: "demo.mp4",
        });
      }

      const response = await TokenRequest.post("/add_post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.message === "OK") {
        console.log("Post successful");
        setCoin(response.data.data.coins);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("id", String(postDetails.id));
      formData.append("described", text);

      // Check for images to delete
      const imagesToDeleteIds = postDetails.image
        .filter(
          (image) =>
            !selectedImages.find(
              (selectedImage) => selectedImage.uri === image.url
            )
        )
        .map((image) => image.id);

      if (imagesToDeleteIds.length > 0) {
        formData.append("image_del", imagesToDeleteIds.join(","));
      }

      // Handle the case when the video is replaced with an image
      if (selectedVideo && !selectedVideo.id) {
        // Append the new video
        formData.append("video", {
          uri: selectedVideo.uri,
          type: "video/mp4",
          name: "demo.mp4",
        });

        // Append the new image
        selectedImages.forEach((image, index) => {
          formData.append(`image`, {
            uri: image.uri,
            type: "image/jpeg",
            name: `image_${index}.jpg`,
          });
        });
      } else {
        // Handle the case when the video is not replaced with an image
        selectedImages.forEach((image, index) => {
          // Check if the image is already present in formData
          const isImageAlreadyAdded = postDetails.image.some(
            (existingImage) => existingImage.url === image.uri
          );

          if (!isImageAlreadyAdded) {
            // Append the image to formData only if it's not already present
            formData.append(`image`, {
              uri: image.uri,
              type: "image/jpeg",
              name: `image_${index}.jpg`,
            });
          }
        });
      }
      const response = await TokenRequest.post("/edit_post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.message === "OK") {
        console.log("Post update successful");
        setCoin(response.data.data.coins);

        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error updating post:", error.response?.data || error);
    }
  };

  const removeVideo = () => {
    setSelectedVideo(null);
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const images = result.assets.filter((media) => media.type === "image");
      const video = result.assets.find((media) => media.type === "video");

      setSelectedImages([...selectedImages, ...images]);
      setSelectedVideo(video || null);
    }
  };
  const renderMediaItem = ({ item }) => {
    const containerStyle = {
      width: selectedImages.length === 1 ? "100%" : "50%",
      marginBottom: 10,
    };
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("showall", {
            itemImage: selectedImages,
            isPostUpdate: true,
            isNewPost: true,
          });
        }}
        style={containerStyle}
      >
        <Image source={{ uri: item.uri }} style={styles.postMedia} />
      </TouchableOpacity>
    );
  };

  const remainingImagesCount = selectedImages.length - (showAllImages ? 0 : 4);
  const handleBack = () => {
    navigation.navigate("Home");
  };

  useEffect(() => {
    if (route.params?.updatedImagesWithText) {
      const updatedImagesWithText = route.params.updatedImagesWithText;
      const updatedImages = updatedImagesWithText.map((item) => ({
        uri: item.uri,
        width: item.width,
        height: item.height,
      }));
      const updatedTexts = updatedImagesWithText.map((item) => item.text);
      setSelectedImages(updatedImages);
      // setText(updatedTexts.join("\n"));
    }
  }, [route.params?.updatedImagesWithText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        {isNewPost && <Text style={styles.modalHeaderText}>Create Post</Text>}
        {isPostUpdate && <Text style={styles.modalHeaderText}>Edit Post</Text>}

        {isNewPost && (
          <TouchableOpacity onPress={handlePost} style={styles.postButton}>
            <Text style={{ color: "#1877f2" }}>Post</Text>
          </TouchableOpacity>
        )}
        {isPostUpdate && (
          <TouchableOpacity onPress={handleUpdate} style={styles.postButton}>
            <Text style={{ color: "#1877f2" }}>Update</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal content */}
      <View style={styles.modalContent}>
        <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
          <View style={styles.userInfoContainer}>
            {postDetails ? (
              <Image
                source={{ uri: postDetails.author.avatar }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={{ uri: userWithNewPost?.avatar }}
                style={styles.profileImage}
              />
            )}
            {postDetails ? (
              <View>
                <Text style={styles.userName}>{postDetails.author.name}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="earth-outline" size={15} color="black" />
                  <EvilIcons name="location" size={20} color="black" />
                  <Text style={styles.locationText}>Cambodia</Text>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.userName}>{userWithNewPost?.username}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="earth-outline" size={15} color="black" />
                  <EvilIcons name="location" size={20} color="black" />
                  <Text style={styles.locationText}>Cambodia</Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <TextInput
          placeholder="What's on your mind?"
          multiline={true}
          style={styles.postInput}
          value={text}
          onChangeText={(newText) => setText(newText)}
        />

        {selectedVideo ? (
          <>
            <Video
              ref={video}
              style={styles.postMedia}
              source={{ uri: selectedVideo.uri }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onPlaybackStatusUpdate={(status) => setStatus(status)}
            />
            {postDetails && (
              <View style={styles.videoControls}>
                <TouchableOpacity
                  onPress={removeVideo}
                  style={styles.removeVideoButton}
                >
                  <EvilIcons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.imageContainer}>
            <FlatList
              data={selectedImages.slice(0, 4).reverse()}
              renderItem={renderMediaItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />

            {selectedImages.length > 4 &&
              remainingImagesCount > 0 &&
              !showAllImages && (
                <Text style={styles.remainingImagesText}>
                  +{remainingImagesCount}
                </Text>
              )}
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <EvilIcons name="image" size={24} color="purple" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="people-outline" size={24} color="orange" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="happy-outline" size={24} color="pink" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <EvilIcons name="location" size={24} color="brown" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  postButton: {
    padding: 10,
  },
  modalContent: {
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 5,
  },
  postInput: {
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  postMedia: {
    height: 200,
    resizeMode: "cover",
  },
  remainingImagesText: {
    color: "#ffff",
    textAlign: "center",
    fontSize: 30,
    position: "absolute",
    right: 80,
    bottom: 80,
  },
  videoControls: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButton: {
    alignItems: "center",
  },
  removeVideoButton: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default ModalPostComponent;
