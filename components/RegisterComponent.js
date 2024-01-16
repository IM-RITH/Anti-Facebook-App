// RegisterComponent.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../constants/theme";
import ButtonComponent from "./ButtonComponent";
import { useNavigation } from "@react-navigation/native";
import { publicRequest } from "../requestMethod";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";

const RegisterComponent = ({
  title,
  children,
  subtitle,
  titleBtn,
  isFindAccount,
  searchByText,
  navigationText,
  navigationFindText,
  password,
  passwordCreate,
  emailCreate,
  isNextButtonEnabled,
  emailFind,
  onPressBtn,
  emailRegister,
}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const handleNextClick = async () => {
    const uuid = "a12345";
    // Start loading
    setLoading(true);

    // Make a POST request
    if (
      typeof passwordCreate !== "undefined" &&
      typeof emailCreate !== "undefined"
    ) {
      try {
        const response = await publicRequest.post("/signup", {
          email: emailCreate,
          password: passwordCreate,
          uuid: uuid,
        });
        console.log("Signup successful:", response.data);
        // Navigate to the next screen
        navigation.navigate("otpcode", {
          emailRegister: emailCreate,
          code: response.data.data.verify_code,
        });
      } catch (error) {
        console.log("Response Data:", error.response?.data);
        Alert.alert(
          "Error",
          `${error.response?.data.message}. Please try again.`,
          [
            { text: "OK", style: "cancel" },
            {
              text: "Go back home",
              onPress: () => navigation.navigate("login"),
            },
          ]
        );
      } finally {
        // Stop loading, whether the request succeeded or failed
        setLoading(false);
      }
    } else {
      // Navigate to the next screen
      navigation.navigate(navigationText, {
        // email: email,
        password: password,
        emailFind: emailFind,
        emailRegister: emailRegister,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.inputRow}>{children}</View>
        <ButtonComponent
          title={titleBtn}
          onPress={onPressBtn ? onPressBtn : handleNextClick}
          isNextButtonEnabled={!loading && isNextButtonEnabled}
        />
        {isFindAccount && (
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationFindText)}
          >
            <Text
              style={{
                textAlign: "center",
                color: "blue",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {searchByText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    paddingHorizontal: 30,
  },
  header: {
    // marginTop: 80,
    marginBottom: 50,
    gap: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.dark,
    textAlign: "center",
    width: "80%",
  },
  inputRow: {
    marginBottom: 20,
    flexDirection: "row",
  },
});

export default RegisterComponent;
