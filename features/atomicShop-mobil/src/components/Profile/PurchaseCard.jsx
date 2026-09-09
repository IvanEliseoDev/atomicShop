import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Tarjeta de una factura dentro de "Compras realizadas".
 * `onDelete(purchaseId)` se llama cuando el usuario confirma eliminarla.
 */
export default function PurchaseCard({ purchase, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleViewDetail() {
    setMenuOpen(false);
    const productos = purchase.productos ?? [];
    Alert.alert(
      `Factura ${purchase.id}`,
      productos.length
        ? productos.map((p) => `• ${p.idProduct}  x${p.qty}`).join("\n")
        : "Sin productos registrados"
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Factura</Text>
          <Text style={styles.invoice}>{purchase.id}</Text>
        </View>
        <View style={[styles.col, styles.colRight]}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.total}>${Number(purchase.total ?? 0).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Fecha <Text style={styles.value}>{purchase.date}</Text></Text>
      </View>

      <View style={[styles.row, styles.rowBottom]}>
        <Text style={styles.label}>Descuento <Text style={styles.value}>{purchase.discount ?? "0%"}</Text></Text>

        <View>
          <TouchableOpacity onPress={() => setMenuOpen((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="ellipsis-vertical" size={18} color="#888" />
          </TouchableOpacity>

          {menuOpen && (
            <View style={styles.menuPopup}>
              <TouchableOpacity style={styles.menuItem} onPress={handleViewDetail}>
                <Ionicons name="eye-outline" size={16} color="#333" />
                <Text style={styles.menuItemText}>Ver detalle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { setMenuOpen(false); onDelete(purchase.id); }}
              >
                <Ionicons name="trash-outline" size={16} color="#e74c3c" />
                <Text style={[styles.menuItemText, { color: "#e74c3c" }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 6,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowBottom: { marginTop: 2 },
  col: { gap: 2 },
  colRight: { alignItems: "flex-end" },
  label: { fontSize: 12, color: "#888", fontWeight: "600" },
  value: { color: "#444", fontWeight: "700" },
  invoice: { fontSize: 14, color: "#38b6ff", fontWeight: "800" },
  total: { fontSize: 14, color: "#38b6ff", fontWeight: "800" },

  menuPopup: {
    position: "absolute", right: 0, top: 22, zIndex: 10,
    backgroundColor: "#fff", borderRadius: 10, paddingVertical: 4,
    width: 150,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 6,
  },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 12 },
  menuItemText: { fontSize: 13, color: "#333", fontWeight: "600" },
});
