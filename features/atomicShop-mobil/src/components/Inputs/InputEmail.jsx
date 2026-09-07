import InputText from "./InputText";

export default function InputEmail(props) {
  return (
    <InputText
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      placeholder="Correo electrónico"
      {...props}
    />
  );
}
