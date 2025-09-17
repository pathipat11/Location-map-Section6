import React, { useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { ALL_THAI_PROVINCES } from "../constants/provinces";

type SearchBarProps = {
    onSelect: (coords: { latitude: number; longitude: number }, name: string) => void;
    style?: ViewStyle;
};

export default function SearchBar({ onSelect }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length < 1) {
        setResults([]);
        return;
    }
    const filtered = ALL_THAI_PROVINCES.filter((place) =>
        place.name.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
    };

    const handleSelect = (coords: { latitude: number; longitude: number }, name: string) => {
        onSelect(coords, name);
        setQuery(name);
        setResults([]);
    };
    
    // const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // 🔑 ใส่ API Key ของ Google Cloud
    // // เปิดใช้งาน Places API และ Geocoding API ใน Google Cloud Console ก่อนนะครับ

    // const handleSearch = async (text: string) => {
    //     setQuery(text);
    //     if (text.length < 3) {
    //     setResults([]);
    //     return;
    //     }

    //     try {
    //     const response = await fetch(
    //         `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    //         text
    //         )}&key=${GOOGLE_API_KEY}&language=th`
    //     );
    //     const json = await response.json();

    //     if (json.predictions) {
    //         setResults(json.predictions);
    //     }
    //     } catch (error) {
    //     console.log("Search error:", error);
    //     }
    // };

    // const handleSelect = async (placeId: string, description: string) => {
    //     try {
    //     const response = await fetch(
    //         `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
    //     );
    //     const json = await response.json();
    //     const loc = json.result.geometry.location;

    //     onSelect({ latitude: loc.lat, longitude: loc.lng }, description);
    //     setQuery(description);
    //     setResults([]);
    //     } catch (error) {
    //     console.log("Place detail error:", error);
    //     }
    // };

    return (
        <View style={styles.container}>
        <TextInput
            placeholder="🔍 Search location..."
            value={query}
            onChangeText={handleSearch}
            style={styles.input}
        />
        <FlatList
            data={results}
            // keyExtractor={(item) => item.place_id}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
            <TouchableOpacity
                style={styles.item}
                // onPress={() => handleSelect(item.place_id, item.description)}
                onPress={() => handleSelect(item.coords, item.name)}
            >
                {/* <Text style={styles.text}>{item.description}</Text> */}
                <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
            )}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: "#fff", padding: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        marginBottom: 5,
    },
    item: { padding: 8, borderBottomWidth: 0.5, borderColor: "#ddd" },
    text: { fontSize: 14 },
});
