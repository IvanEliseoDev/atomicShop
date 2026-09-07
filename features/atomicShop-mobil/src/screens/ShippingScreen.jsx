import { useState } from "react";
import {
  KeyboardAvoidingView, Modal, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import InputText from "../components/Inputs/InputText";
import CustomButton from "../components/Buttons/CustomButton";
import { DEPARTMENTS, MUNICIPALITIES } from "../config/locations";

function DropdownModal({ visible, options, selected, onSelect, onClose, title }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={modal.overlay} onPress={onClose} activeOpacity={1}>
        <View style={modal.sheet}>
          <Text style={modal.title}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[modal.option, opt === selected && modal.optionSelected]}
                onPress={() => { onSelect(opt); onClose(); }}
              >
                <Text style={[modal.optionText, opt === selected && modal.optionTextSelected]}>
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

const modal = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  title: { fontSize: 16, fontWeight: "800", color: "#0f5fa6", marginBottom: 12 },
  option: { paddingVertical: 14, paddingHorizontal: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  optionSelected: { backgroundColor: "#eef7ff" },
  optionText: { fontSize: 14, color: "#333" },
  optionTextSelected: { color: "#38b6ff", fontWeight: "700" },
});

export default function ShippingScreen({ navigation }) {
  const [direction, setDirection] = useState("");
  const [department, setDepartment] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [errors, setErrors] = useState({});

  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [munModalOpen, setMunModalOpen] = useState(false);

  const municipalities = department ? MUNICIPALITIES[department] ?? [] : [];

  function validate() {
    const e = {};
    if (!direction.trim()) e.direction = "La dirección es requerida";
    if (!department) e.department = "Selecciona un departamento";
    if (!municipality) e.municipality = "Selecciona un municipio";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    navigation.navigate("Payment", {
      deliveryData: {
        direccion: direction.trim(),
        departamento: department,
        municipio: municipality,
        fechaEntrega: deliveryDate.trim() || undefined,
      },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0f5fa6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Datos de envío</Text>
        <Ionicons name="car-outline" size={22} color="#0f5fa6" />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <InputText
            placeholder="*Dirección"
            value={direction}
            onChangeText={setDirection}
            error={errors.direction}
          />

          {/* Departamento */}
          <TouchableOpacity
            style={[styles.dropdownBtn, errors.department && styles.dropdownError]}
            onPress={() => setDeptModalOpen(true)}
          >
            <Text style={[styles.dropdownText, !department && styles.placeholder]}>
              {department || "*Departamento"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#888" />
          </TouchableOpacity>
          {errors.department ? <Text style={styles.errText}>{errors.department}</Text> : null}

          {/* Municipio */}
          <TouchableOpacity
            style={[styles.dropdownBtn, errors.municipality && styles.dropdownError, !department && styles.dropdownDisabled]}
            onPress={() => { if (department) setMunModalOpen(true); }}
          >
            <Text style={[styles.dropdownText, !municipality && styles.placeholder]}>
              {municipality || "*Municipio"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#888" />
          </TouchableOpacity>
          {errors.municipality ? <Text style={styles.errText}>{errors.municipality}</Text> : null}

          {/* Fecha de entrega (opcional) */}
          <InputText
            placeholder="Fecha de entrega (Opcional) — DD/MM/AAAA"
            value={deliveryDate}
            onChangeText={setDeliveryDate}
            keyboardType="numeric"
          />

          <CustomButton label="Siguiente" onPress={handleNext} style={styles.btn} />
        </ScrollView>
      </KeyboardAvoidingView>

      <DropdownModal
        visible={deptModalOpen}
        title="Selecciona departamento"
        options={DEPARTMENTS}
        selected={department}
        onSelect={(v) => { setDepartment(v); setMunicipality(""); }}
        onClose={() => setDeptModalOpen(false)}
      />
      <DropdownModal
        visible={munModalOpen}
        title="Selecciona municipio"
        options={municipalities}
        selected={municipality}
        onSelect={setMunicipality}
        onClose={() => setMunModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f6fb" },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0f5fa6" },
  scroll: { padding: 20 },
  dropdownBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8e2ec",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: "#fafcff",
    marginBottom: 12,
  },
  dropdownError: { borderColor: "#e74c3c" },
  dropdownDisabled: { opacity: 0.5 },
  dropdownText: { fontSize: 14, color: "#222" },
  placeholder: { color: "#aab" },
  errText: { color: "#e74c3c", fontSize: 11, marginTop: -8, marginBottom: 12, marginLeft: 4 },
  btn: { marginTop: 16 },
});
