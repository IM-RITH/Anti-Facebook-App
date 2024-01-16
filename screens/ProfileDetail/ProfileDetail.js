import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons, Entypo, Fontisto } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ModalEditAndReport, PostComponent } from "../../components";
import * as ImagePicker from "expo-image-picker";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";
import { ModalContext } from "../../hooks/useModalContext";
import photosData from "../../data/photoData";
const Tab = createMaterialTopTabNavigator();
const screenWidth = Dimensions.get("window").width;
import * as SecureStore from "expo-secure-store";
import base64 from "base-64";
import { checkIfPostLiked } from "../../utils/checkIfPostLiked";

const Header = ({ UserInof, friend, userTokenId, setModalVisible }) => {
  const navigation = useNavigation();
  const [TextRequest, setTextRequest] = useState("");
  const isFriend = friend.some(
    (friendItem) => String(friendItem.id) === String(userTokenId)
  );
  useEffect(() => {
    if (!isFriend) {
      setTextRequest("Waiting Confirm");
    } else {
      setTextRequest("Add Friend");
    }
  }, [UserInof, isFriend]);
  const addFriend = async (user_id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("/set_request_friend", {
        user_id: user_id,
      });

      if (response.data && response.data.message === "OK") {
        setTextRequest("Waiting Confirm");
      } else {
        console.error("Failed to send friend request:", response.data);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleAddFriend = () => {
    addFriend(UserInof.id);
  };

  const unfriend = async (user_id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("/unfriend", {
        user_id: user_id,
      });

      if (response.data && response.data.message === "OK") {
        console.log("Unfriended successfully");
      } else {
        console.error("Failed to unfriend:", response.data);
      }
    } catch (error) {
      console.error("Error unfriending:", error);
    }
  };

  const handleUnfriend = () => {
    unfriend(UserInof.id);
  };

  const handleAddAndUnFriend = async () => {
    if (UserInof?.is_friend === "0") {
      handleAddFriend();
    } else {
      handleUnfriend();
    }
  };

  return (
    <View style={styles.header}>
      <Image
        style={[styles.coverPhoto, { width: screenWidth }]}
        source={
          UserInof?.cover_image
            ? { uri: UserInof.cover_image }
            : require("../../assets/images/post2.jpg")
        }
      />

      <Image
        style={styles.profilePhoto}
        source={
          UserInof?.avatar
            ? { uri: UserInof.avatar }
            : require("../../assets/images/post2.jpg")
        }
      />

      <View style={{ flexDirection: "row" }}>
        <Text style={styles.profileName}>{UserInof?.username}</Text>
        {UserInof?.online === "1" && (
          <Fontisto name="radio-btn-active" size={15} color="green" />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button1} onPress={handleAddAndUnFriend}>
          <View style={styles.addStoryBtn}>
            {isFriend ? (
              <>
                <Ionicons name="person-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Friend</Text>
              </>
            ) : (
              <>
                <Ionicons name="person-add-outline" size={20} color="white" />
                <Text style={styles.buttonText}>{TextRequest}</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => navigation.navigate("message")}
        >
          <View style={styles.EditPFBtn}>
            <Entypo name="message" size={20} color="white" />
            <Text style={styles.buttonText}>Message</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button3}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.ellipsisBtn}>
            <Ionicons name="ellipsis-horizontal" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PostsScreen = ({ UserInof }) => {
  const [posts, setPosts] = useState([]);
  const { showModal, setPostId } = useContext(ModalContext);
  const [postIdEdit, setPostIdEdit] = useState("");
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState("");
  const [reportSubject, setReportSubject] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [like, setLike] = useState(false);

  const onDelete = async (postId) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("/delete_post", { id: postId });

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

      console.log("Post reported successfully:", response.data);
      setEdit(false);
      setReportSubject("");
      setReportDetails("");
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };

  useEffect(() => {
    if (UserInof?.id) {
      fetchData();
      checkIfLiked();
    }
  }, [UserInof?.id]);
  const checkIfLiked = async () => {
    if (postIdEdit && userId) {
      const liked = await checkIfPostLiked(postIdEdit, userId);
      setLike(liked);
    }
  };
  const fetchData = async () => {
    try {
      const response = await TokenRequest.post("get_list_posts", {
        user_id: UserInof?.id,
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

  return (
    <View style={styles.detailsContainer}>
      <View>
        <FlatList
          data={posts}
          keyExtractor={(post, index) => index.toString()}
          ListHeaderComponent={
            <>
              <View style={styles.detailItem}>
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={20}
                  color="#000"
                />
                <Text style={styles.detailText}>
                  Description{" "}
                  <Text style={styles.boldText}>
                    {UserInof?.description
                      ? UserInof?.description
                      : "no description yet"}
                  </Text>
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={20} color="#000" />
                <Text style={styles.detailText}>
                  Lives in{" "}
                  <Text style={styles.boldText}>
                    {UserInof?.city ? UserInof?.city : "no city yet"}
                  </Text>
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="home-outline" size={20} color="#000" />
                <Text style={styles.detailText}>
                  From{" "}
                  <Text style={styles.boldText}>
                    {UserInof?.country
                      ? UserInof?.country
                      : "not yet has coutry"}
                  </Text>
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="map-outline" size={20} color="#000" />
                <Text style={styles.detailText}>
                  Address{" "}
                  <Text style={styles.boldText}>
                    {UserInof?.address
                      ? UserInof?.address
                      : "not yet has adress"}
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
const numColums = 3;
const size = Dimensions.get("window").width / numColums;
const FriendScreen = ({ friend }) => {
  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ProfileDetail", { UserIDInfo: item.id })
        }
      >
        <Image
          source={{ uri: item.avatar || undefined }}
          style={styles.image}
        />
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
          {item.username}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {friend && friend.length > 0 ? (
        <FlatList
          data={friend}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColums}
        />
      ) : (
        <Text>No friends available</Text>
      )}
    </View>
  );
};
// Photo Tab
const columns = 3;
const { width } = Dimensions.get("window");
const photoSize = width / columns;
const Tabs = ({ UserInof, friend }) => (
  <Tab.Navigator>
    <Tab.Screen
      name="Posts"
      children={() => <PostsScreen UserInof={UserInof} />}
    />
    <Tab.Screen name="Photos" component={PhotosScreen} />
    <Tab.Screen
      name="Friends"
      children={() => <FriendScreen friend={friend} />}
    />
  </Tab.Navigator>
);

const ProfileDetail = () => {
  const [UserInof, setUserInfo] = useState(null);
  const route = useRoute();
  const UserIDInfo = route.params?.UserIDInfo;
  const [friend, setFriend] = useState([]);
  const [userTokenId, setUserTokenId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    if (UserIDInfo) {
      fetchUserInfo();
      fetchUserFriend();
      fetchUserTokenId();
    }
  }, [UserIDInfo, modalVisible]);
  const isFriend = friend.some(
    (friendItem) => String(friendItem.id) === String(userTokenId)
  );
  const fetchUserInfo = async () => {
    try {
      const res = await TokenRequest.post("get_user_info", {
        user_id: UserIDInfo,
      });
      setUserInfo(res.data.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserFriend = async () => {
    try {
      const friendsResponse = await TokenRequest.post("/get_user_friends", {
        index: "0",
        count: "10",
        user_id: UserIDInfo,
      });
      setFriend(friendsResponse.data.data.friends);
    } catch (error) {
      console.error("Error fetching user friends:", error);
    }
  };
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
  const handleBlock = async () => {
    if (UserIDInfo) {
      try {
        const response = await TokenRequest.post("/set_block", {
          user_id: UserIDInfo,
        });
        if (response.data && response.data.message === "OK") {
          setModalVisible(false);
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    }
  };
  const handleUnfriend = async () => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("/unfriend", {
        user_id: UserIDInfo,
      });

      if (response.data && response.data.message === "OK") {
        console.log("Unfriended successfully");
        setModalVisible(false);
      } else {
        console.error("Failed to unfriend:", response.data);
      }
    } catch (error) {
      console.error("Error unfriending:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Header
        UserInof={UserInof}
        friend={friend}
        userTokenId={userTokenId}
        setModalVisible={setModalVisible}
      />
      <Tabs UserInof={UserInof} friend={friend} />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {isFriend && (
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={handleUnfriend}
              >
                <Text style={styles.textStyle}>Unfriend</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonDelete]}
              onPress={handleBlock}
            >
              <Text style={styles.textStyle}>Block</Text>
            </TouchableOpacity>
            {/* Close Button */}
            <TouchableOpacity
              style={[styles.button, styles.buttonClose, styles.closebtn]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#5993BD",
  },
  button2: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#63AF51",
  },
  button3: {
    backgroundColor: "#1877f2",
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    padding: 2,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  closebtn: {
    top: 10,
    width: 120,
    borderRadius: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonDelete: {
    backgroundColor: "#ff4d4d", // Red color for delete button
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    marginTop: 10,
  },
});

export default ProfileDetail;
