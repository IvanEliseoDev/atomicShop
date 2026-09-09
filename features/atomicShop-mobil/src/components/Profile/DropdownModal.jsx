import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Hoja inferior para elegir una opción de una lista (departamento, municipio, etc).
 */
export default function DropdownModal({ visible, options, selected, onSelect, onClose, title }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.option, opt === selected && styles.optionSelected]}
                onPress={() => { onSelect(opt); onClose(); }}
              >
                <Text style={[styles.optionText, opt === selected && styles.optionTextSelected]}>
                  {opt}
                </Text>
                {opt === selected && <Ionicons name="checkmark" size={18} color="#38b6ff" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  title: { fontSize: 16, fontWeight: "800", color: "#0f5fa6" },
  option: { paddingVertical: 14, paddingHorizontal: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  optionSelected: { backgroundColor: "#eef7ff" },
  optionText: { fontSize: 14, color: "#333" },
  optionTextSelected: { color: "#38b6ff", fontWeight: "700" },
});
