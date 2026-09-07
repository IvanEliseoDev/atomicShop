import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductCard from "../components/Products/ProductCard";
import { useCart } from "../hooks/useCart";
import { apiFetch } from "../config/api";

export default function SearchResultsScreen({ navigation, route }) {
  const { query: initialQuery } = route.params ?? {};
  const { addToCart } = useCart();

  const [query, setQuery]       = useState(initialQuery ?? "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [total, setTotal]       = useState(0);

  const search = useCallback(async (q) => {
    if (!q?.trim()) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/api/e-commerce/products/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products ?? [];
        setProducts(list);
        setTotal(data.total ?? list.length);
      }
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { search(initialQuery); }, [search, initialQuery]);

  function handleSubmit() { search(query); }

  const pairs = [];
  for (let i = 0; i < products.length; i += 2) pairs.push(products.slice(i, i + 2));

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0f5fa6" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            placeholder="Buscar producto"
            placeholderTextColor="#aab"
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} style={styles.clearBtn}>
              <Ionicons name="close" size={16} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Encabezado de resultados */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          Productos para:{" "}
          <Text style={styles.queryText}>{initialQuery}</Text>
        </Text>
        {!loading && (
          <Text style={styles.countText}>{total} {total === 1 ? "producto" : "productos"}</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color="#38b6ff" size="large" style={styles.loader} />
      ) : products.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={60} color="#c8d8e8" />
          <Text style={styles.emptyText}>Sin resultados para "{initialQuery}"</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {pairs.map((pair, idx) => (
            <View key={idx} style={styles.gridRow}>
              {pair.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onPress={() => navigation.navigate("ProductDetail", { productId: p._id })}
                  onAddToCart={() => addToCart(p._id, 1)}
                />
              ))}
              {pair.length === 1 && <View style={styles.emptyCell} />}
            </View>
          ))}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f6fb" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  backBtn: { padding: 4 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f6fb",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  clearBtn: { padding: 2 },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  resultsTitle: { fontSize: 14, color: "#555" },
  queryText: { color: "#38b6ff", fontWeight: "700" },
  countText: { color: "#999", fontSize: 12, marginTop: 2 },
  loader: { marginTop: 60 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 14 },
  emptyText: { color: "#aaa", fontSize: 15, textAlign: "center", paddingHorizontal: 32 },
  grid: { paddingHorizontal: 11, paddingTop: 8 },
  gridRow: { flexDirection: "row" },
  emptyCell: { flex: 1, margin: 5 },
});
