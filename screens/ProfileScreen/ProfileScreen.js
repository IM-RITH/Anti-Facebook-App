import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ModalEditAndReport, PostComponent } from "../../components";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import friendsData from "../../data/friendsData";
import photosData from "../../data/photoData";
import { useNavigation } from "@react-navigation/native";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";
import { ModalContext } from "../../hooks/useModalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import base64 from "base-64";
import { useFocusEffect } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { checkIfPostLiked } from "../../utils/checkIfPostLiked";
const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get("window").width;

const PostsScreen = ({ profileImage }) => {
  const [posts, setPosts] = useState([]);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const { showModal, setPostId } = useContext(ModalContext);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [postIdEdit, setPostIdEdit] = useState("");
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState("");
  const [reportSubject, setReportSubject] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [userTokenId, setUserTokenId] = useState(null);
  const [like, setLike] = useState(false);

  const route = useRoute();
  const onDelete = async (postId) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("/delete_post", {
        id: postId,
      });
      // Check if the deletion was successful based on the response data
      if (response.data && response.data.message === "OK") {
        setEdit(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const onReport = async (postId) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("/report_post", {
        id: postId,
        subject: reportSubject,
        details: reportDetails,
      });
      setEdit(false);
      // Clear the report subject and details after reporting
      setReportSubject("");
      setReportDetails("");
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchUserTokenId();
      checkIfLiked();
    }, [])
  );
  const checkIfLiked = async () => {
    if (postIdEdit && userId) {
      const liked = await checkIfPostLiked(postIdEdit, userId);
      setLike(liked);
    }
  };
  useEffect(() => {
    if (userTokenId) {
      fetchData();
      checkIfLiked();
      fetchUserAddress();
    }
  }, [userTokenId]);
  const fetchUserTokenId = async () => {
    try {
      const token = await SecureStore.getItemAsync("loginToken");

      if (!token) {
        console.error("Token not found.");
        return;
      }

      const trimmedToken = token.trim();
      const decodedToken = JSON.parse(
        base64.decode(trimmedToken.split(".")[1])
      );

      if (!decodedToken || !decodedToken.id) {
        console.error("Invalid or missing user ID in the decoded token.");
        return;
      }

      setUserTokenId(decodedToken.id);
    } catch (error) {
      console.error("Error fetching user ID from token:", error);
    }
  };
  const fetchData = async () => {
    try {
      const userId = await SecureStore.getItemAsync("id"); // Retrieve user_id from storage
      if (!userId) {
        console.error("User ID not found");
        return;
      }
      await setupTokenRequest();
      const response = await TokenRequest.post("get_list_posts", {
        user_id: userTokenId,
        in_campaign: "1",
        campaign_id: "1",
        latitude: "1.0",
        longitude: "1.0",
        index: "0",
        count: "100",
      });
      setPosts(response.data.data.post);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleEditAndReport = (postId, userId) => {
    setUserId(userId);
    setPostIdEdit(postId);
    setEdit(!edit);
  };
  // fetch user info(city, address, country,....)
  const fetchUserAddress = async (user_id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("get_user_info", {
        user_id: user_id,
      });
      setCity(response.data.data.city);
      setCountry(response.data.data.country);
      setAddress(response.data.data.address);
      setDescription(response.data.data.description);
      setLink(response.data.data.link);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await fetchUserAddress();
    setRefreshing(false);
  };

  return (
    <View style={styles.detailsContainer}>
      <View>
        <FlatList
          data={posts}
          keyExtractor={(post, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <>
              <View style={styles.detailItem}>
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={20}
                  color="#000"
                />
                <Text style={styles.detailText}>
                  Description <Text style={styles.boldText}>{description}</Text>
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={20} color="#000" />
                <Text style={styles.detailText}>
                  Lives in{" "}
                  <Text style={styles.boldText}>
                    {city ? city : "no city yet"}
                  </Text>
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="home-outline" size={20} color="#000" />
                <Text style={styles.detailText}>
                  From{" "}
                  <Text style={styles.boldText}>
                    {country ? country : "not yet has coutry"}
                  </Text>
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="map-outline" size={20} color="#000" />
                <Text style={styles.detailText}>
                  Address{" "}
                  <Text style={styles.boldText}>
                    {address ? address : "not yet has adress"}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity style={styles.detailItem}>
                <Ionicons
                  name="ellipsis-horizontal-outline"
                  size={20}
                  color="#000"
                />
                <Text style={styles.detailText}>See your About info</Text>
              </TouchableOpacity>
            </>
          }
          renderItem={({ item, index }) => (
            <PostComponent
              key={index}
              username={item.author.name}
              tagText="is with"
              tagUsername="Mashesh"
              time={item.created}
              location="Cambodia"
              postText={item.described}
              images={item.image}
              videos={item.video}
              profileImage={item.author.avatar}
              likes={parseInt(item.feel)}
              commentsCount={parseInt(item.comment_mark)}
              setPostId={setPostId}
              showModal={showModal}
              postId={item.id}
              userId={item.author.id}
              handleEditAndReport={handleEditAndReport}
              fetchData={fetchData}
              liked={like}
            />
          )}
        />
        <ModalEditAndReport
          editModalVisible={edit}
          setEdit={setEdit}
          onDelete={() => onDelete(postIdEdit)}
          onReport={() => onReport(postIdEdit)}
          reportSubject={reportSubject}
          setReportSubject={setReportSubject}
          reportDetails={reportDetails}
          setReportDetails={setReportDetails}
          postId={postIdEdit}
          edit={edit}
          userId={userId}
        />
      </View>
    </View>
  );
};
// Photo Tab
const columns = 3;
const { width } = Dimensions.get("window");
const photoSize = width / columns;
const PhotosScreen = () => (
  <View style={styles.container}>
    <Text style={styles.headerText}>Your photos</Text>
    <FlatList
      data={photosData}
      renderItem={({ item }) => (
        <Image style={styles.photo} source={item.uri} />
      )}
      keyExtractor={(item) => item.id}
      numColumns={columns}
    />
  </View>
);
// Friends Section
const numColums = 3;
const size = Dimensions.get("window").width / numColums;

const FriendScreen = () => {
  const [friendCount, setFriendCount] = useState(0);
  const [friends, setFriends] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    fetchFriends();
    fetchFriendCount();
  }, []);
  const fetchFriends = async () => {
    try {
      await setupTokenRequest();
      const userId = await SecureStore.getItemAsync("id"); // Retrieve user_id from storage
      if (!userId) {
        console.error("User ID not found");
        return;
      }
      const response = await TokenRequest.post("get_user_friends", {
        index: "0",
        count: "10",
        user_id: userId,
      });
      if (response.data.code === "1000") {
        setFriends(response.data.data.friends);
        setFriendCount(response.data.data.total);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFriends();
    await fetchFriendCount();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ProfileDetail", { UserIDInfo: item.id })
        }
      >
        <Image source={{ uri: item.avatar }} style={styles.image} />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
          {item.username}
        </Text>
      </TouchableOpacity>
    </View>
  );
  // render list of friends
  return (
    <View style={styles.container1}>
      <Text style={{ fontWeight: "600", fontSize: 16, left: 5 }}>
        Your Total Friend: {friendCount}
      </Text>
      <FlatList
        data={friends}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColums}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};
const Tabs = ({ profileImage }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Posts"
        children={() => <PostsScreen profileImage={profileImage} />}
      />
      <Tab.Screen name="Photos" component={PhotosScreen} />
      <Tab.Screen name="Friends" component={FriendScreen} />
    </Tab.Navigator>
  );
};

