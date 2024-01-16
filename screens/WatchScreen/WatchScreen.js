import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";
import { ModalEditAndReport, PostComponent } from "../../components";
import { ModalContext } from "../../hooks/useModalContext";
import { checkIfPostLiked } from "../../utils/checkIfPostLiked";
import { useFocusEffect } from "@react-navigation/native";

const WatchScreen = () => {
  const [activeTab, setActiveTab] = useState("ForYou");
  const [videos, setVideos] = useState([]);
  const [postIdEdit, setPostIdEdit] = useState("");
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState("");
  const [reportSubject, setReportSubject] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const { showModal, setPostId } = useContext(ModalContext);
  const [refreshing, setRefreshing] = useState(false);
  const [like, setLike] = useState(false);

  const renderTab = (tabName) => (
    <TouchableOpacity
      key={tabName}
      onPressIn={() => setActiveTab(tabName)}
      style={[
        styles.tabItem,
        activeTab === tabName ? styles.activeTabItem : null,
      ]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === tabName ? styles.activeTabText : null,
        ]}
      >
        {tabName}
      </Text>
    </TouchableOpacity>
  );
  const videoData = {
    ForYou: [
      {
        id: 1,
        title: "Amazing Nature Documentary",
        thumbnail:
          "https://www.achieveglobalsafaris.com/wp-content/uploads/2019/08/Webp.net-compress-image-54.jpg",
        view: "1.2M",
        likes: "950K",
        comments: "15K",
        shares: "5K",
        name: "World docs",
        profileImg: require("../../assets/images/naturedoc.jpg"),
        time: "3h ago",
      },
      {
        id: 2,
        title: "Daily Workout Routine",
        thumbnail:
          "https://cdn10.phillymag.com/wp-content/uploads/sites/3/2016/06/workout.jpg",
        view: "500K",
        likes: "300K",
        comments: "8K",
        shares: "2K",
        name: "Work Out 24",
        profileImg: require("../../assets/images/fitness.jpg"),
        time: "2h ago",
      },
    ],
    Live: [
      {
        id: 3,
        title: "City Life Stream",
        thumbnail:
          "https://th.bing.com/th/id/R.5c7d4f54bd2b1030853a49f576b01a27?rik=mkc0Xxl%2fE5qcOA&riu=http%3a%2f%2fstatic.asiawebdirect.com%2fm%2fbangkok%2fportals%2fvietnam%2fhomepage%2fhanoi%2ftop10%2fpagePropertiesImage%2fbest-of-hanoi.jpg.jpg&ehk=xeFgVjkYonqTObikk9dO%2f0TmZxV2PC9i0vvodeMSdCo%3d&risl=&pid=ImgRaw&r=0",
        view: "2.3M",
        likes: "1.2M",
        comments: "20K",
        shares: "10K",
        name: "City Life Style",
        profileImg: require("../../assets/images/city.jpg"),
        time: "LIVE",
      },
      {
        id: 4,
        title: "Live Music Concert",
        thumbnail:
          "https://th.bing.com/th/id/R.e2ff123c81217cbf19fd13443c22ccc9?rik=sxB9TJiz3liCpA&pid=ImgRaw&r=0",
        view: "800K",
        likes: "500K",
        comments: "12K",
        shares: "3K",
        name: "Let's Dance",
        profileImg: require("../../assets/images/concert.jpg"),
        time: "LIVE",
      },
      {
        id: 5,
        title: "Mobile Legends",
        thumbnail: "https://wallpaperset.com/w/full/c/7/2/235463.jpg",
        view: "5M",
        likes: "2.5M",
        comments: "30K",
        shares: "20K",
        name: "World docs",
        profileImg: require("../../assets/images/mbll.jpg"),
        time: "LIVE",
      },
    ],
    Music: [
      {
        id: 6,
        title: "Top Pop Hits 2023",
        thumbnail:
          "https://th.bing.com/th/id/R.5181468e18b222366df5949880849a3b?rik=eFmmeCDPBo28uA&pid=ImgRaw&r=0",
        view: "3M",
        likes: "2M",
        comments: "25K",
        shares: "15K",
        name: "Singing",
        profileImg: require("../../assets/images/man.jpg"),
        time: "10h ago",
      },
      {
        id: 7,
        title: "Classical Music Evening",
        thumbnail:
          "https://th.bing.com/th/id/R.7e8e83350b8f40f22217737f1a93147c?rik=01%2bJM7ChaWiEgw&pid=ImgRaw&r=0",
        view: "1M",
        likes: "700K",
        comments: "10K",
        shares: "4K",
        name: "Classic Music 24h",
        profileImg: require("../../assets/images/man.jpg"),
        time: "7h ago",
      },
    ],
    Gaming: [
      {
        id: 8,
        title: "Mobile Legends",
        thumbnail: "https://wallpaperset.com/w/full/c/7/2/235463.jpg",
        view: "4M",
        likes: "2.5M",
        comments: "30K",
        shares: "20K",
        name: "Zin II Gaming",
        profileImg: require("../../assets/images/man.jpg"),
        time: "4h ago",
      },
      {
        id: 9,
        title: "M5 World Champioonship 2023",
        thumbnail:
          "https://static.gosugamers.net/ac/7d/a1/8e34ee03cab7d984c486a296fc992c54ee62d0dc935f466d307126ac2c.jpg",
        view: "2M",
        likes: "1M",
        comments: "16K",
        shares: "8K",
        name: "Mobile Legends Official",
        profileImg: require("../../assets/images/mbllofficial.jpg"),
        time: "9h ago",
      },
    ],
  };
  const handleEditAndReport = (postId, userId) => {
    setUserId(userId);
    setPostIdEdit(postId);
    setEdit(!edit);
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      checkIfLiked();
    }, [])
  );
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await checkIfLiked();
      await fetchData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };
  const checkIfLiked = async () => {
    if (postIdEdit && userId) {
      const liked = await checkIfPostLiked(postIdEdit, userId);
      setLike(liked);
    }
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
  const fetchData = async () => {
    try {
      const response = await TokenRequest.post("/get_list_videos", {
        in_campaign: "1",
        campaign_id: "1",
        latitude: "1.0",
        longitude: "1.0",
        index: "0",
        count: "10",
      });

      if (response.data.code === "1000") {
        setVideos(response.data.data.post);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerText}>
        <Text style={{ fontSize: 25, fontWeight: 600 }}>Videos</Text>
      </View>
      <View style={styles.tabs}>
        {Object.keys(videoData).map((tabName) => renderTab(tabName))}
      </View>
      <FlatList
        style={styles.feed}
        data={videos}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#486be5"]}
          />
        }
        renderItem={({ item }) => (
          <PostComponent
            username={item.author.name}
            tagText="is with"
            tagUsername="Mashesh"
            time={item.created}
            location="Cambodia"
            postText={item.described}
            // images={item.image}
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
            liked={like}
          />
        )}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerText: {
    padding: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
  },
  tabItem: {
    padding: 10,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    color: "#aaa",
  },
  activeTabText: {
    color: "#000",
  },
  feed: {
    flex: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postInfo: {
    flex: 1,
    marginLeft: 10,
  },
  profileName: {
    fontWeight: "bold",
  },
  postTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  postTime: {
    marginLeft: 5,
    color: "#65676b",
  },
  followButton: {
    borderColor: "#1a77f2",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  followButtonText: {
    color: "#1a77f2",
    fontWeight: "bold",
  },
  optionsButton: {
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    // marginVertical: 8,
    // marginHorizontal: 16,
    // borderRadius: 8,
    borderTopColor: "#eee",
    borderTopWidth: 1,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  liveBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  liveBadge: {
    backgroundColor: "red",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 2,
  },
  liveText: {
    color: "white",
    fontSize: 12,
  },
  viewerCount: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 8,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  engagementStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  engagementText: {
    fontSize: 12,
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
export default WatchScreen;
