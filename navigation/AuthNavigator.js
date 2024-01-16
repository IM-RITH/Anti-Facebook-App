import { createStackNavigator } from "@react-navigation/stack";
import {
  AccountBirthDay,
  AccountGender,
  AccountName,
  AccountNumber,
  AccountPassword,
  AccountTermsPrivacy,
  Register,
  SplashScreen,
  CreateNewPassword,
  FindPhone,
  LoginProfile,
  LoginScreen,
  OTPCode,
  FindEmail,
  MessageScreen,
  AccountEmail,
} from "../screens";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="start"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="name"
        component={AccountName}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "Create Account",
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
        name="birthday"
        component={AccountBirthDay}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "Create Birthday",
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
        name="gender"
        component={AccountGender}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "Create Gender",
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
        name="number"
        component={AccountNumber}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "Create Phone",
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
        name="password"
        component={AccountPassword}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "Create Password",
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
          headerTintColor: "#000",
        }}
      />
      <Stack.Screen
        name="terms"
        component={AccountTermsPrivacy}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "Terms",
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
          headerTintColor: "#000",
        }}
      />
      {/* <Stack.Screen
        name="findphone"
        component={FindPhone}
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="findemail"
        component={FindEmail}
        options={{
          // headerLeft: () => (
          //   <TouchableOpacity
          //     onPress={() =>
          //       loginProfle
          //         ? navigation.navigate("loginproflie")
          //         : navigation.goBack()
          //     }
          //   >
          //     <Ionicons
          //       name="arrow-back-outline"
          //       size={24}
          //       color="black"
          //       style={{ marginLeft: 20 }}
          //     />
          //   </TouchableOpacity>
          // ),
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
      /> */}
      {/* <Stack.Screen
        name="loginproflie"
        component={LoginProfile}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="otpcode"
        component={OTPCode}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "OTP Code",
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
        name="createnewpassword"
        component={CreateNewPassword}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "New Password",
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
        name="email"
        component={AccountEmail}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerTitle: "Create Email",
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
  );
};

export default AuthNavigator;
