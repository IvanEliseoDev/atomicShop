import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Logo from "../components/Logo";

// Segunda pantalla de carga — aparece ~900 ms entre el splash y la app principal
export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Logo size="medium" />
      <ActivityIndicator color="#38b6ff" size="large" style={styles.spinner} />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f6fb",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  spinner: { marginTop: 10 },
  text: {
    color: "#38b6ff",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
