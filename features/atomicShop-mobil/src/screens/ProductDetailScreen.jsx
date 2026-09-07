import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, Dimensions, FlatList, Image,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductCard from "../components/Products/ProductCard";
import CustomButton from "../components/Buttons/CustomButton";
import { useCart } from "../hooks/useCart";
import { apiFetch } from "../config/api";

const { width: SCREEN_W } = Dimensions.get("window");

function CollapsibleSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={colStyles.wrapper}>
      <TouchableOpacity style={colStyles.header} onPress={() => setOpen((o) => !o)} activeOpacity={0.8}>
        <Text style={colStyles.title}>{title}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color="#666" />
      </TouchableOpacity>
      {open && <View style={colStyles.body}>{children}</View>}
    </View>
  );
}
const colStyles = StyleSheet.create({
  wrapper: { borderTopWidth: 1, borderTopColor: "#eee" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: { fontSize: 15, fontWeight: "600", color: "#333" },
  body: { paddingHorizontal: 16, paddingBottom: 16 },
});

export default function ProductDetailScreen({ navigation, route }) {
  const { productId } = route.params ?? {};
  const { addToCart } = useCart();

  const [product, setProduct]   = useState(null);
  const [similar, setSimilar]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding]     = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const flatRef = useRef(null);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const res = await apiFetch(`/api/e-commerce/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          const prod = data.product ?? data;
          setProduct(prod);
          // Fetch similar products
          if (prod.category?._id || prod.categoryId) {
            const catId = prod.category?._id ?? prod.categoryId;
            const simRes = await apiFetch(
              `/api/e-commerce/products/similar?categoryId=${catId}&currentId=${productId}`
            );
            if (simRes.ok) {
              const simData = await simRes.json();
              setSimilar(Array.isArray(simData) ? simData : simData.products ?? []);
            }
          }
        }
      } catch (_) {}
      finally { setLoading(false); }
    })();
  }, [productId]);

  async function handleAddToCart() {
    if (!product) return;
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#38b6ff" size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
      </View>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images : [null];
  const hasDiscount = product.discount && product.discount > 0;
  const finalPrice = hasDiscount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0f5fa6" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.heartBtn}>
          <Ionicons name="heart-outline" size={22} color="#38b6ff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carrusel de imágenes */}
        <View style={styles.carousel}>
          <FlatList
            ref={flatRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
              setImgIndex(idx);
            }}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) =>
              item ? (
                <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="contain" />
              ) : (
                <View style={[styles.carouselImage, styles.imagePlaceholder]}>
                  <Ionicons name="cube-outline" size={80} color="#c8d8e8" />
                </View>
              )
            }
          />
          {/* Puntos indicadores */}
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, i === imgIndex && styles.dotActive]} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.details}>
          {/* Tags */}
          <View style={styles.tagsRow}>
            {product.sku && <View style={styles.tag}><Text style={styles.tagText}>Sku: {product.sku}</Text></View>}
            {product.brand?.name && <View style={styles.tag}><Text style={styles.tagText}>Marca: {product.brand.name}</Text></View>}
            {product.category?.name && <View style={styles.tag}><Text style={styles.tagText}>Categoría: {product.category.name}</Text></View>}
          </View>

          {/* Nombre */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Precio */}
          <View style={styles.priceRow}>
            <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
            )}
          </View>

          {/* Selector de cantidad */}
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Ionicons name="remove" size={18} color="#0f5fa6" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Ionicons name="add" size={18} color="#0f5fa6" />
            </TouchableOpacity>
          </View>

          <CustomButton
            label="Agregar al carrito"
            onPress={handleAddToCart}
            loading={adding}
          />

          {/* Secciones colapsables */}
          <View style={styles.sections}>
            <CollapsibleSection title="Características">
              <Text style={styles.sectionBody}>
                {product.description ?? "Sin descripción disponible."}
              </Text>
            </CollapsibleSection>
            <CollapsibleSection title="Pago y envío">
              {/* TODO: backend endpoint pendiente para info de envío */}
              <Text style={styles.sectionBody}>
                Aceptamos tarjetas de crédito, débito y pago en efectivo. El tiempo de entrega puede variar según la logística especializada requerida.
              </Text>
            </CollapsibleSection>
            <CollapsibleSection title="Reseñas">
              {/* TODO: backend endpoint pendiente para reseñas de productos */}
              <Text style={styles.sectionBody}>Aún no hay reseñas para este producto.</Text>
            </CollapsibleSection>
          </View>

          {/* Recomendaciones */}
          {similar.length > 0 && (
            <View style={styles.recomendaciones}>
              <Text style={styles.recomTitle}>Recomendaciones</Text>
              <View style={styles.gridRow}>
                {similar.slice(0, 4).map((p, i) => (
                  <ProductCard
                    key={p._id ?? i}
                    product={p}
                    onPress={() => navigation.replace("ProductDetail", { productId: p._id })}
                    onAddToCart={() => addToCart(p._id, 1)}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#999", fontSize: 16 },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  backBtn: { padding: 4 },
  heartBtn: { padding: 4 },
  carousel: { position: "relative" },
  carouselImage: { width: SCREEN_W, height: 280, backgroundColor: "#f8f8f8" },
  imagePlaceholder: { justifyContent: "center", alignItems: "center" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#d8e2ec" },
  dotActive: { backgroundColor: "#38b6ff", width: 18 },
  details: { paddingTop: 16 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  tag: { backgroundColor: "#eef4fb", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: "#0f5fa6", fontSize: 12, fontWeight: "600" },
  productName: { fontSize: 20, fontWeight: "800", color: "#111", paddingHorizontal: 16, marginBottom: 10 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  finalPrice: { color: "#0f5fa6", fontSize: 26, fontWeight: "800" },
  originalPrice: { color: "#bbb", fontSize: 16, textDecorationLine: "line-through" },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 14,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#0f5fa6",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { fontSize: 18, fontWeight: "700", color: "#0f5fa6", minWidth: 30, textAlign: "center" },
  sections: { marginTop: 20 },
  sectionBody: { color: "#555", fontSize: 14, lineHeight: 22 },
  recomendaciones: { padding: 16 },
  recomTitle: { fontSize: 18, fontWeight: "800", color: "#0f5fa6", marginBottom: 12 },
  gridRow: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -5 },
});
