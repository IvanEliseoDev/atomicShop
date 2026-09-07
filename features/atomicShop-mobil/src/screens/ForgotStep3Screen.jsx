import { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import InputPassword from "../components/Inputs/InputPassword";
import CustomButton from "../components/Buttons/CustomButton";
import { apiFetch } from "../config/api";

export default function ForgotStep3Screen({ recoveryToken, onBack, onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!password) e.password = "La contraseña es requerida";
    else if (password.length < 8) e.password = "Mínimo 8 caracteres";
    if (!confirmPassword) e.confirm = "Confirma tu contraseña";
    else if (password !== confirmPassword) e.confirm = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleConfirm() {
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await apiFetch("/api/e-commerce/recoveryPassword/newPassword", {
        method: "POST",
        body: JSON.stringify({
          newPassword: password,
          confirmNewPassword: confirmPassword,
          recoveryToken,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? "No se pudo actualizar la contraseña");
      onSuccess();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#d8ecff", "#eef5ff", "#f8fbff"]} style={styles.bg}>
      <View style={styles.blob1} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Logo size="medium" />
            <Text style={styles.title}>Crea tu nueva contraseña</Text>
            <Text style={styles.subtitle}>
              ¡Muchas gracias por tu paciencia!{"\n"}Ahora puedes crear tu contraseña.
            </Text>

            <View style={styles.fields}>
              <InputPassword
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
              />
              <InputPassword
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirm}
              />
            </View>

            {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

            <CustomButton label="Confirmar" onPress={handleConfirm} loading={loading} />

            <TouchableOpacity onPress={onBack}>
              <Text style={styles.backText}>‹ Volver</Text>
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
  subtitle: { color: "#666", fontSize: 14, textAlign: "center", lineHeight: 22 },
  fields: { width: "100%" },
  apiError: { color: "#e74c3c", fontSize: 13, textAlign: "center" },
  backText: { color: "#999", fontSize: 13, fontWeight: "600" },
  blob1: {
    position: "absolute", width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(56,182,255,0.08)", top: -80, right: -60,
  },
});
