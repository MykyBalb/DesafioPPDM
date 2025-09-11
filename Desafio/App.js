// https://nominatim.openstreetmap.org/reverse?lat=-23.55052&lon=-46.633308&format=json

import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, Image, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [gallery, setGallery] = useState([]);
  const cameraRef = useRef(null);

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  }

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  async function takePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    getCurrentLocation();

    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;
    setGallery((prevPhotos) => {
      const newGallery = [...prevPhotos, photo.uri];
      console.log(newGallery);
      return newGallery;
    });
    const getLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          {
            headers: {
              "User-Agent": "ReactNativeApp",
              "Accept-Language": "pt-BR",
            },
          }
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
      }
    };
    const locationName = await getLocation();
    console.log(
      "Foto tirada em:",
      locationName.address.city_district +
        ", " +
        locationName.address.municipality +
        " - " +
        locationName.address.state
    );
  }
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      <View style={styles.buttonContainer}>
        <Icon
          onPress={toggleCameraFacing}
          name="flip-camera-ios"
          size={50}
          color="white"
        />
        <Icon onPress={takePicture} name="circle" size={70} color="white" />
        {gallery ? (
          <Image style={styles.prevPic} source={{ uri: gallery[gallery.length -1] }} />
        ) : (
          <Icon name="photo" size={50} color="white" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 30,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  errorMessage: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  prevPic: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
});
