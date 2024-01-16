import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const PickerDateComponent = ({ date, onDateChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      hideDatePickerModal();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatePickerModal} style={styles.touchable}>
        <Text style={styles.label}>Select a Date:</Text>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <RNDateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          is24Hour={true}
          minimumDate={new Date(1950, 0, 1)}
          maximumDate={new Date(2050, 11, 31)}
          textColor="#000000"
          themeVariant="light"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  touchable: {
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default PickerDateComponent;
