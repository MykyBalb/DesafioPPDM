import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useState, useRef, useContext, useEffect } from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { GalleryContext } from "../Components/GalleryProvider";

export default function CameraScreen() {
  const { gallery, setGallery } = useContext(GalleryContext);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const cameraRef = useRef(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return null;
    }
    return await Location.getCurrentPositionAsync({});
  }

  //guardar apenas latitude e longitude e requisitar a localização depois
  async function takePicture() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
      skipProcessing: true,
    });
    console.log('Taking picture...', photo);
    
    const loc = getCurrentLocation();
    if (!loc) return;
    setLocation(loc);

    const latitude = loc.coords.latitude;
    const longitude = loc.coords.longitude;

    const getLocationName = async () => {
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
        return await response.json();
      } catch (error) {
        console.error(error);
        return {};
      }
    };

    const locationName = await getLocationName();
    console.log("aoba")

    setGallery((prevPhotos) => [
      ...prevPhotos,
      {
        uri: photo.uri,
        latitude: latitude,
        longitude: longitude,
      },
    ]);
    console.log(gallery);
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const toGallery = () => {
    navigation.navigate("Gallery");
  };

  if (!permission) return <Text>Loading camera permissions...</Text>;

  return (
    <View style={styles.container}>
      {permission.granted && (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      )}
      <View style={styles.buttonContainer}>
        <Icon
          onPress={toggleCameraFacing}
          name="flip-camera-ios"
          size={50}
          color="white"
        />
        <Icon onPress={takePicture} name="circle" size={70} color="white" />
        {gallery.length > 0 ? (
          <Image
            onTouchEnd={toGallery}
            style={styles.prevPic}
            source={{ uri: gallery[gallery.length - 1].uri }}
          />
        ) : (
          <Icon onPress={toGallery} name="photo" size={50} color="white" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: { width: "100%", height: "80%" },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "20%",
    backgroundColor: "#000",
    paddingVertical: 30,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prevPic: { height: 50, width: 50, borderRadius: 10 },
});
