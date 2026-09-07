import { StyleSheet, Text, View } from "react-native";

// Replica programática del logo AtomicShop usando círculos de React Native.
// No requiere archivo de imagen; escala perfectamente.
export default function Logo({ size = "medium", light = false }) {
  const scale = size === "large" ? 1.6 : size === "small" ? 0.65 : 1;
  const s = (n) => Math.round(n * scale);

  const primary = light ? "#ffffff" : "#0f5fa6";
  const secondary = light ? "#a8d8ff" : "#38b6ff";
  const accent = light ? "#adf0f2" : "#5ce1e6";
  const textPrimary = light ? "#ffffff" : "#0f5fa6";
  const textSecondary = light ? "#c8ecff" : "#38b6ff";

  return (
    <View style={styles.container}>
      {/* Grupo de burbujas */}
      <View style={{ width: s(58), height: s(58), position: "relative" }}>
        {/* Círculo grande azul oscuro */}
        <View style={[styles.abs, {
          width: s(34), height: s(34),
          borderRadius: s(17),
          backgroundColor: primary,
          bottom: 0, left: s(12),
        }]} />
        {/* Círculo mediano azul claro — superpuesto arriba-izq */}
        <View style={[styles.abs, {
          width: s(26), height: s(26),
          borderRadius: s(13),
          backgroundColor: secondary,
          top: s(6), left: 0,
        }]} />
        {/* Pequeños círculos cyan */}
        <View style={[styles.abs, {
          width: s(12), height: s(12),
          borderRadius: s(6),
          backgroundColor: accent,
          top: 0, right: s(2),
        }]} />
        <View style={[styles.abs, {
          width: s(9), height: s(9),
          borderRadius: s(5),
          backgroundColor: accent,
          top: s(14), right: 0,
        }]} />
        <View style={[styles.abs, {
          width: s(10), height: s(10),
          borderRadius: s(5),
          backgroundColor: accent,
          bottom: s(3), right: s(1),
        }]} />
      </View>

      {/* Texto */}
      <View style={styles.textBlock}>
        <Text style={[styles.atomic, { fontSize: s(15), color: textPrimary }]}>
          ATOMIC
        </Text>
        <Text style={[styles.shop, { fontSize: s(11), color: textSecondary }]}>
          shop
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  abs: { position: "absolute" },
  textBlock: { flexDirection: "column" },
  atomic: {
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  shop: {
    fontWeight: "600",
    letterSpacing: 1.5,
    marginTop: -2,
  },
});
