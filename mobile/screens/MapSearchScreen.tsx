import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPlacesApiKey, searchPlaces, type PlaceResult } from "../lib/places";
import { mapSearchStyles as styles } from "../styles";

const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export function MapSearchScreen() {
  const apiKey = getPlacesApiKey();
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const requestLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Location",
        "Permission denied. Search will not use your location."
      );
      return;
    }
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setUserLocation(coords);
    setRegion((r) => ({
      ...r,
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }));
  }, []);

  const handleSearch = useCallback(async () => {
    if (!apiKey) {
      Alert.alert(
        "API key missing",
        "Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env or your shell, then enable Places API (New) and Maps SDK in Google Cloud Console."
      );
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      const textQuery = query.trim()
        ? `${query.trim()}`
        : "restaurants nearby";
      const results = await searchPlaces(
        textQuery,
        apiKey,
        userLocation ?? undefined
      );
      setPlaces(results);
      if (results.length > 0) {
        const first = results[0];
        setRegion((r) => ({
          ...r,
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }));
      }
    } catch (e) {
      Alert.alert(
        "Search failed",
        e instanceof Error ? e.message : "Could not search for restaurants."
      );
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey, query, userLocation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Dish + city (e.g. pizza in Austin, sushi downtown)"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={requestLocation}
      >
        <Text style={styles.myLocationButtonText}>Use my location</Text>
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={!!userLocation}
          showsMyLocationButton={false}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              description={place.address}
            />
          ))}
        </MapView>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          {places.length > 0
            ? `${places.length} restaurant${places.length === 1 ? "" : "s"}`
            : "Search for restaurants above"}
        </Text>
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemName}>{item.name}</Text>
              <Text style={styles.listItemAddress} numberOfLines={2}>
                {item.address}
              </Text>
            </View>
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}
