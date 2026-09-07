import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";

export default function SplashScreen() {
  return (
    <LinearGradient colors={["#0a4a82", "#0f5fa6", "#1a7bc4"]} style={styles.container}>
      {/* Círculos decorativos de fondo */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorCircle3} />

      <View style={styles.content}>
        <Logo size="large" light />
        <Text style={styles.tagline}>Tu tienda de laboratorio</Text>
        <ActivityIndicator color="#5ce1e6" size="small" style={styles.loader} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { alignItems: "center", gap: 14 },
  tagline: {
    color: "#c8e8ff",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  loader: { marginTop: 32 },
  decorCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(56,182,255,0.08)",
    top: -80,
    right: -60,
  },
  decorCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(92,225,230,0.07)",
    bottom: 40,
    left: -50,
  },
  decorCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: 180,
    right: 20,
  },
});
