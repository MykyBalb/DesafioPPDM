import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GalleryProvider } from "./Components/GalleryProvider";
import Camera from "./Screens/Camera";
import Gallery from "./Screens/Gallery";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <GalleryProvider>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Camera"
        >
          <Stack.Screen name="Camera" component={Camera} />
          <Stack.Screen name="Gallery" component={Gallery} />
        </Stack.Navigator>
      </GalleryProvider>
    </NavigationContainer>
  );
}
