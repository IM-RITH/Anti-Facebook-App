import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";

const EditProfileScreen = ({ route, navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilPic, setProfilePic] = useState("");
  const [coverPic, setCoverPic] = useState("");
  const [Name, setName] = useState("");
  const [uploadProfile, setUploadProfile] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [userLink, setUserLink] = useState("");
  const [description1, setDescription1] = useState("");
  const [userAddress1, setUserAddress1] = useState("");
  const [userCity1, setUserCity1] = useState("");
  const [userCountry1, setUserCountry1] = useState("");
  const [userLink1, setUserLink1] = useState("");

  useEffect(() => {
    fetchUserAddress();
  }, []);
  // fetch user info(city, address, country,....)
  const fetchUserAddress = async (user_id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("get_user_info", {
        user_id: user_id,
      });
      setDescription1(response.data.data.description);
      setUserCity1(response.data.data.city);
      setUserCountry1(response.data.data.country);
      setUserAddress1(response.data.data.address);
      setUserLink1(response.data.data.country);
      setProfilePic(response.data.data.avatar);
      setCoverPic(response.data.data.cover_image);
      setName(response.data.data.username);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // handle Pick Profile Image
  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      uploadProfileImage(imageUri);
    }
  };
  // handle Pick cover Image
  const pickCoverImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setCoverPhoto(imageUri);
      uploadCoverImage(imageUri);
    }
  };

  const ProfilePicture = ({ onAddPressPro, imageUriPro }) => {
    return (
      <View style={styles.profilePictureSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddPressPro}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <Image
          style={styles.profileImage}
          source={
            profilPic
              ? { uri: profilPic }
              : require("../../assets/images/post2.jpg")
          }
        />
      </View>
    );
  };

  const CoverPhoto = ({ onAddPress, imageUri }) => {
    return (
      <View style={styles.coverPhotoSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cover photo</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.coverPhotoPlaceholder}>
          <Image
            source={
              coverPic
                ? { uri: coverPic }
                : require("../../assets/images/post2.jpg")
            }
            style={styles.coverPhoto}
          />
        </View>
      </View>
    );
  };

  // upload profile
  const uploadProfileImage = async (imageUri) => {
    const formData = new FormData();
    formData.append("username", "username");
    formData.append("avatar", {
      uri: imageUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    });

    try {
      await setupTokenRequest();
      const response = await TokenRequest.post(
        "change_profile_after_signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        await SecureStore.setItemAsync("profileImage", imageUri);
        Alert.alert("Success", "Profile image updated successfully.");
        setProfilePic(imageUri);
      } else {
        // console.log("API response:", response.data);
        Alert.alert("Failed", "Failed to update profile image.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An error occurred while updating the profile image."
      );
    }
  };

  // cover
  const uploadCoverImage = async (imageUri) => {
    const formData = new FormData();
    formData.append("cover_image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "cover.jpg",
    });

    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("set_user_info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        await SecureStore.setItemAsync("coverPhoto", imageUri);
        Alert.alert("Success", "Cover image updated successfully.");
        // handleImageUploadeSuccess(imageUri);
        setCoverPhoto(imageUri);
        navigation.goBack();
      } else {
        // console.log("API response:", response.data);
        Alert.alert("Failed", "Failed to update cover image.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while updating the cover image.");
    }
  };

  // Function to handle the name change
  const changeName = async () => {
    setModalVisible(false);

    const formData = new FormData();
    formData.append("username", newName);
    formData.append("description", description);
    formData.append("address", userAddress);
    formData.append("city", userCity);
    formData.append("country", userCountry);
    // formData.append("cover_image", coverImage); // Add file handling for cover image if needed
    formData.append("link", userLink);
    try {
      const response = await TokenRequest.post("set_user_info", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data) {
        // await SecureStore.setItemAsync("username", newName);
        Alert.alert("Success", "User info updated successfully");
        navigation.goBack();
        setName(newName);
        setDescription(response.data.data.description);
        setUserAddress(response.data.data.address);
        setUserCity(response.data.data.city);
        setUserCountry(response.data.data.country);
        setUserLink(response.data.data.link);
      } else {
        Alert.alert("Update Failed", "Could not update name");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while updating the name");
    }
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const renderChangeNameModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Enter new name"
            placeholderTextColor="#6DA4AA"
            style={styles.textInput}
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            placeholder="Enter Description"
            placeholderTextColor="#6DA4AA"
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            placeholder="Enter Address"
            placeholderTextColor="#6DA4AA"
            style={styles.textInput}
            value={userAddress}
            onChangeText={setUserAddress}
          />
          <TextInput
            placeholder="Enter City"
            placeholderTextColor="#6DA4AA"
            style={styles.textInput}
            value={userCity}
            onChangeText={setUserCity}
          />
          <TextInput
            placeholder="Enter Country"
            placeholderTextColor="#6DA4AA"
            style={styles.textInput}
            value={setUserCountry}
            onChangeText={setUserCountry}
          />
          <TouchableOpacity style={styles.changeNameBtn} onPress={changeName}>
            <Text
              style={{ fontWeight: "600", textAlign: "center", color: "white" }}
            >
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonClose} onPress={closeModal}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
          {/* Submit button and other content */}
        </View>
      </View>
    </Modal>
  );
  const ProfileDetails = () => {
    return (
      <View style={styles.detailsSection}>
        <View style={styles.sectionHeader1}>
          <Text style={styles.DetailTitle}>Change Info</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailsContent}>
          {/* Render details  */}
          <DetailItem iconName="person-circle" label="Username" value={Name} />
          <DetailItem
            iconName="chatbox-ellipses"
            label="Description"
            value={description1}
          />
          <DetailItem iconName="map" label="Address" value={userAddress1} />
          <DetailItem iconName="location" label="City" value={userCity1} />
          <DetailItem iconName="home" label="Country" value={userCountry1} />
        </View>
      </View>
    );
  };

  const Separator = () => <View style={styles.separator} />;
  const DetailItem = ({ label, value, iconName }) => (
    <View style={styles.detailItem}>
      <Ionicons
        name={iconName}
        size={20}
        color="#aaa"
        style={styles.detailIcon}
      />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
  return (
    <ScrollView style={styles.container}>
      <ProfilePicture
        onAddPressPro={pickProfileImage}
        imageUriPro={profileImage}
      />
      <Separator />
      <CoverPhoto onAddPress={pickCoverImage} imageUri={coverPhoto} />
      <Separator />
      {renderChangeNameModal()}
      <ProfileDetails />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D3F40",
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
  },
  profilePictureSection: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: "center",
  },
  coverPhotoPlaceholder: {
    backgroundColor: "#333",
    width: "90%",
    height: 200,
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  detailsSection: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  sectionHeader1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  DetailTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 4,
    position: "absolute",
    right: 10,
    top: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  detailsContent: {
    marginTop: 20,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  detailLabel: {
    color: "#aaa",
    fontSize: 16,
    left: 5,
  },
  detailValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    left: 10,
  },
  separator: {
    borderBottomColor: "#676C6D",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    paddingVertical: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    color: "#E5E1DA",
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    marginBottom: 20,
    width: "100%",
    textAlign: "justify",
    fontSize: 18,
  },

  buttonClose: {
    backgroundColor: "#2196F3",
    width: 250,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  changeNameBtn: {
    backgroundColor: "#2196F3",
    width: 250,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
});

export default EditProfileScreen;
