import { TokenRequest } from "../requestMethod";

export const checkIfPostLiked = async (postId, userId) => {
  try {
    const response = await TokenRequest.post("/get_list_feels", {
      id: postId,
      index: "0",
      count: "100",
    });

    const liked = response.data.data.some(
      (item) => item.feel.user.id === userId && item.feel.type === "1"
    );

    return liked;
  } catch (error) {
    console.error("Error checking if liked:", error);
    return null;
  }
};
