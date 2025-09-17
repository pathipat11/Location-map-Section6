import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedPlace } from "../types/place";

const STORAGE_KEY = "SAVED_PLACES";

export async function savePlacesToStorage(places: SavedPlace[]) {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(places));
    } catch (error) {
        console.error("Failed to save places:", error);
    }
}

export async function loadPlacesFromStorage(): Promise<SavedPlace[]> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Failed to load places:", error);
        return [];
    }
}
