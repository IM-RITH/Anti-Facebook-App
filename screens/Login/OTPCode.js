import React, { useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { publicRequest } from "../../requestMethod";
import { ButtonComponent, InputTextComponent } from "../../components";

const OTPCode = ({ navigation }) => {
  const [otpValue, setOtpValue] = useState("");
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [otpError, setOtpError] = useState("");
  const { emailFind, emailRegister, code } = useRoute().params || {};
  const intervalRef = useRef(null);

  useEffect(() => {
    checkEmailValidity();
  }, [emailFind, emailRegister, code]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime === 0 ? 0 : prevTime - 1));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const checkEmailValidity = async () => {
    try {
      const response = await publicRequest.post("/check_email", {
        email: emailFind || emailRegister,
      });

      if (response.data.data.existed !== "1") {
        Alert.alert(
          "Error",
          "Email not found. Please check the email or create an account."
        );
      } else {
        if (emailFind) {
          fetchData();
        } else if (emailRegister) {
          setOtpValue(code);
        }
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await publicRequest.post("/get_verify_code", {
        email: emailFind || emailRegister,
      });
      clearInterval(intervalRef.current);
      setTimeRemaining(0);
      setOtpValue(response.data.data.verify_code);
      setOtpError("");
    } catch (error) {
      console.error("Error fetching OTP code:", error);
    }
  };

  const handleResendCode = () => {
    clearInterval(intervalRef.current);
    setTimeRemaining(20);
    fetchData();
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime === 0 ? 0 : prevTime - 1));
    }, 1000);
  };

  const handleContinue = async () => {
    try {
      const response = await publicRequest.post("/check_verify_code", {
        email: emailFind ? emailFind : emailRegister,
        code_verify: otpValue,
      });

      if (response.data.message === "OK") {
        if (emailFind) {
          navigation.navigate("createnewpassword", { emailFind });
        } else {
          navigation.navigate("login");
        }
      } else {
        setOtpError("Invalid OTP code");
        Alert.alert("Error", "Invalid OTP code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Error verifying OTP code");
      Alert.alert("Error", "Error verifying OTP code. Please try again.");
    }
  };

  const handleOtpChange = (text) => {
    setOtpValue(text);
  };

  const clearOtpInput = () => {
    setOtpValue("");
  };

  const handleOtpFocus = () => {
    setIsOtpFocused(true);
  };

  const refreshLoginScreen = useCallback(() => {
    setOtpError("");
    setOtpValue("");
  }, []);

  useFocusEffect(refreshLoginScreen);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Enter the code we sent to</Text>
        <Text style={styles.email}>{emailFind}</Text>
        <Text style={styles.description}>
          We sent a 6-digit code to your email address
        </Text>
        {timeRemaining > 0 && (
          <Text style={styles.timerText}>
            Time remaining: {formatTime(timeRemaining)}
          </Text>
        )}
      </View>

      <InputTextComponent
        label="OTP Code"
        value={otpValue}
        onChangeText={handleOtpChange}
        isFocused={isOtpFocused}
        iconName="ios-close"
        InputFunction={clearOtpInput}
        clear={otpValue !== ""}
        onFocus={handleOtpFocus}
        isFlex={true}
        secureTextEntry={false}
        errorText={otpError}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendCode}
        >
          <Ionicons name="refresh" style={styles.icon} />
          <Text style={styles.buttonText}>Resend Code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.changeEmailButton}
          onPress={() =>
            emailRegister
              ? navigation.navigate("email")
              : navigation.navigate("findemail")
          }
        >
          <Ionicons name="mail" style={styles.icon} />
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
      </View>

      <ButtonComponent title="Continue" onPress={handleContinue} />
    </SafeAreaView>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  centerContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    marginTop: 10,
    color: "blue",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeEmailButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  timerText: {
    fontWeight: "300",
  },
});

export default OTPCode;
