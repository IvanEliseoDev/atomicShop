import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView, Modal, Platform, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import InputText from "../Inputs/InputText";
import CustomButton from "../Buttons/CustomButton";
import { DEPARTMENTS, MUNICIPALITIES } from "../../config/locations";
import DropdownModal from "./DropdownModal";

const DUI_REGEX = /^\d{8}-\d$/;

/**
 * Hoja para editar nombre, teléfono, DUI, dirección, departamento y municipio.
 * `initial` trae los datos actuales del perfil; `onSave` recibe el objeto con los campos editados.
 */
export default function EditProfileModal({ visible, initial, onClose, onSave, saving }) {
  const [name, setName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dui, setDui] = useState("");
  const [direction, setDirection] = useState("");
  const [department, setDepartment] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [errors, setErrors] = useState({});
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [munModalOpen, setMunModalOpen] = useState(false);

  useEffect(() => {
    if (visible && initial) {
      setName(initial.name ?? "");
      setTelephone(initial.telephone ?? "");
      setDui(initial.dui ?? "");
      setDirection(initial.direction ?? "");
      setDepartment(initial.deparmet ?? "");
      setMunicipality(initial.municipality ?? "");
      setErrors({});
    }
  }, [visible, initial]);

  const municipalities = department ? MUNICIPALITIES[department] ?? [] : [];

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "El nombre es requerido";
    if (dui.trim() && !DUI_REGEX.test(dui.trim())) e.dui = "Formato inválido (########-#)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      telephone: telephone.trim(),
      dui: dui.trim(),
      direction: direction.trim(),
      deparmet: department,
      municipality,
    });
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Text style={styles.title}>Editar perfil</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color="#888" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <InputText placeholder="Nombre completo" value={name} onChangeText={setName} error={errors.name} />
              <InputText
                placeholder="Teléfono"
                value={telephone}
                onChangeText={setTelephone}
                keyboardType="phone-pad"
              />
              <InputText
                placeholder="DUI (########-#)"
                value={dui}
                onChangeText={setDui}
                error={errors.dui}
                keyboardType="numeric"
                maxLength={10}
              />
              <InputText placeholder="Dirección" value={direction} onChangeText={setDirection} />

              <TouchableOpacity style={styles.dropdownBtn} onPress={() => setDeptModalOpen(true)}>
                <Text style={[styles.dropdownText, !department && styles.placeholder]}>
                  {department || "Departamento"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#888" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dropdownBtn, !department && styles.dropdownDisabled]}
                onPress={() => { if (department) setMunModalOpen(true); }}
              >
                <Text style={[styles.dropdownText, !municipality && styles.placeholder]}>
                  {municipality || "Municipio"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#888" />
              </TouchableOpacity>

              <CustomButton label="Guardar cambios" onPress={handleSave} loading={saving} style={{ marginTop: 8, marginBottom: 20 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>

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
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  flex: { width: "100%" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "88%",
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 16, fontWeight: "800", color: "#0f5fa6" },
  dropdownBtn: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderWidth: 1, borderColor: "#d8e2ec", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13,
    backgroundColor: "#fafcff", marginBottom: 12,
  },
  dropdownDisabled: { opacity: 0.5 },
  dropdownText: { fontSize: 14, color: "#222" },
  placeholder: { color: "#aab" },
});
