# 🗺️ Location-map-Section6

A modern location-based application built using **React Native** and **Expo** with **TypeScript**.
This app allows users to **view their current location on a map**, **store location history locally**, and **display saved markers** for easy navigation.

## ✨ Features

* 📍 **Real-time Location**: Fetch and display user's current location using `expo-location`
* 🗺️ **Interactive Map**: Display maps with markers powered by `react-native-maps`
* 📝 **Location History**: Save visited locations with `AsyncStorage`
* 🔎 **Marker Preview**: Display stored locations as markers on the map
* 📱 **Mobile Optimized** for smooth usage across devices

## 🎬 Demo Video

Here is a quick GIF showing the app's interface and interactions:

<img src="assets/videos/demo-app-location.gif" alt="App Demo" width="250" />

*Replace `assets/videos/demo-app-location.gif` with your GIF file path.*

## 🛠️ Tech Stack

* React Native
* Expo
* TypeScript
* Expo Location (`expo-location`)
* React Native Maps (`react-native-maps`)
* Async Storage (`@react-native-async-storage/async-storage`)
* React Native Vector Icons

## 🚀 Getting Started

### Prerequisites

* Node.js
* Expo CLI (`npm install -g expo-cli`)

### Create Project

Create a new Expo project using the **blank TypeScript template**:

```bash
npx create-expo-app@latest location-map --template blank-typescript
```

### Install Required Libraries

To use location services, maps, and local storage, install:

```bash
cd location-map
npx expo install expo-location react-native-maps @react-native-async-storage/async-storage
```

> Using `npx expo install` ensures compatibility with your Expo SDK version.

### Running the App

```bash
npx expo start
```

Then scan the QR code with **Expo Go** or use an emulator.

## 🔄 Project Structure

```
location-map/
├── assets/
│   └── videos/
│       └── demo-app-location.gif   # Demo GIF
├── components/                     # Optional UI components
│   └── EditModal.tsx
│   └── MapComponent.tsx
│   └── PlaceList.tsx
│   └── PlaceModal.tsx
│   └── SearchBar.tsx
├── services/
│   └── location.ts
│   └── storage.ts
├── types/
│   └── place.ts
├── utils/
│   └── storage.ts
├── App.tsx                         # Main App file
├── index.ts
├── package.json
└── README.md
```

## 🧩 Example Code

Here’s a short example of how the app uses **expo-location** and **react-native-maps**:

```tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let current = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 13.7563,
          longitude: location?.longitude || 100.5018,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {location && <Marker coordinate={location} title="You are here" />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
```

## 👤 Author

**Pathipat Mattra**

* 🌐 Facebook: [Pathipat Mattra](https://facebook.com/pathipat.mattra)
* 💻 GitHub: [pathipat11](https://github.com/pathipat11)
* 💼 LinkedIn: [Pathipat Mattra](https://linkedin.com/in/viixl)

---

Crafted with ❤️ for the course *Hybrid Mobile Application Programming* (**IN405109**)
**Computer Science, Khon Kaen University**
