import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { SavedPlace } from "./types/place";
import { savePlacesToStorage, loadPlacesFromStorage } from "./utils/storage";

import MapComponent from "./components/MapComponent";
import PlaceList from "./components/PlaceList";
import PlaceModal from "./components/PlaceModal";
import EditModal from "./components/EditModal";

export default function App() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPlace, setEditPlace] = useState<SavedPlace | null>(null);

  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const saved = await loadPlacesFromStorage();
      setSavedPlaces(saved);
    })();
  }, []);

  const handleCenterLocation = () => {
    if (!location) return;
    mapRef.current?.animateToRegion(
      { ...location, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      1000
    );
  };

  const handleMapPress = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setSelectedCoords(coords);
    setNewTitle("");
    setNewDesc("");
    setModalVisible(true);
  };

  const confirmAddPlace = () => {
    if (!selectedCoords) return;
    const newPlace: SavedPlace = {
      id: Date.now().toString(),
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
      title: newTitle || "Untitled",
      description: newDesc || "",
    };
    const updated = [...savedPlaces, newPlace];
    setSavedPlaces(updated);
    savePlacesToStorage(updated);

    setNewTitle("");
    setNewDesc("");
    setSelectedCoords(null);
    setModalVisible(false);
  };

  const handleEditPlace = (place: SavedPlace) => {
    setEditPlace(place);
    setEditModalVisible(true);
  };

  const confirmEditPlace = (updatedPlace: SavedPlace) => {
    const updated = savedPlaces.map((p) => (p.id === updatedPlace.id ? updatedPlace : p));
    setSavedPlaces(updated);
    savePlacesToStorage(updated);
    setEditModalVisible(false);
  };

  const handleDeletePlace = (id: string) => {
    const updated = savedPlaces.filter((p) => p.id !== id);
    setSavedPlaces(updated);
    savePlacesToStorage(updated);
  };

  const handleFocusPlace = (place: SavedPlace) => {
    mapRef.current?.animateToRegion(
      { latitude: place.latitude, longitude: place.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      1000
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <MapComponent
        ref={mapRef}
        location={location}
        savedPlaces={savedPlaces}
        selectedCoords={selectedCoords}
        onMapPress={handleMapPress}
        onDragEnd={(coords) => setSelectedCoords(coords)}
        
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCenterLocation}>
          <Text style={styles.buttonText}>📍 My Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (location) setSelectedCoords(location);
            setNewTitle("");
            setNewDesc("");
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>➕ Save Place</Text>
        </TouchableOpacity>
      </View>

      <PlaceList
        places={savedPlaces}
        onFocus={handleFocusPlace}
        onEdit={handleEditPlace}
        onDelete={handleDeletePlace}
      />

      <PlaceModal
        visible={modalVisible}
        title={newTitle}
        desc={newDesc}
        setTitle={setNewTitle}
        setDesc={setNewDesc}
        setCoords={setSelectedCoords}
        onSave={confirmAddPlace}
        onCancel={() => setModalVisible(false)}
        initialCoords={selectedCoords}
      />

      <EditModal
        visible={editModalVisible}
        place={editPlace}
        setPlace={setEditPlace}
        onUpdate={confirmEditPlace}
        onCancel={() => setEditModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    flexDirection: "row",
  },
  button: { backgroundColor: "#1E90FF", padding: 10, borderRadius: 8, marginHorizontal: 5 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
