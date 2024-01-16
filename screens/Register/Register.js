import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ButtonComponent } from "../../components";
import { COLORS, SIZES } from "../../constants/theme";

const Register = ({ navigation }) => {
  const handleNextClick = () => {
    navigation.navigate("email");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/images/Illustration.png")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Join Facebook</Text>
          <Text style={styles.subtitle}>
            We'll help you create a new account in a few easy steps
          </Text>
        </View>
        <ButtonComponent title={"Next"} onPress={handleNextClick} />
        <View style={styles.haveAccountContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={styles.alreadyhaveAccountText}>
              Already have an account?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  contentContainer: {
    paddingHorizontal: 30,
    flex: 1,
  },
  image: {},
  textContainer: {
    marginTop: 80,
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    padding: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.dark,
    textAlign: "center",
  },
  haveAccountContainer: {
    marginTop: 150,
    alignItems: "center",
  },
  alreadyhaveAccountText: {
    marginBottom: 10,
    color: COLORS.blue,
    fontSize: 16,
    fontWeight: "bold",
  },
});
