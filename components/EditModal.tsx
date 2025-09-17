import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import SearchBar from "./SearchBar";
import { SavedPlace } from "../types/place";

type EditModalProps = {
    visible: boolean;
    place: SavedPlace | null;
    setPlace: (p: SavedPlace) => void;
    onUpdate: (updatedPlace: SavedPlace) => void;
    onCancel: () => void;
};

export default function EditModal({
    visible,
    place,
    setPlace,
    onUpdate,
    onCancel,
}: EditModalProps) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        if (place) {
        setTitle(place.title);
        setDesc(place.description);
        setCoords({ latitude: place.latitude, longitude: place.longitude });
        }
    }, [place]);

    if (!place) return null;

    const handleUpdate = () => {
        if (!coords) return;
        const updatedPlace: SavedPlace = {
        ...place,
        title,
        description: desc,
        latitude: coords.latitude,
        longitude: coords.longitude,
        };
        onUpdate(updatedPlace);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Place</Text>

            <SearchBar
                onSelect={(newCoords, name) => {
                setCoords(newCoords);
                setTitle(name);
                }}
            />

            <TextInput
                placeholder="Title"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                placeholder="Description"
                style={styles.input}
                value={desc}
                onChangeText={setDesc}
            />

            <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.buttonEdit, { flex: 1, marginRight: 5 }]} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { flex: 1, marginLeft: 5 }]} onPress={onCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            </View>
        </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { margin: 20, padding: 20, borderRadius: 10, backgroundColor: "#fff" },
    modalTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 5, borderRadius: 6 },
    modalButtons: { flexDirection: "row", marginTop: 10 },
    button: { backgroundColor: "#1E90FF", padding: 10, borderRadius: 8 },
    buttonEdit: { backgroundColor: "#f1b01aff", padding: 10, borderRadius: 8 },
    buttonText: { color: "#fff", textAlign: "center" },
});
