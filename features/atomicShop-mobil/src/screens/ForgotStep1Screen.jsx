import { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import InputEmail from "../components/Inputs/InputEmail";
import CustomButton from "../components/Buttons/CustomButton";
import { apiFetch } from "../config/api";

export default function ForgotStep1Screen({ onBack, onNext }) {
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setError("");
    if (!mail.trim()) { setError("El correo es requerido"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim())) {
      setError("Ingresa un correo válido"); return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/api/e-commerce/recoveryPassword/requestCode", {
        method: "POST",
        body: JSON.stringify({ mail: mail.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message === "User not found" ? "Correo no registrado" : "Error al enviar el código");
      // Backend returns recoveryToken in body (mobile-friendly, no cookie needed)
      onNext(mail.trim().toLowerCase(), data.recoveryToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#d8ecff", "#eef5ff", "#f8fbff"]} style={styles.bg}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Logo size="medium" />
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>
              Ingresa tu correo y te enviaremos un código de recuperación.
            </Text>

            <InputEmail
              placeholder="Correo electrónico"
              value={mail}
              onChangeText={setMail}
              error={error}
            />

            <CustomButton label="Enviar" onPress={handleSend} loading={loading} />

            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 16,
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#0f5fa6", textAlign: "center" },
  subtitle: { color: "#666", fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 4 },
  backBtn: { marginTop: 4 },
  backText: { color: "#38b6ff", fontSize: 13, fontWeight: "600" },
  blob1: {
    position: "absolute", width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(56,182,255,0.08)", top: -80, right: -60,
  },
  blob2: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(92,225,230,0.07)", bottom: 60, left: -50,
  },
});
