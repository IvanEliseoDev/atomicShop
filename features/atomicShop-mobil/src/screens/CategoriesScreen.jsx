import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Modal, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductCard from "../components/Products/ProductCard";
import { useCart } from "../hooks/useCart";
import { apiFetch } from "../config/api";

const SORT_OPTIONS = [
  { value: "relevance",  label: "Relevancia" },
  { value: "price_asc",  label: "Precio: Menor a Mayor" },
  { value: "price_desc", label: "Precio: Mayor a Menor" },
];

function FilterDropdown({ visible, title, options, selectedValue, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.modalOption, opt.value === selectedValue && styles.modalOptionSelected]}
                onPress={() => { onSelect(opt.value); onClose(); }}
              >
                <Text style={[styles.modalOptionText, opt.value === selectedValue && styles.modalOptionTextSelected]}>
                  {opt.label}
                </Text>
                {opt.value === selectedValue && <Ionicons name="checkmark" size={18} color="#38b6ff" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function CategoriesScreen({ navigation, route }) {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [categoryId, setCategoryId] = useState(route.params?.categoryId ?? "Todas");

  // Si se navega aquí desde otra pestaña (p. ej. tocando una categoría en el Dashboard)
  // con una categoría específica, sincronizarla — incluso si esta pantalla ya estaba montada
  useEffect(() => {
    if (route.params?.categoryId) {
      setCategoryId(route.params.categoryId);
      navigation.setParams({ categoryId: undefined });
    }
  }, [route.params?.categoryId, navigation]);
  const [brandId, setBrandId] = useState("Todas");
  const [sortBy, setSortBy] = useState("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);

  // Cargar categorías y marcas una sola vez
  useEffect(() => {
    apiFetch("/api/e-commerce/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
    apiFetch("/api/e-commerce/brands")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      if (minPrice.trim()) params.append("minPrice", minPrice.trim());
      if (maxPrice.trim()) params.append("maxPrice", maxPrice.trim());
      if (brandId !== "Todas") params.append("brandId", brandId);
      if (categoryId !== "Todas") params.append("categoryId", categoryId);
      if (sortBy !== "relevance") params.append("sort", sortBy);

      const res = await apiFetch(`/api/e-commerce/products/shop?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products ?? []);
      }
    } catch (_) {}
    finally { setLoadingProducts(false); }
  }, [categoryId, brandId, sortBy, minPrice, maxPrice]);

  // Debounce para no spamear la API mientras el usuario escribe el rango de precio
  useEffect(() => {
    const id = setTimeout(fetchProducts, 400);
    return () => clearTimeout(id);
  }, [fetchProducts]);

  const brandOptions = [{ value: "Todas", label: "Todas" }, ...brands.map((b) => ({ value: b._id, label: b.name }))];
  const selectedBrandLabel = brandOptions.find((b) => b.value === brandId)?.label ?? "Todas";
  const selectedSortLabel = SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? "Relevancia";

  const pairs = [];
  for (let i = 0; i < products.length; i += 2) pairs.push(products.slice(i, i + 2));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categorías</Text>
        <Ionicons name="cube-outline" size={22} color="#0f5fa6" />
      </View>

      {/* Chips de categorías */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        style={styles.chipsScroll}
      >
        <TouchableOpacity
          style={[styles.chip, categoryId === "Todas" && styles.chipActive]}
          onPress={() => setCategoryId("Todas")}
        >
          <Text style={[styles.chipText, categoryId === "Todas" && styles.chipTextActive]} numberOfLines={1}>Todas</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            style={[styles.chip, categoryId === cat._id && styles.chipActive]}
            onPress={() => setCategoryId(cat._id)}
          >
            <Text style={[styles.chipText, categoryId === cat._id && styles.chipTextActive]} numberOfLines={1}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Barra de filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}
      >
        <View style={styles.priceFilter}>
          <Text style={styles.priceLabel}>$</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Mín"
            placeholderTextColor="#aab"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <Text style={styles.priceDash}>—</Text>
          <Text style={styles.priceLabel}>$</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Máx"
            placeholderTextColor="#aab"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={() => setBrandModalOpen(true)}>
          <Text style={styles.filterBtnText} numberOfLines={1}>Marca: {selectedBrandLabel}</Text>
          <Ionicons name="chevron-down" size={14} color="#0f5fa6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn} onPress={() => setSortModalOpen(true)}>
          <Text style={styles.filterBtnText} numberOfLines={1}>{selectedSortLabel}</Text>
          <Ionicons name="chevron-down" size={14} color="#0f5fa6" />
        </TouchableOpacity>
      </ScrollView>

      {/* Grid de productos */}
      {loadingProducts ? (
        <ActivityIndicator color="#38b6ff" size="large" style={styles.loader} />
      ) : products.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={60} color="#c8d8e8" />
          <Text style={styles.emptyText}>No se encontraron productos con los filtros seleccionados</Text>
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

      <FilterDropdown
        visible={brandModalOpen}
        title="Selecciona una marca"
        options={brandOptions}
        selectedValue={brandId}
        onSelect={setBrandId}
        onClose={() => setBrandModalOpen(false)}
      />
      <FilterDropdown
        visible={sortModalOpen}
        title="Ordenar por"
        options={SORT_OPTIONS}
        selectedValue={sortBy}
        onSelect={setSortBy}
        onClose={() => setSortModalOpen(false)}
      />
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

  chipsScroll: { backgroundColor: "#fff", flexGrow: 0 },
  chipsRow: { paddingHorizontal: 12, paddingVertical: 12, gap: 8, alignItems: "center" },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#eef4fb",
    borderWidth: 1,
    borderColor: "#dce8f5",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: "#38b6ff", borderColor: "#38b6ff" },
  chipText: { fontSize: 13, lineHeight: 18, fontWeight: "600", color: "#0f5fa6" },
  chipTextActive: { color: "#fff" },

  filtersScroll: { backgroundColor: "#fff", flexGrow: 0, borderBottomWidth: 1, borderBottomColor: "#eee" },
  filtersRow: { paddingHorizontal: 12, paddingBottom: 12, gap: 10, alignItems: "center" },
  priceFilter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f6fb",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
    gap: 4,
  },
  priceLabel: { color: "#888", fontSize: 12 },
  priceInput: { width: 44, fontSize: 12, color: "#333", padding: 0 },
  priceDash: { color: "#bbb", fontSize: 12, marginHorizontal: 2 },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eef4fb",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
    maxWidth: 170,
  },
  filterBtnText: { fontSize: 12, fontWeight: "600", color: "#0f5fa6" },

  loader: { marginTop: 60 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 14, paddingHorizontal: 32 },
  emptyText: { color: "#aaa", fontSize: 14, textAlign: "center" },
  grid: { paddingHorizontal: 11, paddingTop: 8 },
  gridRow: { flexDirection: "row" },
  emptyCell: { flex: 1, margin: 5 },

  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#0f5fa6", marginBottom: 12 },
  modalOption: {
    paddingVertical: 14, paddingHorizontal: 8, flexDirection: "row",
    justifyContent: "space-between", alignItems: "center",
    borderBottomWidth: 1, borderBottomColor: "#f0f0f0",
  },
  modalOptionSelected: { backgroundColor: "#eef7ff" },
  modalOptionText: { fontSize: 14, color: "#333" },
  modalOptionTextSelected: { color: "#38b6ff", fontWeight: "700" },
});
