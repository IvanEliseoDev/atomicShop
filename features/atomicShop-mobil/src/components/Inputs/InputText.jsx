import { StyleSheet, Text, TextInput, View } from "react-native";

export default function InputText({ placeholder, value, onChangeText, error, style, ...rest }) {
  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor="#aab"
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#d8e2ec",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: "#222",
    backgroundColor: "#fafcff",
  },
  inputError: { borderColor: "#e74c3c" },
  errorText: {
    color: "#e74c3c",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
});
