import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../components/Buttons/CustomButton";
import { useNavigation } from "@react-navigation/native";

export default function OrderConfirmationScreen() {
  const navigation = useNavigation();

  function goHome() {
    // Reiniciar el stack del carrito a su pantalla principal para que la próxima
    // vez que se abra el tab "Carrito" muestre el carrito vacío, no esta confirmación
    navigation.reset({ index: 0, routes: [{ name: "CartMain" }] });
    // Navegar al tab Inicio desde dentro del CartStack
    navigation.getParent()?.navigate("Inicio");
  }

  return (
    <LinearGradient colors={["#d8ecff", "#eef5ff", "#f8fbff"]} style={styles.bg}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <View style={styles.container}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={56} color="#fff" />
        </View>

        <Text style={styles.title}>¡Compra exitosa!</Text>
        <Text style={styles.subtitle}>
          Su compra ha quedado guardada correctamente.{"\n"}
          Recibirás un correo con los detalles de tu pedido.
        </Text>

        <CustomButton label="Volver al inicio" onPress={goHome} style={styles.btn} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 22,
  },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#38b6ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38b6ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f5fa6",
    textAlign: "center",
  },
  subtitle: {
    color: "#555",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 26,
  },
  btn: { width: "100%", marginTop: 8 },
  blob1: {
    position: "absolute", width: 280, height: 280, borderRadius: 140,
    backgroundColor: "rgba(56,182,255,0.08)", top: -80, right: -60,
  },
  blob2: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(92,225,230,0.07)", bottom: 80, left: -50,
  },
});
