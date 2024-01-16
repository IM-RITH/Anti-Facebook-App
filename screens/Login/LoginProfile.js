import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../components";
import { COLORS, SIZES } from "../../constants/theme";
import * as SecureStore from "expo-secure-store";
import EmailPasswordInput from "./EmailPasswordInput";

const LoginProfile = () => {
  const navigation = useNavigation();
  const [accountInfo, setAccountInfo] = useState(null);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreateAccountClick = () => {
    navigation.navigate("Register");
  };

  const handleFindAccountClick = () => {
    navigation.navigate("findemail");
  };

  const handleLoginProfileClick = () => {
    navigation.navigate("login");
  };

  const renderAccountItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item)}>
      <View style={styles.userContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: item.userInfo.avatar }}
          />
          <Text style={styles.username}>{item.userInfo.username}</Text>
        </View>
        <Ionicons name="md-ellipsis-vertical" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowLoginScreen(true);
  };

  useEffect(() => {
    const handleAccountSwitch = async () => {
      try {
        const storedAccountInfoString = await SecureStore.getItemAsync(
          "accountInfo"
        );

        if (!storedAccountInfoString) {
          return;
        }

        const parsedAccountInfo = JSON.parse(storedAccountInfoString);

        if (!parsedAccountInfo) {
          return;
        }

        setAccountInfo(parsedAccountInfo);
      } catch (error) {
        console.error("Error retrieving account information:", error);
      }
    };

    handleAccountSwitch();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/Logo.png")}
        />
        <View>
          {accountInfo ? (
            <FlatList
              data={accountInfo}
              keyExtractor={(item) => item.email}
              renderItem={renderAccountItem}
            />
          ) : (
            <TouchableOpacity>
              <View style={styles.userContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.profileImage}
                    source={require("../../assets/images/ProfileImage.png")}
                  />
                  <Text style={styles.username}>Sanjay Shendy</Text>
                </View>
                <Ionicons name="md-ellipsis-vertical" size={24} color="black" />
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.accountOptions}>
            <TouchableOpacity
              onPress={handleLoginProfileClick}
              style={styles.optionItem}
            >
              <Ionicons name="md-log-in" size={24} color="blue" />
              <Text style={styles.optionText}>Log into Another Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFindAccountClick}
              style={styles.optionItem}
            >
              <Ionicons name="md-search" size={24} color="blue" />
              <Text style={styles.optionText}>Find Your Account</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <ButtonComponent
            onPress={handleCreateAccountClick}
            title={"Create New Facebook Account"}
          />
        </View>
      </View>
      <EmailPasswordInput
        onClose={() => setShowLoginScreen(false)}
        onOpen={showLoginScreen}
        selectedUser={selectedUser}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "space-around",
  },
  logo: {
    alignSelf: "center",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 65,
    height: 75,
    borderRadius: SIZES.medium,
  },
  username: {
    fontSize: 18,
    paddingLeft: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accountOptions: {
    marginTop: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.blue,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.lightWhite,
    padding: 20,
    borderRadius: SIZES.medium,
    width: "80%",
  },
});

export default LoginProfile;
