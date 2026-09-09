import { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import InputText from "../components/Inputs/InputText";
import InputEmail from "../components/Inputs/InputEmail";
import InputPassword from "../components/Inputs/InputPassword";
import CustomButton from "../components/Buttons/CustomButton";
import { useAuth } from "../hooks/useAuth";

const DUI_REGEX = /^\d{8}-\d$/;

export default function RegisterScreen({ onBack, onNeedsVerification }) {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: "", lastName: "", dui: "",
    telephone: "", mail: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

  function setDui(val) {
    const digits = val.replace(/\D/g, "").slice(0, 9);
    const formatted = digits.length > 8 ? `${digits.slice(0, 8)}-${digits.slice(8)}` : digits;
    setForm((f) => ({ ...f, dui: formatted }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Los nombres son requeridos";
    if (!form.lastName.trim()) e.lastName = "Los apellidos son requeridos";
    if (!form.dui.trim()) e.dui = "El DUI es requerido";
    else if (!DUI_REGEX.test(form.dui.trim())) e.dui = "Formato inválido (########-#)";
    if (!form.telephone.trim()) e.telephone = "El teléfono es requerido";
    if (!form.mail.trim()) e.mail = "El correo es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail.trim()))
      e.mail = "Correo inválido";
    if (!form.password) e.password = "La contraseña es requerida";
    else if (form.password.length < 8) e.password = "Mínimo 8 caracteres";
    if (!form.confirmPassword) e.confirmPassword = "Confirma tu contraseña";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        mail: form.mail.trim(),
        password: form.password,
        telephone: form.telephone.trim(),
        dui: form.dui.trim(),
        direction: "",
        deparmet: "",        // Campo del backend (typo mantenido para coincidir con schema)
        municipality: "",
        typeCustomer: "consumidor final",
        nit: "",
        typeActivity: "",
      });
      onNeedsVerification(form.mail.trim());
    } catch (err) {
      setApiError(err.message);
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
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backText}>‹ Volver</Text>
            </TouchableOpacity>
            <Logo size="medium" />
          </View>

          <Text style={styles.title}>Regístrate en nuestra tienda</Text>

          <View style={styles.card}>
            <InputText
              placeholder="Nombres"
              value={form.firstName}
              onChangeText={set("firstName")}
              error={errors.firstName}
            />
            <InputText
              placeholder="Apellidos"
              value={form.lastName}
              onChangeText={set("lastName")}
              error={errors.lastName}
            />
            <InputText
              placeholder="DUI (########-#)"
              value={form.dui}
              onChangeText={setDui}
              error={errors.dui}
              keyboardType="numeric"
              maxLength={10}
            />
            <InputText
              placeholder="Teléfono"
              value={form.telephone}
              onChangeText={set("telephone")}
              error={errors.telephone}
              keyboardType="phone-pad"
            />
            <InputEmail
              placeholder="Correo electrónico"
              value={form.mail}
              onChangeText={set("mail")}
              error={errors.mail}
            />
            <InputPassword
              placeholder="Contraseña"
              value={form.password}
              onChangeText={set("password")}
              error={errors.password}
            />
            <InputPassword
              placeholder="Repetir contraseña"
              value={form.confirmPassword}
              onChangeText={set("confirmPassword")}
              error={errors.confirmPassword}
            />

            {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

            <CustomButton label="Confirmar" onPress={handleRegister} loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  backBtn: { padding: 4 },
  backText: { color: "#38b6ff", fontSize: 16, fontWeight: "700" },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f5fa6",
    textAlign: "center",
    marginBottom: 20,
  },
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
  apiError: {
    color: "#e74c3c",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
  },
  blob1: {
    position: "absolute", width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(56,182,255,0.08)", top: -80, right: -60,
  },
  blob2: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(92,225,230,0.07)", bottom: 60, left: -50,
  },
});
