import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useFavorites } from "../hooks/useFavorites";
import { useSplashTimer } from "../hooks/useSplashTimer";

import SplashScreen from "../screens/SplashScreen";
import LoadingScreen from "../screens/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import VerifyRegisterScreen from "../screens/VerifyRegisterScreen";
import ForgotStep1Screen from "../screens/ForgotStep1Screen";
import ForgotStep2Screen from "../screens/ForgotStep2Screen";
import ForgotStep3Screen from "../screens/ForgotStep3Screen";
import ForgotStep4Screen from "../screens/ForgotStep4Screen";
import TabMenu from "./TabMenu";

export default function AppContent() {
  const { isAuthenticated, isBooting, user } = useAuth();
  const { initCart } = useCart();
  const { initFavorites } = useFavorites();
  const showSplash = useSplashTimer(isBooting);

  // Segunda pantalla de carga (criterio rúbrica #7 / #14)
  const [showLoader, setShowLoader] = useState(false);

  // Estado para el flujo de autenticación
  const [authView, setAuthView] = useState("login");
  const [pendingMail, setPendingMail] = useState(null);
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [recoveryMail, setRecoveryMail] = useState(null);

  useEffect(() => {
    if (!showSplash) {
      setShowLoader(true);
      const id = setTimeout(() => setShowLoader(false), 900);
      return () => clearTimeout(id);
    }
  }, [showSplash]);

  // Inicializar carrito y favoritos cuando el usuario se autentica y tiene _id
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      initCart(user._id);
      initFavorites(user._id);
    }
  }, [isAuthenticated, user, initCart, initFavorites]);

  if (showSplash) return <SplashScreen />;
  if (showLoader) return <LoadingScreen />;

  if (!isAuthenticated) {
    switch (authView) {
      case "register":
        return (
          <RegisterScreen
            onBack={() => setAuthView("login")}
            onNeedsVerification={(mail) => {
              setPendingMail(mail);
              setAuthView("verifyRegister");
            }}
          />
        );
      case "verifyRegister":
        return (
          <VerifyRegisterScreen
            mail={pendingMail}
            onBack={() => setAuthView("register")}
            onSuccess={() => setAuthView("login")}
          />
        );
      case "forgotStep1":
        return (
          <ForgotStep1Screen
            onBack={() => setAuthView("login")}
            onNext={(mail, token) => {
              setRecoveryMail(mail);
              setRecoveryToken(token);
              setAuthView("forgotStep2");
            }}
          />
        );
      case "forgotStep2":
        return (
          <ForgotStep2Screen
            mail={recoveryMail}
            recoveryToken={recoveryToken}
            onBack={() => setAuthView("forgotStep1")}
            onNext={(newToken) => {
              setRecoveryToken(newToken);
              setAuthView("forgotStep3");
            }}
          />
        );
      case "forgotStep3":
        return (
          <ForgotStep3Screen
            recoveryToken={recoveryToken}
            onBack={() => setAuthView("forgotStep2")}
            onSuccess={() => setAuthView("forgotStep4")}
          />
        );
      case "forgotStep4":
        return <ForgotStep4Screen onFinish={() => setAuthView("login")} />;
      default:
        return (
          <LoginScreen
            onRegister={() => setAuthView("register")}
            onForgot={() => setAuthView("forgotStep1")}
          />
        );
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <TabMenu />
        </NavigationContainer>
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f6fb" },
});
