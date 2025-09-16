import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedPlace } from "../types/place";

export const savePlacesToStorage = async (places: SavedPlace[]) => {
    await AsyncStorage.setItem("places", JSON.stringify(places));
};

export const loadPlacesFromStorage = async (): Promise<SavedPlace[]> => {
    const saved = await AsyncStorage.getItem("places");
    return saved ? JSON.parse(saved) : [];
};
