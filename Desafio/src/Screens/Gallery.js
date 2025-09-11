import { SafeAreaView, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useContext } from "react";
import { GalleryContext } from "../Components/GalleryProvider";

export default function Gallery() {
  const { gallery } = useContext(GalleryContext);

  return (
    <SafeAreaView style={styles.container}>
      {gallery.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma foto ainda 📷</Text>
        </View>
      ) : (
        <FlatList
          data={gallery}
          keyExtractor={(item) => item.uri}
          numColumns={3}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.image} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111", 
  },
  grid: {
    padding: 5,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#aaa",
  },
});
