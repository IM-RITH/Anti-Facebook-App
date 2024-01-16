import React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";

export const LoaderComponent = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export const refreshControl = (isRefreshing, onRefresh) => (
  <RefreshControl
    refreshing={isRefreshing}
    onRefresh={onRefresh}
    tintColor="#0000ff"
    colors={["#0000ff"]}
  />
);

const styles = StyleSheet.create({
  spinnerContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE",
  },
});
