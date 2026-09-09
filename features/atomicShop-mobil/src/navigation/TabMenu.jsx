import { Platform, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import HomeStack from "./HomeStack";
import CartStack from "./CartStack";
import PlaceholderScreen from "../screens/PlaceholderScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useCart } from "../hooks/useCart";

const Tab = createBottomTabNavigator();
const ACTIVE = "#0f5fa6";
const INACTIVE = "#9d9fa1";

function CartBadge({ count }) {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? "99+" : String(count)}</Text>
    </View>
  );
}

export default function TabMenu() {
  const { itemCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: Platform.OS === "ios" ? 82 : 62,
          borderTopWidth: 1,
          borderTopColor: "#e4ecf4",
          paddingBottom: Platform.OS === "ios" ? 20 : 6,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const map = {
            Inicio:    focused ? "home"        : "home-outline",
            Favoritos: focused ? "heart"       : "heart-outline",
            Carrito:   focused ? "bag"         : "bag-outline",
            Categorias:focused ? "cube"        : "cube-outline",
            Perfil:    focused ? "person"      : "person-outline",
          };
          const iconName = map[route.name] ?? "ellipse-outline";

          if (route.name === "Carrito") {
            return (
              <View>
                <Ionicons name={iconName} color={color} size={size} />
                <CartBadge count={itemCount} />
              </View>
            );
          }
          return <Ionicons name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Inicio"     component={HomeStack}       options={{ title: "Inicio" }} />
      <Tab.Screen name="Favoritos"  component={PlaceholderScreen} options={{ title: "Favoritos" }} />
      <Tab.Screen name="Carrito"    component={CartStack}       options={{ title: "Carrito" }} />
      <Tab.Screen name="Categorias" component={PlaceholderScreen} options={{ title: "Categorías" }} />
      <Tab.Screen name="Perfil"     component={ProfileScreen}   options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "#38b6ff",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
});
