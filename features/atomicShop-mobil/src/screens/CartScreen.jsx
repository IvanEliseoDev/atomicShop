import {
  ActivityIndicator, Image, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../components/Buttons/CustomButton";
import { useCart } from "../hooks/useCart";
import { useNavigation } from "@react-navigation/native";

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const product = item.idProduct ?? {};
  const { name, price, discount, images } = product;
  const hasDiscount = discount > 0;
  const unitPrice = hasDiscount ? price - (price * discount) / 100 : price;
  const imageUri = Array.isArray(images) && images[0] ? images[0] : null;

  return (
    <View style={styles.cartItem}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.itemImage} resizeMode="contain" />
      ) : (
        <View style={[styles.itemImage, styles.imagePlaceholder]}>
          <Ionicons name="cube-outline" size={28} color="#c8d8e8" />
        </View>
      )}

      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{name ?? "Producto"}</Text>
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>${unitPrice?.toFixed(2)}</Text>
          {hasDiscount && (
            <Text style={styles.itemOriginalPrice}>${price?.toFixed(2)}</Text>
          )}
        </View>

        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
            <Ionicons name="remove" size={16} color="#0f5fa6" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.amount ?? 1}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
            <Ionicons name="add" size={16} color="#0f5fa6" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
}

export default function CartScreen() {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const navigation = useNavigation();

  const products = cart?.products ?? [];
  const isEmpty = products.length === 0;

  // Calcular totales desde los datos del carrito
  const totals = products.reduce(
    (acc, item) => {
      const p = item.idProduct ?? {};
      const price = p.price ?? 0;
      const discount = p.discount ?? 0;
      const qty = item.amount ?? 0;
      const discountAmt = (price * discount) / 100;
      acc.subtotal += price * qty;
      acc.discount += discountAmt * qty;
      return acc;
    },
    { subtotal: 0, discount: 0 }
  );
  const total = totals.subtotal - totals.discount;

  function handleIncrease(item) {
    const idProduct = item.idProduct?._id ?? item.idProduct;
    addToCart(idProduct, 1);
  }

  function handleDecrease(item) {
    const idProduct = item.idProduct?._id ?? item.idProduct;
    const newQty = (item.amount ?? 1) - 1;
    updateQuantity(idProduct, newQty);
  }

  function handleRemove(item) {
    const idProduct = item.idProduct?._id ?? item.idProduct;
    removeFromCart(idProduct);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrito de compras</Text>
        <Ionicons name="bag-outline" size={24} color="#0f5fa6" />
      </View>

      {isEmpty ? (
        /* Estado vacío */
        <View style={styles.emptyState}>
          <Ionicons name="bag-remove-outline" size={90} color="#c8d8e8" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>Tu carrito no tiene ningún producto</Text>
          <CustomButton
            label="Regresar a la tienda"
            onPress={() => navigation.getParent()?.navigate("Inicio")}
            style={styles.emptyBtn}
          />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {products.map((item, idx) => (
              <CartItem
                key={item.idProduct?._id ?? idx}
                item={item}
                onIncrease={() => handleIncrease(item)}
                onDecrease={() => handleDecrease(item)}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </ScrollView>

          {/* Totales y botón */}
          <View style={styles.footer}>
            <View style={styles.totalsRow}>
              <View style={styles.totalChip}>
                <Text style={styles.totalChipLabel}>Total descuento</Text>
                <Text style={styles.totalChipValue}>${totals.discount.toFixed(2)}</Text>
              </View>
              <View style={[styles.totalChip, styles.totalChipBlue]}>
                <Text style={[styles.totalChipLabel, { color: "#fff" }]}>Total a pagar</Text>
                <Text style={[styles.totalChipValue, { color: "#fff" }]}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <CustomButton
              label="Finalizar compra"
              onPress={() => navigation.navigate("Shipping")}
              disabled={isEmpty}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f6fb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0f5fa6" },
  list: { padding: 16, gap: 12 },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  itemImage: { width: 72, height: 72, borderRadius: 10, backgroundColor: "#f0f4f8" },
  imagePlaceholder: { justifyContent: "center", alignItems: "center" },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 13, fontWeight: "600", color: "#222" },
  itemPriceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  itemPrice: { color: "#0f5fa6", fontWeight: "800", fontSize: 15 },
  itemOriginalPrice: { color: "#bbb", fontSize: 12, textDecorationLine: "line-through" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1.5, borderColor: "#0f5fa6",
    justifyContent: "center", alignItems: "center",
  },
  qtyText: { fontSize: 15, fontWeight: "700", color: "#0f5fa6", minWidth: 24, textAlign: "center" },
  removeBtn: { padding: 6 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: "#555" },
  emptySubtitle: { color: "#aaa", fontSize: 14 },
  emptyBtn: { width: "100%", marginTop: 8 },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 14,
  },
  totalsRow: { flexDirection: "row", gap: 12 },
  totalChip: {
    flex: 1,
    backgroundColor: "#f0f6fb",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  totalChipBlue: { backgroundColor: "#38b6ff" },
  totalChipLabel: { fontSize: 11, color: "#666", fontWeight: "600" },
  totalChipValue: { fontSize: 16, fontWeight: "800", color: "#0f5fa6", marginTop: 2 },
});
