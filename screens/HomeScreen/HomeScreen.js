import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ModalEditAndReport, PostComponent } from "../../components";
import { ModalContext } from "../../hooks/useModalContext";
import { useNavigation } from "@react-navigation/native";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import base64 from "base-64";
import { checkIfPostLiked } from "../../utils/checkIfPostLiked";
const imageSources = [
  require("../../assets/images/story1.png"),
  require("../../assets/images/story2.png"),
  require("../../assets/images/story3.png"),
  require("../../assets/images/story4.png"),
];

const reelItemStyles = [
  {
    backgroundColor: "#fef9e7",
    icon: "videocam",
    text: "Reels",
    textColor: "#f9c50f",
  },
  {
    backgroundColor: "#ecf9ec",
    icon: "tv",
    text: "Room",
    textColor: "#44c041",
  },
  {
    backgroundColor: "#feeee5",
    icon: "people",
    text: "Group",
    textColor: "#f85900",
  },
  {
    backgroundColor: "#edf0fc",
    icon: "videocam",
    text: "Live",
    textColor: "#486be5",
  },
];

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [postIdEdit, setPostIdEdit] = useState("");
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [reportSubject, setReportSubject] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const navigation = useNavigation();
  const { showModal, setPostId } = useContext(ModalContext);
  const [userTokenId, setUserTokenId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [like, setLike] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      fetchUserTokenId();
      fetchDataUser(userTokenId);
      checkIfLiked();
    }, [userTokenId])
  );

  const checkIfLiked = async () => {
    if (postIdEdit && userId) {
      const liked = await checkIfPostLiked(postIdEdit, userId);
      setLike(liked);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
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

  const fetchDataUser = async (userId) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("/get_user_info", {
        user_id: userId,
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("get_list_posts", {
        in_campaign: "1",
        campaign_id: "1",
        latitude: "1.0",
        longitude: "1.0",
        index: "0",
        count: "10",
      });
      setPosts(response.data.data.post);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleStatusUpdatePress = () => {
    navigation.navigate("modal", { isNewPost: true, user });
  };

  const handleEditAndReport = (postId, userId) => {
    setUserId(userId);
    setPostIdEdit(postId);
    setEdit(!edit);
  };

  const onDelete = async (postId) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("/delete_post", {
        id: postId,
      });

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
  const onBlock = async (userId) => {
    if (userId) {
      try {
        const response = await TokenRequest.post("/set_block", {
          user_id: userId,
        });
        if (response.data && response.data.message === "OK") {
          console.log(response.data);
          setEdit(false);
          fetchData();
        }
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostComponent
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
            showModal={showModal}
            postId={item.id}
            setPostId={setPostId}
            userId={item.author.id}
            handleEditAndReport={handleEditAndReport}
            fetchData={fetchData}
            userTokenId={userTokenId}
            liked={like}
          />
        )}
        ListHeaderComponent={
          <>
            <Header
              onStatusUpdatePress={handleStatusUpdatePress}
              username={user?.username}
              avatar={user?.avatar}
            />
            <Reels />
            <ImageIcons />
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#486be5"]}
          />
        }
      />
      {/* Modal */}
      <ModalEditAndReport
        editModalVisible={edit}
        setEdit={setEdit}
        onDelete={() => onDelete(postIdEdit)}
        onReport={() => onReport(postIdEdit)}
        onBlock={() => onBlock(userId)}
        reportSubject={reportSubject}
        setReportSubject={setReportSubject}
        reportDetails={reportDetails}
        setReportDetails={setReportDetails}
        postId={postIdEdit}
        edit={edit}
        userId={userId}
      />
    </View>
  );
};
const Header = ({ onStatusUpdatePress, username, avatar }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Image style={styles.imagelogo} source={{ uri: avatar }} />
      <TouchableOpacity
        style={styles.statusUpdate}
        onPress={onStatusUpdatePress}
      >
        <Text style={styles.statusText}>
          {`What's on your mind, ${username}?`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={styles.searchButton}
      >
        <Ionicons name="search" size={25} color="#686868" />
      </TouchableOpacity>
    </View>
  );
};

const Reels = () => (
  <View style={styles.reelContainer}>
    {reelItemStyles.map((item, index) => (
      <TouchableOpacity key={index} style={styles.reelItemContainer}>
        <View
          style={[
            styles.reelItem,
            {
              backgroundColor: item.backgroundColor,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            },
          ]}
        >
          <Ionicons name={item.icon} size={25} color={item.textColor} />
          <Text style={{ color: item.textColor }}>{item.text}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);
const ImageIcons = () => (
  <View style={styles.imageIconContainer}>
    <FlatList
      data={imageSources}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.imageIconItem}>
          <Image source={item} style={styles.imageIcon} />
          {index === 0 ? (
            <Ionicons
              name="add-circle-sharp"
              size={25}
              color="blue"
              style={styles.addIcon}
            />
          ) : (
            <View style={styles.profileIcon}>
              <Image
                style={styles.profileImage}
                source={require("../../assets/images/ProfileImage.png")}
              />
              <Text style={styles.profileName}>lihou</Text>
            </View>
          )}
        </View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  statusUpdate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 35,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: "#f7f7f7",
  },
  statusText: {
    flex: 1,
    padding: 5,
    color: "gray",
    textAlign: "center",
  },
  searchButton: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
  },
  imagelogo: {
    width: 63,
    height: 63,
    borderRadius: 100,
  },
  reelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    gap: 3,
  },
  reelItemContainer: {
    alignItems: "center",
  },
  reelItem: {
    alignItems: "center",
    paddingTop: 5,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
    borderRadius: 15,
  },
  imageIconContainer: {
    padding: 10,
  },
  imageIconItem: {
    alignItems: "center",
    paddingRight: 10,
    paddingBottom: 10,
  },
  imageIcon: {
    width: 100,
    height: 150,
    resizeMode: "cover",
    borderRadius: 15,
  },
  addIcon: {
    bottom: 15,
  },
  profileIcon: {
    alignItems: "center",
    bottom: 15,
  },
  profileImage: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "blue",
  },
  profileName: {
    fontFamily: "Regular",
  },
  modalContainer: {
    backgroundColor: "red",
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  commentInput: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
  },
  closeModalButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
  },
  closeModalText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default HomeScreen;
