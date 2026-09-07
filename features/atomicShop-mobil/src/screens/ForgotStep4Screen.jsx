import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Logo from "../components/Logo";
import CustomButton from "../components/Buttons/CustomButton";

export default function ForgotStep4Screen({ onFinish }) {
  return (
    <LinearGradient colors={["#d8ecff", "#eef5ff", "#f8fbff"]} style={styles.bg}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <View style={styles.container}>
        <Logo size="medium" />

        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={52} color="#fff" />
        </View>

        <Text style={styles.title}>¡Contraseña actualizada!</Text>
        <Text style={styles.subtitle}>
          Tu contraseña ha sido cambiada exitosamente.{"\n"}Ya puedes iniciar sesión.
        </Text>

        <CustomButton label="Ir al inicio de sesión" onPress={onFinish} style={styles.btn} />
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
    gap: 20,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#38b6ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#38b6ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f5fa6",
    textAlign: "center",
  },
  subtitle: {
    color: "#666",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
  },
  btn: { width: "100%", marginTop: 8 },
  blob1: {
    position: "absolute", width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(56,182,255,0.08)", top: -80, right: -60,
  },
  blob2: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(92,225,230,0.07)", bottom: 60, left: -50,
  },
});
