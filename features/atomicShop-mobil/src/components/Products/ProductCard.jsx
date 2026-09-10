import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFavorites } from "../../hooks/useFavorites";

export default function ProductCard({ product, onPress, onAddToCart }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { name, price, discount, images } = product;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price - (price * discount) / 100 : price;
  const imageUri = Array.isArray(images) && images[0] ? images[0] : null;
  const favorited = isFavorite(product?._id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <TouchableOpacity
        style={styles.heartBtn}
        activeOpacity={0.7}
        onPress={() => toggleFavorite(product)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={favorited ? "heart" : "heart-outline"}
          size={18}
          color="#38b6ff"
        />
      </TouchableOpacity>

      {hasDiscount && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Oferta</Text>
        </View>
      )}

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="cube-outline" size={36} color="#c8d8e8" />
        </View>
      )}

      <Text style={styles.name} numberOfLines={2}>{name}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
        {hasDiscount && (
          <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={onAddToCart} activeOpacity={0.8}>
        <Ionicons name="cart-outline" size={13} color="#fff" />
        <Text style={styles.addBtnText}>Agregar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    flex: 1,
    margin: 5,
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#38b6ff",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  image: {
    width: "100%",
    height: 110,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  imagePlaceholder: {
    backgroundColor: "#eef4fb",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
    minHeight: 32,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  finalPrice: { color: "#0f5fa6", fontWeight: "800", fontSize: 14 },
  originalPrice: {
    color: "#bbb",
    fontSize: 11,
    textDecorationLine: "line-through",
  },
  addBtn: {
    backgroundColor: "#38b6ff",
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  addBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
