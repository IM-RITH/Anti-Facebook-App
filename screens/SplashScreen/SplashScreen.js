import React, { useCallback, useEffect } from "react";
import { StyleSheet, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { COLORS } from "../../constants/theme";
import { useFocusEffect } from "@react-navigation/native";

const SplashScreen = ({ navigation }) => {
  const heightValue = useSharedValue(200);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation, heightValue]);
  const refreshLoginScreen = useCallback(() => {
    navigation.navigate("login");
  }, [navigation]);

  useFocusEffect(refreshLoginScreen);
  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../../assets/images/FacebookLogo.png")} />
      </View>
      <View>
        <Image source={require("../../assets/images/MetaLogo.png")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default SplashScreen;
