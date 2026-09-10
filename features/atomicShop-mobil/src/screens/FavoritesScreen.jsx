import { useCallback } from "react";
import {
  ActivityIndicator, RefreshControl, ScrollView,
  StyleSheet, Text, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductCard from "../components/Products/ProductCard";
import CustomButton from "../components/Buttons/CustomButton";
import { useCart } from "../hooks/useCart";
import { useFavorites } from "../hooks/useFavorites";

export default function FavoritesScreen({ navigation }) {
  const { addToCart } = useCart();
  const { favorites, loading, refreshFavorites } = useFavorites();

  const onRefresh = useCallback(async () => {
    await refreshFavorites();
  }, [refreshFavorites]);

  const isEmpty = !loading && favorites.length === 0;

  const pairs = [];
  for (let i = 0; i < favorites.length; i += 2) {
    pairs.push(favorites.slice(i, i + 2));
  }

  function goToProduct(product) {
    navigation.navigate("ProductDetail", { productId: product._id });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <Ionicons name="heart-outline" size={24} color="#0f5fa6" />
      </View>

      {loading && favorites.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#38b6ff" size="large" />
        </View>
      ) : isEmpty ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={90} color="#c8d8e8" />
          <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
          <Text style={styles.emptySubtitle}>
            Toca el corazón en un producto para guardarlo aquí
          </Text>
          <CustomButton
            label="Ir a la tienda"
            onPress={() => navigation.getParent()?.navigate("Inicio")}
            style={styles.emptyBtn}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#38b6ff" />
          }
        >
          {favorites.length > 0 && (
            <Text style={styles.countText}>
              {favorites.length} {favorites.length === 1 ? "producto guardado" : "productos guardados"}
            </Text>
          )}
          {pairs.map((pair, idx) => (
            <View key={idx} style={styles.gridRow}>
              {pair.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onPress={() => goToProduct(p)}
                  onAddToCart={() => addToCart(p._id, 1)}
                />
              ))}
              {pair.length === 1 && <View style={styles.emptyCell} />}
            </View>
          ))}
          <View style={styles.bottomPad} />
        </ScrollView>
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: "#555" },
  emptySubtitle: { color: "#aaa", fontSize: 14, textAlign: "center", lineHeight: 20 },
  emptyBtn: { width: "100%", marginTop: 8 },
  grid: { paddingHorizontal: 11, paddingTop: 12 },
  countText: {
    color: "#888",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 5,
    marginBottom: 8,
  },
  gridRow: { flexDirection: "row" },
  emptyCell: { flex: 1, margin: 5 },
  bottomPad: { height: 24 },
});
