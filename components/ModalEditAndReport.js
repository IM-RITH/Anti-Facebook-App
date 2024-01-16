import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TokenRequest, setupTokenRequest } from "../requestMethod";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import base64 from "base-64";

const ModalEditAndReport = ({
  editModalVisible,
  setEdit,
  onDelete,
  onReport,
  reportSubject,
  setReportSubject,
  reportDetails,
  setReportDetails,
  postId,
  edit,
  userId,
  onBlock,
}) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [userTokenId, setUserTokenId] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchPostDetails = async () => {
      await setupTokenRequest();
      try {
        const response = await TokenRequest.post("/get_post", {
          id: postId,
        });
        const fetchedPostDetails = response.data.data;
        setPostDetails(fetchedPostDetails);
      } catch (error) {
        console.error("Error fetching post details:", error);
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

    if (postId) {
      fetchPostDetails();
      fetchUserTokenId();
    }
  }, [postId]);

  const handleEditPress = () => {
    navigation.navigate("modal", { postDetails, isPostUpdate: true });
    setEdit(false);
  };

  const handleReportPress = () => {
    setShowReportForm(!showReportForm);
  };
  const handleBackPress = () => {
    setShowReportForm(false);
  };
  const renderReportForm = () => {
    if (showReportForm) {
      return (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={reportSubject}
            onChangeText={(text) => setReportSubject(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Details"
            multiline
            value={reportDetails}
            onChangeText={(text) => setReportDetails(text)}
          />
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity
              style={{ ...styles.submitReportButton, backgroundColor: "blue" }}
              onPress={handleBackPress}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitReportButton}
              onPress={onReport}
            >
              <Text style={styles.buttonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal visible={editModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        {!showReportForm && (
          <>
            {String(userTokenId) === String(userId) ? (
              // User is the owner of the post
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleEditPress}
                >
                  <Text style={styles.buttonText}>Edit Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={onDelete}
                >
                  <Text style={[styles.buttonText, styles.deleteButtonText]}>
                    Delete Post
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              // User is not the owner of the post
              <>
                <TouchableOpacity
                  style={[styles.button, styles.reportButton]}
                  onPress={handleReportPress}
                >
                  <Text style={[styles.buttonText, styles.reportButtonText]}>
                    Report Post
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.reportButton]}
                  onPress={onBlock}
                >
                  <Text style={[styles.buttonText, styles.reportButtonText]}>
                    Block
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {renderReportForm()}

        {!showReportForm && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setEdit(!edit)}
          >
            <Ionicons name="close-circle-outline" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  button: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#3498db",
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportButton: {
    backgroundColor: "#e74c3c",
    alignItems: "center",
  },
  reportButtonText: {
    color: "#fff",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  deleteButtonText: {
    color: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  input: {
    width: "90%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 5,
    paddingLeft: 5,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  submitReportButton: {
    backgroundColor: "#e74c3c",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: "40%",
  },
});

export default ModalEditAndReport;
