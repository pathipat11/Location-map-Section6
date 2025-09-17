import React, { forwardRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { SavedPlace } from "../types/place";

type MapComponentProps = {
    location: { latitude: number; longitude: number } | null;
    savedPlaces: SavedPlace[];
    selectedCoords?: { latitude: number; longitude: number } | null;
    onMapPress?: (e: any) => void;
    onDragEnd?: (coords: { latitude: number; longitude: number }) => void;
    onPressMarker?: () => void;
};

const MapComponent = forwardRef<MapView, MapComponentProps>(
    ({ location, savedPlaces, selectedCoords, onMapPress, onDragEnd, onPressMarker }, ref) => {
        return (
        <MapView
            ref={ref}
            style={{ flex: 1 }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            initialRegion={{
            latitude: location?.latitude || 13.7563,
            longitude: location?.longitude || 100.5018,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
            }}
            onPress={onMapPress}
        >
            {/* marker ของ places ที่บันทึกแล้ว */}
            {savedPlaces.map((place) => (
            <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.title}
                description={place.description}
                pinColor="blue"
            />
            ))}

            {/* marker ชั่วคราว สามารถลากได้ */}
            {selectedCoords && (
            <Marker
                coordinate={{
                latitude: selectedCoords.latitude,
                longitude: selectedCoords.longitude,
                }}
                title="Selected Location"
                pinColor="red"
                draggable
                onDragEnd={(e) => onDragEnd?.(e.nativeEvent.coordinate)}
                onPress={onPressMarker}
            />
            )}
        </MapView>
        );
    }
);

export default MapComponent;
