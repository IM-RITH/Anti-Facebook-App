import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  //   const [savedSearches, setSavedSearches] = useState([]);

  //   useEffect(() => {
  //     fetchSavedSearches();
  //   }, []);
  //   const fetchSavedSearches = async () => {
  //     try {
  //       await setupTokenRequest();
  //       const response = await TokenRequest.post("get_saved_search", {
  //         index: "0",
  //         count: "10",
  //       });
  //       console.log(response.data);
  //       if (response.data && response.data.data) {
  //         setSavedSearches(response.data.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching saved searches:", error);
  //     }
  //   };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("search_user", {
        keyword: searchQuery,
        index: "0",
        count: "10",
      });

      if (response && response.data && response.data.data) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddFriend = async (id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("set_request_friend", {
        user_id: id,
      });
      if (response.data.code === "1000") {
        // Friend request was successfully sent
        alert("Friend request sent successfully!");
      } else {
        alert("Failed to send friend request. Please try again.");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("An error occurred while sending the friend request.");
    }
  };

  // Render Item for the search results
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : require("../../assets/images/user_search.jpg")
        }
        style={styles.profileImage}
      />
      <Text style={styles.itemText}>{item.username}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddFriend(item.id)}
      >
        <Text style={styles.addButtonText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );

  // render for history search
  //   const renderSavedSearchItem = ({ item }) => (
  //     <View style={styles.savedSearchItem}>
  //       <Text style={styles.savedSearchText}>{item}</Text>
  //       {/* Modify this according to the actual property name */}
  //     </View>
  //   );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Users ..."
          placeholderTextColor="white"
          value={searchQuery}
          returnKeyType="search"
          onChangeText={setSearchQuery}
          autoCorrect={false}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* <Text style={styles.recentSearchText}>Recent</Text> */}
      {/* <FlatList
        data={savedSearches}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderSavedSearchItem}
      /> */}
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  searchBarContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#3887BE",
    borderRadius: 30,
    margin: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: "white",
  },
  list: {
    padding: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemText: {
    fontSize: 18,
  },
  recentSearchText: {
    marginLeft: 25,
    marginTop: 5,
    fontSize: 16,
    color: "grey",
  },
});

export default SearchScreen;
