import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CustomButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
}) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "outline" && styles.outline,
        variant === "ghost" && styles.ghost,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#fff" : "#38b6ff"}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === "outline" && styles.outlineLabel,
            variant === "ghost" && styles.ghostLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#38b6ff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#38b6ff",
  },
  ghost: {
    backgroundColor: "transparent",
    marginTop: 0,
  },
  disabled: { opacity: 0.5 },
  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  outlineLabel: { color: "#38b6ff" },
  ghostLabel: { color: "#38b6ff", fontWeight: "600" },
});
