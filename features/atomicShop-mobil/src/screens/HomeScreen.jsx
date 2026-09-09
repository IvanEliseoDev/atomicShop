import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, FlatList, Image, RefreshControl,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Logo from "../components/Logo";
import ProductCard from "../components/Products/ProductCard";
import { useCart } from "../hooks/useCart";
import { apiFetch } from "../config/api";

// Ícono aproximado según palabras clave en el nombre de la categoría (las categorías
// en sí vienen de la API — no hay un campo de ícono en el modelo del backend)
const ICON_KEYWORDS = [
  { keywords: ["báscul", "bascul", "peso", "pesa"], icon: "scale-outline" },
  { keywords: ["equip"],                            icon: "construct-outline" },
  { keywords: ["seguridad", "protec"],               icon: "shield-checkmark-outline" },
  { keywords: ["reactivo", "químic", "quimic"],      icon: "flask-outline" },
  { keywords: ["vidrio", "cristal"],                 icon: "wine-outline" },
];

function iconForCategory(name = "") {
  const lower = name.toLowerCase();
  const match = ICON_KEYWORDS.find((k) => k.keywords.some((kw) => lower.includes(kw)));
  return match?.icon ?? "cube-outline";
}

export default function HomeScreen({ navigation }) {
  const { addToCart } = useCart();
  const [banners, setBanners]   = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await apiFetch("/api/e-commerce/banners/banner-carousel");
      if (res.ok) setBanners(await res.json());
    } catch (_) {}
    finally { setLoadingBanners(false); }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await apiFetch("/api/e-commerce/products/home-carousel");
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products ?? []);
      }
    } catch (_) {}
    finally { setLoadingProducts(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiFetch("/api/e-commerce/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data.slice(0, 4) : []);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchBanners();
    fetchProducts();
    fetchCategories();
  }, [fetchBanners, fetchProducts, fetchCategories]);

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([fetchBanners(), fetchProducts(), fetchCategories()]);
    setRefreshing(false);
  }

  function goToCategory(cat) {
    navigation.getParent()?.navigate("Categorias", {
      screen: "CategoriesMain",
      params: { categoryId: cat._id },
    });
  }

  function handleSearch() {
    if (!query.trim()) return;
    navigation.navigate("SearchResults", { query: query.trim() });
    setQuery("");
  }

  function goToProduct(product) {
    navigation.navigate("ProductDetail", { productId: product._id });
  }

  // Renderizar grid de 2 columnas con FlatList
  const productPairs = [];
  for (let i = 0; i < products.length; i += 2) {
    productPairs.push(products.slice(i, i + 2));
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38b6ff" />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header con gradiente azul */}
      <LinearGradient colors={["#0f5fa6", "#1a7bc4", "#38b6ff"]} style={styles.header}>
        {/* Círculos decorativos */}
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />

        <View style={styles.headerContent}>
          <Logo size="small" light />

          {/* Barra de búsqueda */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar producto"
              placeholderTextColor="#aac"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {query.length > 0 ? (
              <TouchableOpacity onPress={() => setQuery("")} style={styles.searchIcon}>
                <Ionicons name="close" size={18} color="#888" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSearch} style={styles.searchIcon}>
                <Ionicons name="search" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Banners promocionales */}
      {loadingBanners ? (
        <ActivityIndicator color="#38b6ff" style={styles.loadingRow} />
      ) : banners.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannersRow}
          style={styles.bannersScroll}
        >
          {banners.map((b, i) => (
            <View key={b._id ?? i} style={styles.bannerCard}>
              {b.imageUrl ? (
                <Image source={{ uri: b.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
              ) : (
                <LinearGradient colors={["#0f5fa6", "#38b6ff"]} style={styles.bannerPlaceholder}>
                  <Text style={styles.bannerText}>{b.title ?? "Excelencia"}</Text>
                </LinearGradient>
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        /* Banners placeholder si la API no retorna datos */
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bannersRow} style={styles.bannersScroll}>
          {["Excelencia", "Excelencia"].map((txt, i) => (
            <View key={i} style={styles.bannerCard}>
              <LinearGradient colors={["#0f5fa6", "#38b6ff"]} style={styles.bannerPlaceholder}>
                <Text style={styles.bannerText}>{txt}</Text>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Categorías */}
      {categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categoriesRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat._id}
                style={styles.catItem}
                activeOpacity={0.8}
                onPress={() => goToCategory(cat)}
              >
                <View style={styles.catIcon}>
                  <Ionicons name={iconForCategory(cat.name)} size={26} color="#0f5fa6" />
                </View>
                <Text style={styles.catLabel} numberOfLines={2}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Lo más buscado */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lo más buscado</Text>

        {loadingProducts ? (
          <ActivityIndicator color="#38b6ff" style={styles.loadingRow} />
        ) : products.length === 0 ? (
          <Text style={styles.emptyText}>Sin productos disponibles</Text>
        ) : (
          productPairs.map((pair, idx) => (
            <View key={idx} style={styles.gridRow}>
              {pair.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onPress={() => goToProduct(p)}
                  onAddToCart={() => addToCart(p._id, 1)}
                />
              ))}
              {/* Celda vacía si hay número impar de productos */}
              {pair.length === 1 && <View style={styles.emptyCell} />}
            </View>
          ))
        )}
      </View>

      <View style={styles.bottomPad} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f6fb" },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    position: "relative",
    overflow: "hidden",
  },
  headerDecor1: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)", top: -60, right: -40,
  },
  headerDecor2: {
    position: "absolute", width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(92,225,230,0.1)", bottom: -30, left: -20,
  },
  headerContent: { gap: 14 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  searchIcon: { padding: 4 },
  bannersScroll: { marginTop: 16 },
  bannersRow: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  bannerCard: {
    width: 220,
    height: 110,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerImage: { width: "100%", height: "100%" },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  bannerText: { color: "#fff", fontSize: 20, fontWeight: "800", letterSpacing: 1 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f5fa6",
    marginBottom: 14,
  },
  categoriesRow: { flexDirection: "row", justifyContent: "space-between" },
  catItem: { alignItems: "center", width: "22%" },
  catIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e8f3fb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  catLabel: { fontSize: 10, color: "#444", fontWeight: "600", textAlign: "center" },
  loadingRow: { marginVertical: 24 },
  emptyText: { color: "#aaa", textAlign: "center", marginVertical: 20, fontSize: 14 },
  gridRow: { flexDirection: "row", marginHorizontal: -5 },
  emptyCell: { flex: 1, margin: 5 },
  bottomPad: { height: 24 },
});
