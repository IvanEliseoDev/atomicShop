import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function InputPassword({ placeholder = "Contraseña", value, onChangeText, error, style }) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[styles.row, error && styles.rowError]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#aab"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoComplete="password"
        />
        <TouchableOpacity onPress={() => setVisible((v) => !v)} style={styles.eyeBtn} activeOpacity={0.7}>
          <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={20} color="#888" />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8e2ec",
    borderRadius: 10,
    backgroundColor: "#fafcff",
    paddingHorizontal: 14,
  },
  rowError: { borderColor: "#e74c3c" },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: "#222",
  },
  eyeBtn: { padding: 4 },
  errorText: {
    color: "#e74c3c",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
});
