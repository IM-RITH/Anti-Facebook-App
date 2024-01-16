import { Audio } from "expo-av";
const audioFilePath = require("../assets/audios/Tap-Short-Reverse-01.wav");
const playSound = async () => {
  try {
    if (!audioFilePath) {
      console.error("Audio file path is undefined or null");
      return;
    }

    const { sound } = await Audio.Sound.createAsync(audioFilePath, {
      shouldPlay: true,
    });
    await sound.playAsync();
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

export default playSound;
