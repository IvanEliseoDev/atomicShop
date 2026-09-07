import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Pantalla placeholder para tabs de compañeros de equipo (Favoritos, Categorías, Perfil)
export default function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="construct-outline" size={64} color="#c8d8e8" />
      <Text style={styles.title}>Próximamente</Text>
      <Text style={styles.subtitle}>Esta sección está siendo desarrollada por el equipo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f6fb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f5fa6",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});
