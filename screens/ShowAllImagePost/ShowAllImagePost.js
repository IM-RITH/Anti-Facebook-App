import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const ShowAllImagePost = ({ navigation }) => {
  const route = useRoute();
  const { itemImage: initialImages, isPostUpdate, isNewPost } = route.params;
  const [imageTexts, setImageTexts] = useState(initialImages.map(() => ""));
  const [itemImages, setItemImages] = useState(initialImages);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (route.params?.itemImage) {
      setItemImages(route.params.itemImage);
    }
  }, [route.params?.itemImage]);

  const handleTextInputChange = (index, text) => {
    setImageTexts((prevTexts) =>
      prevTexts.map((prevText, i) => (i === index ? text : prevText))
    );
  };
  const handleDeleteImage = (index) => {
    setItemImages((prevImages) => prevImages.filter((image, i) => i !== index));
    setImageTexts((prevTexts) => prevTexts.filter((text, i) => i !== index));
  };

  const handleNavigateBack = () => {
    const updatedImagesWithText = itemImages.map((image, index) => ({
      ...image,
      text: imageTexts[index],
    }));
    navigation.navigate("modal", {
      updatedImagesWithText,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleNavigateBack}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="#333"
              style={{ marginRight: 20 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit</Text>
        </View>
        <Text style={styles.headerText}>Done</Text>
      </View>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={itemImages}
        keyExtractor={(item, index) => item.uri}
        renderItem={({ item, index }) => (
          <View style={{ paddingHorizontal: 10, alignItems: "center" }}>
            <Image
              source={{ uri: item.uri }}
              style={{
                width: screenWidth,
                minHeight: 300,
                aspectRatio:
                  item.width && item.height ? item.width / item.height : 1,
              }}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter text for this image"
              value={imageTexts[index]}
              onChangeText={(text) => handleTextInputChange(index, text)}
            />

            <TouchableOpacity onPress={() => handleDeleteImage(index)}>
              <EvilIcons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  textInput: {
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // padding: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 0.5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ShowAllImagePost;
