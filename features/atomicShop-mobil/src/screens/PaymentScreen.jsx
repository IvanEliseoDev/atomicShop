import { useState } from "react";
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import InputText from "../components/Inputs/InputText";
import CustomButton from "../components/Buttons/CustomButton";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { apiFetch } from "../config/api";

const METHODS = [
  { key: "credito",  label: "Tarjeta de crédito" },
  { key: "debito",   label: "Tarjeta de débito" },
  { key: "efectivo", label: "En efectivo" },
];

const CARD_REGEX    = /^\d{16}$/;
const EXPIRY_REGEX  = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CVV_REGEX     = /^\d{3,4}$/;

export default function PaymentScreen({ navigation, route }) {
  const { deliveryData } = route.params ?? {};
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const [method, setMethod]   = useState("credito");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry]   = useState("");
  const [cvv, setCvv]         = useState("");
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  function formatCardNum(val) {
    return val.replace(/\D/g, "").slice(0, 16);
  }

  function formatExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  function validate() {
    if (method === "efectivo") return true;
    const e = {};
    if (!CARD_REGEX.test(cardNum.replace(/\s/g, ""))) e.cardNum = "Número de tarjeta inválido (16 dígitos)";
    if (!cardName.trim()) e.cardName = "El nombre es requerido";
    if (!EXPIRY_REGEX.test(expiry)) e.expiry = "Formato inválido (MM/AA)";
    else {
      const [mm, yy] = expiry.split("/").map(Number);
      const now = new Date();
      const expDate = new Date(2000 + yy, mm - 1);
      if (expDate < now) e.expiry = "Tarjeta vencida";
    }
    if (!CVV_REGEX.test(cvv)) e.cvv = "CVV inválido (3-4 dígitos)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleFinalize() {
    setApiError("");
    if (!validate()) return;
    if (!user?._id) { setApiError("Sesión no válida. Vuelve a iniciar sesión."); return; }
    if (!cart?.products?.length) { setApiError("El carrito está vacío."); return; }

    setLoading(true);
    try {
      const res = await apiFetch("/api/e-commerce/invoices", {
        method: "POST",
        body: JSON.stringify({
          customerId: user._id,
          deliveryData,
          paymentMethod: method,
          // TODO: Integración con Wompi pendiente — se envía null para pago en efectivo o prueba
          wompiTransactionId: null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message ?? "Error al procesar la compra");

      clearCart();
      navigation.navigate("OrderConfirmation");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0f5fa6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Datos de pago</Text>
        <Ionicons name="card-outline" size={22} color="#0f5fa6" />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Tabs de método */}
          <View style={styles.tabsContainer}>
            {METHODS.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[styles.tab, method === m.key && styles.tabActive]}
                onPress={() => { setMethod(m.key); setErrors({}); }}
              >
                <Text style={[styles.tabText, method === m.key && styles.tabTextActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {method !== "efectivo" ? (
            <View style={styles.cardForm}>
              <InputText
                placeholder="Número de la tarjeta"
                value={cardNum}
                onChangeText={(v) => setCardNum(formatCardNum(v))}
                error={errors.cardNum}
                keyboardType="numeric"
                maxLength={16}
              />
              <InputText
                placeholder="Nombre en la tarjeta"
                value={cardName}
                onChangeText={setCardName}
                error={errors.cardName}
                autoCapitalize="characters"
              />
              <View style={styles.cardRow}>
                <InputText
                  placeholder="Vigencia (MM/AA)"
                  value={expiry}
                  onChangeText={(v) => setExpiry(formatExpiry(v))}
                  error={errors.expiry}
                  keyboardType="numeric"
                  maxLength={5}
                  style={styles.halfInput}
                />
                <InputText
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))}
                  error={errors.cvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  style={styles.halfInput}
                />
              </View>
            </View>
          ) : (
            <View style={styles.cashMsg}>
              <Ionicons name="cash-outline" size={48} color="#38b6ff" />
              <Text style={styles.cashText}>
                Pagarás en efectivo al momento de recibir tu pedido.
              </Text>
            </View>
          )}

          {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

          <CustomButton
            label="Finalizar compra"
            onPress={handleFinalize}
            loading={loading}
            style={styles.btn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f6fb" },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0f5fa6" },
  scroll: { padding: 20 },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#e8f0f8",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#fff", shadowColor: "#0f5fa6", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 12, color: "#888", fontWeight: "600" },
  tabTextActive: { color: "#0f5fa6", fontWeight: "800" },
  cardForm: { gap: 0 },
  cardRow: { flexDirection: "row", gap: 12 },
  halfInput: { flex: 1 },
  cashMsg: { alignItems: "center", paddingVertical: 32, gap: 14 },
  cashText: { color: "#555", fontSize: 15, textAlign: "center", lineHeight: 24, paddingHorizontal: 16 },
  apiError: { color: "#e74c3c", fontSize: 13, textAlign: "center", marginBottom: 8 },
  btn: { marginTop: 16 },
});
