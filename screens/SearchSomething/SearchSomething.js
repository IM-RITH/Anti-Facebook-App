import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { TokenRequest, setupTokenRequest } from "../../requestMethod";

const { width } = Dimensions.get("window");
const imageWidth = (width - 15) / 2;

const SearchSomethingScreen = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchSearchResults = async (id) => {
    try {
      await setupTokenRequest();
      const response = await TokenRequest.post("search", {
        keyword: searchQuery,
        user_id: id,
        index: "0",
        count: "20",
      });
      console.log(response.data);
      if (response && response.data && response.data.data) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    // fetchSearchResults();
    if (!searchQuery.trim()) {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  };

  const SearchResultItem = ({
    authorAvatar,
    authorName,
    description,
    likes,
    comments,
    images,
    created,
  }) => {
    const isValidImageUrl = (url) => {
      return typeof url === "string" && url.trim() !== "";
    };
    const renderImages = (images) => {
      if (images.length > 1) {
        return (
          <View style={styles.imageGrid}>
            {images.map((img) => {
              if (isValidImageUrl(img.url)) {
                return (
                  <Image
                    key={img.id}
                    source={{ uri: img.url }}
                    style={styles.gridImage}
                  />
                );
              }
              return null;
            })}
          </View>
        );
      } else if (images.length === 1) {
        return (
          <Image
            key={images[0].id}
            source={{ uri: images[0].url }}
            style={styles.singlePostImage}
          />
        );
      }
      return null;
    };

    return (
      <View style={styles.resultItem}>
        <View style={styles.header}>
          {isValidImageUrl(authorAvatar) && (
            <Image source={{ uri: authorAvatar }} style={styles.avatar} />
          )}

          <View style={styles.headerContent}>
            <View style={styles.headerContent1}>
              <Text style={styles.username}>{authorName}</Text>
              {/* <Text style={styles.create}>{created}</Text> */}
            </View>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
        <View style={styles.imageContainer}>{renderImages(images)}</View>
        <View style={styles.footer}>
          <View style={styles.reactionContainer}>
            <Ionicons name="heart-outline" size={24} color="gray" />
            <Text style={styles.likes}>{likes}</Text>
          </View>
          <View style={styles.reactionContainer}>
            <Ionicons name="chatbox-ellipses-outline" size={24} color="gray" />
            <Text style={styles.comments}>{comments}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search..."
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Ionicons name="ios-search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SearchResultItem
            authorAvatar={item.author.avatar}
            authorName={item.author.name}
            description={item.described}
            likes={item.feel}
            comments={item.mark_comment}
            images={item.image}
            // created={moment(item.created).fromNow()}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#365486",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  searchButton: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 21,
  },

  resultItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  headerContent: {
    marginLeft: 10,
  },
  headerContent1: {
    flexDirection: "row",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  create: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  imageContainer: {
    marginTop: 5,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  likes: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
  },
  comments: {
    fontSize: 12,
    color: "#888",
    marginLeft: 5,
  },
  reactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
  gridImage: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: 10,
  },
  singlePostImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
});

export default SearchSomethingScreen;
