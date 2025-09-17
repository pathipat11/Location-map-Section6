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
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
            <Text style={styles.emptyText}>No saved places yet.</Text>
            }
            renderItem={({ item }) => (
            <View style={styles.placeItem}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => onFocus(item)}>
                <Text style={styles.placeTitle}>{item.title}</Text>
                <Text style={styles.placeDesc} numberOfLines={1}>
                    {item.description}
                </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(item)}>
                <Text style={styles.editText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(item.id)}>
                <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
            </View>
            )}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        position: "absolute",
        bottom: 0,
        // width: "100%",
        left: 10,
        right: 10,
        maxHeight: 200,
        backgroundColor: "#fff",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
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
    actionBtn: { paddingHorizontal: 6 },
    editText: { fontSize: 18, color: "green" },
    deleteText: { fontSize: 18, color: "red" },
    emptyText: {
        textAlign: "center",
        color: "#999",
        marginTop: 20,
        fontStyle: "italic",
    },
});
