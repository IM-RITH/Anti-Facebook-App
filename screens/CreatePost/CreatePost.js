import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

const CreatePostScreen = () => {
  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState([]);
  const navigation = useNavigation();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 0,
    });

    if (!result.canceled && result.assets) {
      const imageUris = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...imageUris]);
    }

    // Open image picker for videos
    // let videoResult = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    //   allowsEditing: false, // Editing should typically be false for videos
    // });

    // if (!videoResult.canceled && videoResult.assets) {
    //   // Since only one video can be posted, set the video state to the selected video's URI
    //   const videoUri = videoResult.assets[0].uri;
    //   setVideo(videoUri);
    // }
  };
  // post api
  const postToAPI = async () => {
    const formData = new FormData();
    formData.append("described", postText);
    formData.append("status", "Hyped");
    formData.append("auto_accept", "1");
    if (images.length > 0) {
      images.forEach((img, index) => {
        formData.append(`image${index}`, {
          uri: img,
          type: "image/jpeg",
          name: `image${index}.jpg`,
        });
      });
    }
    // Similarly add video if you have a video state
    if (video) {
      formData.append("video", {
        uri: video,
        type: "video/mp4",
        name: "video.mp4",
      });
    }

    try {
      const token = await SecureStore.getItemAsync("loginToken");
      if (!token) {
        console.error("User token not found");
        return;
      }
      await setupTokenRequest();
      const response = await TokenRequest.post("add_post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        console.log("Post successful", response.data);
      }
    } catch (error) {
      console.error("Error posting to API", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("TabNavigator", "MenuScreen")}
        >
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={postToAPI}>
          <Text style={styles.nextButton}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>RITH</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        placeholderTextColor="#888"
        multiline
        value={postText}
        onChangeText={setPostText}
      />
      <View style={styles.imagePreviewContainer}>
        {images.map((img, index) => (
          <Image
            key={String(index)}
            source={{ uri: img }}
            style={styles.imagePreview}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Ionicons name="image" size={30} color="green" />
        <Text style={styles.photoButtonText}>Photo/Video</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  nextButton: {
    color: "#864AF9",
    fontSize: 18,
    fontWeight: "500",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    color: "white",
    fontSize: 18,
    left: 15,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    top: 10,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#F8F4EC",
    alignSelf: "center",
  },
  photoButtonText: {
    color: "#3E3232",
    fontWeight: "500",
    marginLeft: 10,
    fontSize: 18,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    padding: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});

export default CreatePostScreen;
