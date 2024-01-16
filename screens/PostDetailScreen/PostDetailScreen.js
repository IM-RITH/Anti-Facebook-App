import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PostDetailScreen = ({ route }) => {
  const { postDetails } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: postDetails.author.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{postDetails.author.name}</Text>
        </View>
        <Text style={styles.postText}>{postDetails.described}</Text>
        {postDetails.image.map((img, index) => (
          <Image
            key={img.id}
            source={{ uri: img.url }}
            style={{
              width: Dimensions.get("window").width,
              minHeight: 300,
              aspectRatio: img.width && img.height ? img.width / img.height : 1,
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postText: {
    fontSize: 16,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});

export default PostDetailScreen;
