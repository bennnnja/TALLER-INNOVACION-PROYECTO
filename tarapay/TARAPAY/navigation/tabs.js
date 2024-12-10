import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/Home";
import Scan from "../screens/Scan";
import Profile from "../screens/Profile";
import AgregarSaldo from "../screens/AgregarSaldo"; // Asegúrate de importar AgregarSaldo
import HistorialScreen from "../screens/HistorialScreen"; // Importa HistorialScreen
import { COLORS, icons } from "../constants";

const Tab = createBottomTabNavigator();

const CustomScanButton = ({ onPress }) => (
  <View style={styles.scanButtonWrapper}>
    <TouchableOpacity
      style={styles.scanButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={icons.scan} resizeMode="contain" style={styles.scanIcon} />
    </TouchableOpacity>
    <Text style={styles.scanLabel}>Pagar</Text>
  </View>
);

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image
                source={icons.more}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? COLORS.primary : COLORS.secondary,
                }}
              />
              <Text
                style={[styles.label, { color: focused ? COLORS.primary : COLORS.secondary }]}
              >
                Inicio
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarButton: (props) => <CustomScanButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image
                source={icons.user}
                resizeMode="contain"
                style={[
                  styles.tabIcon,
                  { tintColor: focused ? COLORS.primary : COLORS.secondary },
                ]}
              />
              <Text
                style={[styles.label, { color: focused ? COLORS.primary : COLORS.secondary }]}
              >
                Perfil
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
  },
  tabIcon: {
    width: 25,
    height: 25,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  scanButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -35,
    alignSelf: "center",
  },
  scanButton: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.primary,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scanIcon: {
    width: 35,
    height: 35,
    tintColor: COLORS.white,
  },
  scanLabel: {
    marginTop: 8,
    fontSize: 10,
    color: COLORS.primary,
  },
});

export default Tabs;
