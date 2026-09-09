import { Image, StyleSheet, View } from "react-native";

const LOGO_NEGRO = require("../../assets/Logo_AtomicShop_negro.png");
const LOGO_BLANCO = require("../../assets/Logo_AtomicShop_blanco.png");

const WIDTH_BY_SIZE = { small: 120, medium: 160, large: 230 };

export default function Logo({ size = "medium", light = false }) {
  const width = WIDTH_BY_SIZE[size] ?? WIDTH_BY_SIZE.medium;

  return (
    <View style={styles.container}>
      <Image
        source={light ? LOGO_BLANCO : LOGO_NEGRO}
        style={{ width, height: width * 0.52 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
});
