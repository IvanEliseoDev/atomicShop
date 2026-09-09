import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, Image, RefreshControl,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";

import EditProfileModal from "../components/Profile/EditProfileModal";
import PurchaseCard from "../components/Profile/PurchaseCard";
import { apiFetch, getBaseUrl } from "../config/api";
import { useAuth } from "../hooks/useAuth";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const customerId = user?._id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!customerId) { setLoading(false); return; }
    try {
      const res = await apiFetch(`/api/e-commerce/profile/${customerId}`);
      if (res.ok) {
        const json = await res.json();
        setProfile(json.data ?? null);
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  async function onRefresh() {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }

  async function handleSaveProfile(fields) {
    if (!customerId) return;
    setSaving(true);
    try {
      const form = new FormData();
      Object.entries(fields).forEach(([key, value]) => form.append(key, value ?? ""));

      const res = await apiFetch(`/api/e-commerce/profile/update/${customerId}`, {
        method: "PUT",
        body: form,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message ?? "No se pudo actualizar el perfil");

      setProfile((prev) => ({ ...prev, ...json.data }));
      setEditVisible(false);
    } catch (err) {
      Alert.alert("Error", err.message ?? "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  }

  async function handlePickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tus fotos para cambiar tu imagen de perfil.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setUploadingPhoto(true);
    try {
      const uploadRes = await FileSystem.uploadAsync(
        `${getBaseUrl()}/api/e-commerce/profile/update/${customerId}`,
        asset.uri,
        {
          httpMethod: "PUT",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "image",
          mimeType: "image/jpeg",
        }
      );
      const json = JSON.parse(uploadRes.body || "{}");
      if (uploadRes.status < 200 || uploadRes.status >= 300) {
        throw new Error(json?.message ?? "No se pudo actualizar la foto");
      }

      setProfile((prev) => ({ ...prev, ...json.data }));
    } catch (err) {
      Alert.alert("Error", err.message ?? "No se pudo actualizar la foto");
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handleDeletePurchase(purchaseId) {
    Alert.alert("Eliminar factura", `¿Eliminar la factura ${purchaseId}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await apiFetch(`/api/e-commerce/profile/${customerId}/purchases/${purchaseId}`, {
              method: "DELETE",
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.message ?? "No se pudo eliminar la factura");
            setProfile((prev) => ({ ...prev, purchases: json.data ?? [] }));
          } catch (err) {
            Alert.alert("Error", err.message ?? "No se pudo eliminar la factura");
          }
        },
      },
    ]);
  }

  const locationLabel = [profile?.municipality, profile?.deparmet, "El Salvador"]
    .filter(Boolean)
    .join(", ");

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#38b6ff" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38b6ff" />}
      >
        {/* Header azul con avatar y nombre */}
        <View style={styles.header}>
          <View style={styles.headerDecor1} />
          <View style={styles.headerDecor2} />

          <View style={styles.headerContent}>
            <View style={styles.avatarWrap}>
              {profile?.image ? (
                <Image source={{ uri: profile.image }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={38} color="#c8d8e8" />
                </View>
              )}
              <TouchableOpacity style={styles.avatarEditBtn} onPress={handlePickImage} disabled={uploadingPhoto}>
                {uploadingPhoto ? (
                  <ActivityIndicator color="#0f5fa6" size="small" />
                ) : (
                  <Ionicons name="pencil" size={13} color="#0f5fa6" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.name} numberOfLines={2}>{profile?.name ?? "Cliente"}</Text>
            <TouchableOpacity style={styles.nameEditBtn} onPress={() => setEditVisible(true)}>
              <Ionicons name="pencil" size={14} color="#0f5fa6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjeta de datos de contacto */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={16} color="#0f5fa6" />
              <Text style={styles.infoText} numberOfLines={1}>{profile?.mail ?? "—"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={16} color="#0f5fa6" />
              <Text style={styles.infoText}>{profile?.telephone || "—"}</Text>
            </View>
            <TouchableOpacity onPress={() => setEditVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="pencil" size={15} color="#38b6ff" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="card-outline" size={16} color="#0f5fa6" />
              <Text style={styles.infoText}>{profile?.dui || "—"}</Text>
            </View>
            <TouchableOpacity onPress={() => setEditVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="pencil" size={15} color="#38b6ff" />
            </TouchableOpacity>

            <View style={[styles.infoItem, styles.infoItemLocation]}>
              <Ionicons name="location-outline" size={16} color="#0f5fa6" />
              <Text style={styles.infoText} numberOfLines={2}>{locationLabel || "Sin ubicación"}</Text>
            </View>
            <TouchableOpacity onPress={() => setEditVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="pencil" size={15} color="#38b6ff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Compras realizadas */}
        <Text style={styles.sectionTitle}>Compras realizadas</Text>

        <View style={styles.purchasesList}>
          {(profile?.purchases ?? []).length === 0 ? (
            <Text style={styles.emptyText}>Aún no tienes compras registradas</Text>
          ) : (
            profile.purchases.map((p) => (
              <PurchaseCard key={p.id} purchase={p} onDelete={handleDeletePurchase} />
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <View style={styles.bottomPad} />
      </ScrollView>

      <EditProfileModal
        visible={editVisible}
        initial={profile}
        saving={saving}
        onClose={() => setEditVisible(false)}
        onSave={handleSaveProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f6fb" },
  centered: { flex: 1, backgroundColor: "#f0f6fb", justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#38b6ff",
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  headerDecor1: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)", top: -70, right: -50,
  },
  headerDecor2: {
    position: "absolute", width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(15,95,166,0.12)", bottom: -40, left: -30,
  },
  headerContent: { flexDirection: "row", alignItems: "center" },
  avatarWrap: { position: "relative" },
  avatarImage: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: "#fff" },
  avatarPlaceholder: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  avatarEditBtn: {
    position: "absolute", bottom: -2, right: -2,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#e4ecf4",
  },
  name: { flex: 1, color: "#fff", fontSize: 19, fontWeight: "800", marginLeft: 14, marginRight: 8 },
  nameEditBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center", alignItems: "center",
  },

  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#0f5fa6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 14 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
  infoItemLocation: { flex: 1 },
  infoText: { fontSize: 13, color: "#333", fontWeight: "600", flexShrink: 1 },
  divider: { height: 1, backgroundColor: "#eef2f6" },

  sectionTitle: {
    fontSize: 16, fontWeight: "800", color: "#0f5fa6",
    textAlign: "center", marginTop: 26, marginBottom: 14,
  },
  purchasesList: { paddingHorizontal: 16, gap: 12 },
  emptyText: { color: "#aaa", textAlign: "center", fontSize: 13, marginTop: 8 },

  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 28, marginHorizontal: 16,
    paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: "#f3d3d3",
  },
  logoutText: { color: "#e74c3c", fontWeight: "700", fontSize: 14 },
  bottomPad: { height: 24 },
});