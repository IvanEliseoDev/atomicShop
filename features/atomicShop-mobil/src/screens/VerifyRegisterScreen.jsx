import { useRef, useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import CustomButton from "../components/Buttons/CustomButton";
import { useAuth } from "../hooks/useAuth";

const CODE_LENGTH = 6;

export default function VerifyRegisterScreen({ mail, onBack, onSuccess }) {
  const { verifyRegistrationCode, resendRegistrationCode } = useAuth();

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  function handleDigit(index, val) {
    const clean = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function handleKeyPress(index, key) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setApiError("Ingresa el código completo de 6 dígitos");
      return;
    }
    setApiError("");
    setLoading(true);
    try {
      await verifyRegistrationCode({ verificationCodeRequest: code });
      onSuccess();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setApiError("");
    try {
      await resendRegistrationCode();
      setSuccessMsg("Código reenviado a tu correo");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <LinearGradient colors={["#d8ecff", "#eef5ff", "#f8fbff"]} style={styles.bg}>
      <View style={styles.blob1} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
              <Text style={styles.backText}>‹ Volver</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Logo size="medium" />
            <Text style={styles.title}>Verifica tu correo</Text>
            <Text style={styles.subtitle}>
              Te enviamos un código de 6 dígitos a{"\n"}
              <Text style={styles.mailText}>{mail}</Text>
            </Text>

            <View style={styles.codeRow}>
              {digits.map((d, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (inputs.current[i] = r)}
                  style={[styles.digitBox, d && styles.digitBoxFilled]}
                  value={d}
                  onChangeText={(v) => handleDigit(i, v)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            {apiError ? <Text style={styles.error}>{apiError}</Text> : null}
            {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

            <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendBtn}>
              <Text style={styles.resendText}>
                {resending ? "Reenviando..." : "Reenviar código"}
              </Text>
            </TouchableOpacity>

            <CustomButton label="Verificar" onPress={handleVerify} loading={loading} />
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
  header: { marginBottom: 16 },
  backText: { color: "#38b6ff", fontSize: 16, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    gap: 16,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#0f5fa6", marginTop: 4 },
  subtitle: { color: "#666", fontSize: 14, textAlign: "center", lineHeight: 22 },
  mailText: { color: "#38b6ff", fontWeight: "700" },
  codeRow: { flexDirection: "row", gap: 10, marginVertical: 8 },
  digitBox: {
    width: 44,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#d8e2ec",
    borderRadius: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#0f5fa6",
    backgroundColor: "#fafcff",
  },
  digitBoxFilled: { borderColor: "#38b6ff", backgroundColor: "#eef7ff" },
  error: { color: "#e74c3c", fontSize: 13, textAlign: "center" },
  success: { color: "#27ae60", fontSize: 13, textAlign: "center" },
  resendBtn: { marginTop: -4 },
  resendText: { color: "#38b6ff", fontSize: 13, fontWeight: "600" },
  blob1: {
    position: "absolute", width: 260, height: 260, borderRadius: 130,
    backgroundColor: "rgba(56,182,255,0.08)", top: -80, right: -60,
  },
});
