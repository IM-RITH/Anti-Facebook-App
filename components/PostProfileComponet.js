import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

const PostProfileComponent = ({
  username,
  time,
  location,
  postText,
  postImage,
  profileImage,
  likes,
  commentsCount,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyToComment, setReplyToComment] = useState(null);

  const [comments, setComments] = useState([
    {
      id: 1,
      profileImage: profileImage,
      username: "User1",
      text: "Comment 1",
      time: "Just now",
      replies: [],
    },
    {
      id: 2,
      profileImage: profileImage,
      username: "User2",
      text: "Comment 2",
      time: "2 minutes ago",
      replies: [
        {
          id: 3,
          profileImage: profileImage,
          username: "User1",
          text: "Reply 1 to Comment 2",
          time: "1 minute ago",
        },
      ],
    },
  ]);

  const handleMessageClick = () => {
    // Handle message click
  };

  const handleLikeClick = () => {
    // Handle like click
  };

  const handleCommentClick = () => {
    setShowComments(true);
  };

  const handleReplyComment = (comment) => {
    setReplyToComment(comment);
    setNewComment(`@${comment.username} `);
  };

  const handleCommentInputChange = (text) => {
    setNewComment(text);
  };

  const handlePostComment = () => {
    const newCommentObject = {
      id: comments.length + 1,
      profileImage: profileImage,
      username: username,
      text: newComment,
      time: "Just now",
      replies: [],
    };

    if (replyToComment) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === replyToComment.id) {
          comment.replies.push(newCommentObject);
        }
        return comment;
      });

      setComments(updatedComments);
    } else {
      setComments([...comments, newCommentObject]);
    }

    setNewComment("");
    setReplyToComment(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <View style={styles.headerText}>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.timeLocation}>
            <Text style={styles.time}>{time}</Text>
            <EvilIcons
              name="location"
              size={20}
              color="black"
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
        <Ionicons name="ellipsis-vertical" style={styles.moreIcon} />
      </View>
      <Text style={styles.postText}>{postText}</Text>
      <View style={styles.postImageContainer}>
        <Image source={postImage} style={styles.postImage} />
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLikeClick}>
          <EvilIcons name="like" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCommentClick}>
          <EvilIcons name="comment" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMessageClick}>
          <EvilIcons name="share-apple" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.likesComments}>
        <View style={styles.likeCommentIcons}>
          <TouchableOpacity onPress={handleLikeClick}>
            <EvilIcons name="like" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <EvilIcons name="comment" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.likeText}>{likes} Likes</Text>
        </View>
        <Text style={styles.commentCount}>{commentsCount} Comments</Text>
      </View>
      <Modal visible={showComments} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeaderText}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ paddingLeft: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <Image
                    style={styles.commenterImage}
                    source={item.profileImage}
                  />
                  <View style={styles.commentTextContainer}>
                    <Text style={styles.commenterName}>{item.username}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                  </View>
                </View>
                <View style={styles.commentActions}>
                  <Text style={styles.commentTime}>{item.time}</Text>
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
                {item.replies && item.replies.length > 0 && (
                  <FlatList
                    data={item.replies}
                    keyExtractor={(reply) => reply.id.toString()}
                    renderItem={({ item: reply }) => (
                      <View style={{ marginLeft: 30 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 10,
                          }}
                        >
                          <Image
                            style={styles.commenterImage}
                            source={reply.profileImage}
                          />
                          <View style={styles.commentTextContainer}>
                            <Text style={styles.commenterName}>
                              {reply.username}
                            </Text>
                            <Text style={styles.commentText}>{reply.text}</Text>
                          </View>
                        </View>
                        <View style={styles.commentActions}>
                          <Text style={styles.commentTime}>{reply.time}</Text>
                          <TouchableOpacity style={styles.commentAction}>
                            <Ionicons name="thumbs-up" size={16} />
                            <Text style={styles.commentActionText}>Like</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.commentAction}
                            onPress={() => handleReplyComment(reply)}
                          >
                            <Ionicons name="paper-plane" size={16} />
                            <Text style={styles.commentActionText}>Reply</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                )}
              </View>
            )}
          />
          <View style={styles.newcommentInput}>
            <TextInput
              placeholder="Write a comment"
              value={newComment}
              onChangeText={handleCommentInputChange}
              style={{ width: "90%" }}
            />
            <TouchableOpacity onPress={handlePostComment}>
              <Ionicons name="send" size={24} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => {
              setShowComments(false);
              setNewComment("");
              setReplyToComment(null);
            }}
          >
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // margin: 10,
    backgroundColor: "#fff",
    // borderRadius: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 10,
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  timeLocation: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    marginRight: 5,
    color: "#888",
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    fontSize: 14,
    color: "#888",
  },
  moreIcon: {
    fontSize: 24,
  },
  postText: {
    marginTop: 10,
    fontSize: 16,
  },
  postImageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 15,
  },
  actionIcon: {
    fontSize: 24,
    color: "#333",
  },
  likesComments: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  likeCommentIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallIcon: {
    fontSize: 16,
    color: "#333",
    marginRight: 5,
  },
  likeText: {
    fontWeight: "normal",
    color: "#555",
  },
  commentCount: {
    color: "#555",
  },
  commenterImage: {
    width: 40,
    height: 40,
  },
  commentTextContainer: {
    marginLeft: 10,
  },
  commenterName: {
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 16,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentTime: {
    color: "#888",
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  commentActionText: {
    marginLeft: 5,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  commentInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
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
  newcommentInput: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
  },
});

export default PostProfileComponent;
