import React from "react";
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SavedPlace } from "../types/place";

type PlaceListProps = {
    places: SavedPlace[];
    onFocus: (place: SavedPlace) => void;
    onEdit: (place: SavedPlace) => void;
    onDelete: (id: string) => void;
};

export default function PlaceList({ places, onFocus, onEdit, onDelete }: PlaceListProps) {
    return (
        <View style={styles.listContainer}>
        <FlatList
            data={places}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <TouchableOpacity style={styles.placeItem} onPress={() => onFocus(item)}>
                <View style={{ flex: 1 }}>
                <Text style={styles.placeTitle}>{item.title}</Text>
                <Text style={styles.placeDesc}>{item.description}</Text>
                </View>
                <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => onEdit(item)}>
                <Text style={styles.editText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(item.id)}>
                <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
            </TouchableOpacity>
            )}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        maxHeight: 200,
        backgroundColor: "#fff",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 10,
    },
    placeItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
    },
    placeTitle: { fontWeight: "bold", fontSize: 16 },
    placeDesc: { color: "#555", fontSize: 12 },
    editText: { fontSize: 18, marginHorizontal: 5, color: "green" },
    deleteText: { fontSize: 18, marginLeft: 10, color: "red" },
});
