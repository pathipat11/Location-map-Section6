import * as Location from "expo-location";

export async function requestLocationPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
}

export async function getCurrentLocation() {
    const currentLocation = await Location.getCurrentPositionAsync({});
    return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
    };
}
