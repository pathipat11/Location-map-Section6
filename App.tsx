import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { SavedPlace } from "./types/place";
import { savePlacesToStorage, loadPlacesFromStorage } from "./services/storage";
import { requestLocationPermission, getCurrentLocation } from "./services/location";

import MapComponent from "./components/MapComponent";
import PlaceList from "./components/PlaceList";
import PlaceModal from "./components/PlaceModal";
import EditModal from "./components/EditModal";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPlace, setEditPlace] = useState<SavedPlace | null>(null);

  const [selectedCoords, setSelectedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchCoords, setSearchCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert("Permission denied", "Location access is required.");
        return;
      }

      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

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

  const confirmAddPlace = () => {
    if (!selectedCoords) return;

    Alert.alert(
      "Add New Place",
      `Do you want to add "${newTitle || "Untitled"}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
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

            Alert.alert("Success", `"${newPlace.title}" has been added!`);
          },
        },
      ]
    );
  };


  const handleEditPlace = (place: SavedPlace) => {
    setEditPlace(place);
    setEditModalVisible(true);
  };

  const confirmEditPlace = (updatedPlace: SavedPlace) => {
    Alert.alert(
      "Update Place",
      `Do you want to update "${updatedPlace.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const updated = savedPlaces.map((p) => (p.id === updatedPlace.id ? updatedPlace : p));
            setSavedPlaces(updated);
            savePlacesToStorage(updated);
            setEditModalVisible(false);

            Alert.alert("Success", `"${updatedPlace.title}" has been updated!`);
          },
        },
      ]
    );
  };

  const handleDeletePlace = (id: string) => {
    const place = savedPlaces.find(p => p.id === id);
    if (!place) return;

    Alert.alert(
      "Delete Place",
      `Are you sure you want to delete "${place.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updated = savedPlaces.filter((p) => p.id !== id);
            setSavedPlaces(updated);
            savePlacesToStorage(updated);
            Alert.alert("Deleted", `"${place.title}" has been deleted.`);
          },
        },
      ]
    );
  };

  const handleFocusPlace = (place: SavedPlace) => {
    mapRef.current?.animateToRegion(
      { latitude: place.latitude, longitude: place.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
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

  const handleSearchSelect = (coords: { latitude: number; longitude: number }, name: string) => {
    setSelectedCoords(coords);
    setNewTitle(name);
    setNewDesc("");
    setModalVisible(true);
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      1000
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerCard}>
        <Text style={styles.Header}>My Location Map</Text>
        <SearchBar onSelect={handleSearchSelect} />
      </View>
      <MapComponent
        ref={mapRef}
        location={location}
        savedPlaces={savedPlaces}
        selectedCoords={selectedCoords}
        onMapPress={handleMapPress}
        onDragEnd={(coords) => setSelectedCoords(coords)}
        onPressMarker={() => setModalVisible(true)}
      />

      {/* Floating My Location Button */}
      <TouchableOpacity style={styles.locationBtn} onPress={handleCenterLocation}>
        <Text style={styles.btnIcon}>📍</Text>
      </TouchableOpacity>

      {/* Floating Save Place Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (location) setSelectedCoords(location);
          setNewTitle("");
          setNewDesc("");
          setModalVisible(true);
        }}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Place List */}
      <PlaceList
        places={savedPlaces}
        onFocus={handleFocusPlace}
        onEdit={handleEditPlace}
        onDelete={handleDeletePlace}
      />

      {/* Add Modal */}
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

      {/* Edit Modal */}
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
  headerCard: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  Header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  fab: {
    position: "absolute",
    bottom: 210,
    right: 10,
    backgroundColor: "#FF5722",
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  fabText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  locationBtn: {
    position: "absolute",
    bottom: 210,
    right: 60,
    backgroundColor: "#1E90FF",
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  btnIcon: { color: "#fff", fontSize: 22 },
  SearchBar: { 
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    zIndex: 10
  }
});
