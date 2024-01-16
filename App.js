import React, { useContext, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as Splash_Screen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./navigation/TabNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import * as SecureStore from "expo-secure-store";
import { ModalProvider } from "./hooks/useModalContext";
import {
  FindEmail,
  FindPhone,
  LoginProfile,
  LoginScreen,
  MessageChat,
  MessageProfile,
  MessageScreen,
  NewMessage,
  PostDetailScreen,
  ProfileDetail,
  Register,
  ShowAllImagePost,
} from "./screens";
import { AuthProvider } from "./hooks/AuthContext";
import { CoinProvider } from "./hooks/useCoinContext";
import EditProfileScreen from "./screens/EditProfile/EditProfileScreen";
import { ModalPostComponent } from "./components";
import SearchSomethingScreen from "./screens/SearchSomething/SearchSomething";
import YourFriendScreen from "./screens/YourFriend/YourFriend";
import SuggestionsScreen from "./screens/SuggestionScreen/SuggestionScreen";
import SearchScreen from "./screens/Search/Search";
import Block from "./screens/Block/Block";
import CreatePostScreen from "./screens/CreatePost/CreatePost";

const App = () => {
  // Load fonts
  const [fontsLoaded] = useFonts({
    Regular: require("./assets/fonts/SF-Pro-Text-Regular.otf"),
    Medium: require("./assets/fonts/SF-Pro-Text-Bold.otf"),
    Semibold: require("./assets/fonts/SF-Pro-Text-Semibold.otf"),
    Bold: require("./assets/fonts/SF-Pro-Text-Bold.otf"),
    Light: require("./assets/fonts/SF-Pro-Text-Light.otf"),
    Heavy: require("./assets/fonts/SF-Pro-Text-Heavy.otf"),
  });
  const [userAuthencated, setAuthenticated] = useState(false);
  useEffect(() => {
    const initializeApp = async () => {
      if (fontsLoaded) {
        await Splash_Screen.hideAsync();
      }
    };

    const fetchToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("loginToken");
        setAuthenticated(!!token);
      } catch (error) {
        console.error("Error fetching token from SecureStore:", error);
        throw error; // Re-throw to handle in initializeApp
      }
    };

    // Fetch token only if not authenticated
    if (!userAuthencated) {
      fetchToken();
    }

    // Initialize app regardless of authentication status
    initializeApp();
  }, [fontsLoaded, userAuthencated, setAuthenticated]);

  // If fonts are not loaded, return null
  if (!fontsLoaded) {
    return null;
  }

  const Stack = createStackNavigator();
  return (
    <CoinProvider>
      <AuthProvider>
        <ModalProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={
                userAuthencated ? "TabNavigator" : "AuthNavigator"
              }
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
              <Stack.Screen
                name="loginproflie"
                component={LoginProfile}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProfileDetail"
                component={ProfileDetail}
                options={{ headerShown: true, headerTitleAlign: "center" }}
              />
              <Stack.Screen
                name="PostDetailScreen"
                component={PostDetailScreen}
                options={{ headerShown: true, headerTitleAlign: "center" }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerShown: true, headerBackTitle: "Back" }}
              />
              <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{ headerShown: true, headerBackTitle: "Back" }}
              />
              <Stack.Screen
                name="Suggest"
                component={SuggestionsScreen}
                options={{ headerShown: true, headerBackTitle: "Back" }}
              />
              <Stack.Screen
                name="YourFriend"
                component={YourFriendScreen}
                options={{ headerShown: true, headerBackTitle: "Back" }}
              />
              <Stack.Screen
                name="Block"
                component={Block}
                options={{ headerShown: true, headerBackTitle: "Back" }}
              />
              <Stack.Screen
                name="SearchSomething"
                component={SearchSomethingScreen}
                options={{ headerShown: true, headerBackTitle: "Back" }}
              />
              <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="message"
                component={MessageScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="newMessage"
                component={NewMessage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="chat"
                component={MessageChat}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="chatproflie"
                component={MessageProfile}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="showall"
                component={ShowAllImagePost}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="modal"
                component={ModalPostComponent}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="findphone"
                component={FindPhone}
                options={{
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerTitleAlign: "center",
                  headerTitle: "Find Phone",
                  headerStyle: {
                    backgroundColor: "#fff",
                    // shadowColor: "#000",
                    // shadowOffset: { width: 0, height: 2 },
                    // shadowOpacity: 0.2,
                    shadowRadius: 2,
                    borderBottomWidth: 0.5,
                  },
                  headerTitleStyle: {
                    color: "#000",
                    fontSize: 18,
                  },
                  headerTintColor: "#000", // Set icon and back button color to black
                }}
              />
              <Stack.Screen
                name="findemail"
                component={FindEmail}
                options={{
                  headerShown: true,
                  headerBackTitleVisible: false,
                  headerTitleAlign: "center",
                  headerTitle: "Find Email",
                  headerStyle: {
                    backgroundColor: "#fff",
                    // shadowColor: "#000",
                    // shadowOffset: { width: 0, height: 2 },
                    // shadowOpacity: 0.2,
                    shadowRadius: 2,
                    borderBottomWidth: 0.5,
                  },
                  headerTitleStyle: {
                    color: "#000",
                    fontSize: 18,
                  },
                  headerTintColor: "#000", // Set icon and back button color to black
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ModalProvider>
      </AuthProvider>
    </CoinProvider>
  );
};

export default App;