const ProfileScreen = ({ route }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [Name, setNewName] = useState("");
  // const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(true);

  const navigation = useNavigation();

  const loadProfileName = async () => {
    const storedName = await SecureStore.getItemAsync("username");
    if (storedName) {
      setNewName(storedName);
    }
  };
  const loadCoverImage = async () => {
    const imageUri = await SecureStore.getItemAsync("coverPhoto");
    if (imageUri) {
      setCoverImage(imageUri);
    }
  };
  const loadProfileImage = async () => {
    const imageUri = await AsyncStorage.getItem("profileImage");
    if (imageUri) {
      setProfileImage(imageUri);
    }
  };
  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      loadProfileImage();
      loadCoverImage();
      loadProfileName();

      // const profileID = route.params?.profileID;
      // const userId = await SecureStore.getItemAsync("id");
      // setIsCurrentUserProfile(userId == profileID);
    });
    return unsub;
  }, [navigation]);
  //handle Pick Profile Image
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
      setCoverImage(imageUri);
    }
  };

  const Header = ({
    pickProfileImage,
    pickCoverImage,
    profileImage,
    coverImage,
    // isCurrentUserProfile,
  }) => {
    const navigation = useNavigation();
    const [Name, setName] = useState("");
    const [coverPic, setCoverPic] = useState("");
    const [profilePic, setProfilePic] = useState("");

    const updateProfileImage = (newUri) => {
      setProfileImage(newUri);
    };

    useEffect(() => {
      getUserInfo();
    }, []);
    const getUserInfo = async (user_id) => {
      try {
        await setupTokenRequest();
        const response = await TokenRequest.post("get_user_info", {
          user_id: user_id,
        });
        setName(response.data.data.username);
        setCoverPic(response.data.data.cover_image);
        setProfilePic(response.data.data.avatar);
        // console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <View style={[styles.header]}>
        <View>
          <Image
            style={[styles.coverPhoto, { width: screenWidth }]}
            source={
              coverPic
                ? { uri: coverPic }
                : require("../../assets/images/post2.jpg")
            }
          />
          <TouchableOpacity
            style={styles.cameraIconCover}
            onPress={pickCoverImage}
          >
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          <Image
            style={styles.profilePhoto}
            source={
              profilePic
                ? { uri: profilePic }
                : require("../../assets/images/coverPic.jpg")
            }
          />
          <TouchableOpacity
            style={styles.cameraIconProfile}
            onPress={pickProfileImage}
          >
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{Name}</Text>
        <View style={styles.buttonContainer}>
          {/* {isCurrentUserProfile ? (
            <> */}
          <TouchableOpacity style={styles.button1}>
            <View style={styles.addStoryBtn}>
              <Ionicons name="add" color="white" />
              <Text style={styles.buttonText}>Add to Story</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() =>
              navigation.navigate("EditProfile", {
                updateProfileImage,
              })
            }
          >
            <View style={styles.EditPFBtn}>
              <Ionicons name="construct" color="white" style={{ right: 5 }} />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>
          {/* </> */}
          {/* ) : (
            <> */}
          {/* <TouchableOpacity style={styles.button1}>
            <Text style={styles.buttonText}>Add Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2}>
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity> */}
          {/* </> */}
          {/* )} */}
          {/* <TouchableOpacity style={styles.button3}>
            <View style={styles.ellipsisBtn}>
              <Ionicons name="ellipsis-horizontal" />
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Header
        pickProfileImage={pickProfileImage}
        pickCoverImage={pickCoverImage}
        profileImage={profileImage}
        coverImage={coverImage}
        // isCurrentUserProfile={isCurrentUserProfile}
      />
      <Tabs profileImage={profileImage} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    top: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: screenWidth,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  coverPhoto: {
    height: 200,
    resizeMode: "cover",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
    marginTop: -60,
  },
  cameraIconCover: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
  },
  cameraIconProfile: {
    position: "absolute",
    right: -1,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tabScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
    bottom: 10,
  },
  button1: {
    backgroundColor: "#E1E1E1",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#5993BD",
  },
  button2: {
    backgroundColor: "#E1E1E1",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#63AF51",
  },
  button3: {
    backgroundColor: "#E1E1E1",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  addStoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
  },
  EditPFBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
  },
  // Post section
  detailsContainer: {
    marginLeft: 5,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  detailText: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  deatils: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
  boldText: {
    fontWeight: "600",
  },
  //Photo Tab
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 10,
  },
  photo: {
    width: photoSize,
    height: photoSize,
    margin: 1,
  },
  // Friends Tab
  itemContainer: {
    width: size,
    height: size + 20,
    padding: 1,
    top: 10,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: size,
  },
  name: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 4,
  },
});

export default ProfileScreen;
