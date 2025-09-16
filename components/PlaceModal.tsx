import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import SearchBar from "./SearchBar";

type PlaceModalProps = {
    visible: boolean;
    title: string;
    desc: string;
    setTitle: (t: string) => void;
    setDesc: (d: string) => void;
    setCoords: (coords: { latitude: number; longitude: number }) => void;
    onSave: () => void;
    onCancel: () => void;
    initialCoords: { latitude: number; longitude: number } | null;
};

export default function PlaceModal({
    visible,
    title,
    desc,
    setTitle,
    setDesc,
    setCoords,
    onSave,
    onCancel,
    initialCoords,
}: PlaceModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Place</Text>

            {/* SearchBar */}
            <SearchBar
                onSelect={(coords, name) => {
                setCoords(coords);
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
                <TouchableOpacity
                style={[styles.button, { flex: 1, marginRight: 5 }]}
                onPress={onSave}
                >
                <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.button, { flex: 1, marginLeft: 5 }]}
                onPress={onCancel}
                >
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
    buttonText: { color: "#fff", textAlign: "center" },
});
