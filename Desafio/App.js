import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useEffect } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionMessage, setPermissionMessage] = useState("");
  useEffect(() => {
    if (permission) {
      if (permission.granted) {
        setPermissionMessage("Permissão concedida!");
      } else {
        setPermissionMessage("Permissão recusada.");
      }
    }
  }, [permission]);
  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        {" "}
        <Text style={styles.message}>
          {" "}
          Nós precisamos da sua permissão para mostrar a câmera.{" "}
        </Text>{" "}
        <Button onPress={requestPermission} title="Conceder permissão" />{" "}
        <Text style={styles.errorMessage}>{permissionMessage}</Text>{" "}
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  return (
    <View style={styles.container}>
      {" "}
      <CameraView style={styles.camera} facing={facing}>
        {" "}
        <View style={styles.buttonContainer}>
          {" "}
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            {" "}
            <Text style={styles.text}>Virar Câmera</Text>{" "}
          </TouchableOpacity>{" "}
        </View>{" "}
      </CameraView>{" "}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  message: { textAlign: "center", paddingBottom: 10 },
  errorMessage: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: { flex: 1, alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", color: "white" },
});
