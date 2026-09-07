import { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import InputEmail from "../components/Inputs/InputEmail";
import InputPassword from "../components/Inputs/InputPassword";
import CustomButton from "../components/Buttons/CustomButton";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen({ onRegister, onForgot }) {
  const { login } = useAuth();
  const [mail, setMail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!mail.trim()) e.mail = "El correo es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim()))
      e.mail = "Ingresa un correo válido";
    if (!password) e.password = "La contraseña es requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ mail, password });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#d8ecff", "#eef5ff", "#f8fbff"]} style={styles.bg}>
      {/* Formas decorativas */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoRow}>
            <Logo size="medium" />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Inicio de sesión</Text>

            <InputEmail
              placeholder="Correo electrónico"
              value={mail}
              onChangeText={setMail}
              error={errors.mail}
            />
            <InputPassword
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            <TouchableOpacity onPress={onForgot} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

            <CustomButton label="Iniciar sesión" onPress={handleLogin} loading={loading} />

            <TouchableOpacity onPress={onRegister} style={styles.registerBtn}>
              <Text style={styles.registerText}>
                ¿No tienes cuenta?{" "}
                <Text style={styles.registerLink}>Registrarse</Text>
              </Text>
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
  logoRow: { alignItems: "center", marginBottom: 28 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f5fa6",
    marginBottom: 20,
    textAlign: "center",
  },
  forgotBtn: { alignSelf: "flex-end", marginBottom: 4 },
  forgotText: { color: "#38b6ff", fontSize: 13, fontWeight: "600" },
  apiError: {
    color: "#e74c3c",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 4,
    marginTop: 2,
  },
  registerBtn: { marginTop: 16, alignItems: "center" },
  registerText: { color: "#666", fontSize: 14 },
  registerLink: { color: "#38b6ff", fontWeight: "700" },
  blob1: {
    position: "absolute", width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(56,182,255,0.08)", top: -80, right: -60,
  },
  blob2: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(92,225,230,0.07)", bottom: 60, left: -50,
  },
});
