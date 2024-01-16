import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "https://it4788.catan.io.vn/";

let TokenRequest;

async function getToken() {
  try {
    const token = await SecureStore.getItemAsync("loginToken");
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

const publicRequest = axios.create({
  baseURL: BASE_URL,
});

async function setupTokenRequest() {
  try {
    const token = await getToken();
    if (token) {
      TokenRequest = axios.create({
        baseURL: BASE_URL,
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    console.error("Error setting up TokenRequest:", error);
  }
}
export { publicRequest, TokenRequest, setupTokenRequest };
