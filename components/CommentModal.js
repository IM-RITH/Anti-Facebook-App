import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Modal } from "react-native-paper";

const CommentModal = ({
  comments,
  newComment,
  setNewComment,
  handlePostComment,
  isModalVisible,
  hideModal,
  isReplying,
  replyToComment,
  handleReplyComment,
  setIsReplying,
  setReplyToComment,
  handleReplyPostComment,
}) => {
  const formatPostTime = (timeDifferenceMinutes) => {
    if (timeDifferenceMinutes < 1) {
      return "Just now";
    } else if (timeDifferenceMinutes < 60) {
      return `${timeDifferenceMinutes}m ago`;
    } else if (timeDifferenceMinutes < 1440) {
      const hours = Math.floor(timeDifferenceMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(timeDifferenceMinutes / 1440);
      return `${days}d ago`;
    }
  };
  const renderCommentItem = ({ item }) => {
    const postDate = new Date(item.time);
    const currentDate = new Date();
    // Calculate the time difference in milliseconds
    const timeDifferenceMs = currentDate - postDate;

    // Convert milliseconds to minutes
    const commentTimeDifferenceMinutes = Math.floor(
      timeDifferenceMs / (1000 * 60)
    );
    return (
      <View style={styles.commentItem} key={item.id}>
        <Image style={styles.commenterImage} source={item.profileImage} />
        <View style={styles.commentTextContainer}>
          <Text style={styles.commenterName}>{item.username}</Text>
          <Text style={styles.commentText}>{item.text}</Text>
          <View style={styles.commentActions}>
            <Text>{formatPostTime(commentTimeDifferenceMinutes)}</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity style={styles.commentAction}>
                <Ionicons name="thumbs-up" size={16} />
                <Text style={styles.commentActionText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.commentAction}
                onPress={() => handleReplyComment(item)}
              >
                <Ionicons name="paper-plane" size={16} />
                <Text style={styles.commentActionText}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Render replies */}
          {item.replies && item.replies.length > 0 && (
            <FlatList
              data={item.replies}
              keyExtractor={(reply, index) => index.toString()}
              renderItem={({ item: reply }) => {
                const replyPostDate = new Date(reply.created);
                // Calculate the time difference in milliseconds for the reply
                const replyTimeDifferenceMs = currentDate - replyPostDate;
                // Convert milliseconds to minutes for the reply
                const replyTimeDifferenceMinutes = Math.floor(
                  replyTimeDifferenceMs / (1000 * 60)
                );

                return (
                  <View style={styles.commentItem} key={reply.created}>
                    <Image
                      style={styles.commenterImage}
                      source={
                        reply.poster?.avatar &&
                        typeof reply.poster.avatar === "string"
                          ? { uri: reply.poster.avatar }
                          : null
                      }
                    />
                    <View style={styles.commentTextContainer}>
                      <Text style={styles.commenterName}>
                        {reply.poster?.name}
                      </Text>
                      <Text style={styles.commentText}>{reply.content}</Text>
                      <View style={styles.commentActions}>
                        <Text>
                          {formatPostTime(replyTimeDifferenceMinutes)}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity style={styles.commentAction}>
                            <Ionicons name="thumbs-up" size={16} />
                            <Text style={styles.commentActionText}>Like</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.commentAction}
                            onPress={() => handleReplyComment(item)}
                          >
                            <Ionicons name="paper-plane" size={16} />
                            <Text style={styles.commentActionText}>Reply</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    );
  };
  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={false}
      onDismiss={hideModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={styles.modalContainer}
      >
        <FlatList
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCommentItem}
          style={styles.flatList}
          ListHeaderComponent={() => (
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
              }}
            >
              <TouchableOpacity onPress={hideModal}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>Comments</Text>
              </View>
            </View>
          )}
        />

        {isReplying && replyToComment && (
          <View style={styles.newCommentInputContainer}>
            <TextInput
              placeholder={`Replying to ${replyToComment.username}`}
              value={newComment}
              onChangeText={setNewComment}
              style={styles.commentInput}
            />
            <TouchableOpacity
              onPress={() => {
                handleReplyPostComment();
                setIsReplying(false);
                setReplyToComment(null);
              }}
              style={styles.sendButton}
            >
              <Ionicons name="send" size={24} />
            </TouchableOpacity>
          </View>
        )}

        {!isReplying && (
          <View style={styles.newCommentInputContainer}>
            <TextInput
              placeholder="Write a comment"
              value={newComment}
              onChangeText={setNewComment}
              style={styles.commentInput}
            />
            <TouchableOpacity
              onPress={handlePostComment}
              style={styles.sendButton}
            >
              <Ionicons name="send" size={24} />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    height: "100%",
  },
  flatList: {
    marginBottom: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    width: "100%",
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  newCommentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopColor: "#ddd",
    borderTopWidth: 1,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  commentInput: {
    flex: 1,
    marginRight: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  sendButton: {
    padding: 10,
  },
  closeModalButton: {
    backgroundColor: "#333",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  closeModalText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  commentItem: {
    flexDirection: "row",
    padding: 10,
  },
  commenterImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commenterName: {
    fontWeight: "bold",
  },
  commentText: {
    color: "#333",
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  commentActionText: {
    marginLeft: 5,
  },
  commentActions: {
    flexDirection: "row",
  },
});
export default CommentModal;
