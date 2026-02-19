import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPlacesApiKey, searchPlaces, type PlaceResult } from "../lib/places";
import { rateRestaurantStyles as styles } from "../styles";

const DISH_OPTIONS = [
  "Burger",
  "Sushi",
  "Pizza",
  "Tacos",
  "Ramen",
  "Salad",
  "BBQ",
  "Thai",
  "Indian",
  "Other",
];

const STARS = [1, 2, 3, 4, 5];

export function RateRestaurantScreen() {
  const apiKey = getPlacesApiKey();
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [restaurantQuery, setRestaurantQuery] = useState("");
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ratingPlace, setRatingPlace] = useState<PlaceResult | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  const searchRestaurants = useCallback(async () => {
    if (!apiKey) {
      Alert.alert(
        "API key missing",
        "Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to search restaurants."
      );
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      const query = restaurantQuery.trim()
        ? `restaurant ${restaurantQuery.trim()}`
        : "restaurants nearby";
      const results = await searchPlaces(query, apiKey);
      setPlaces(results);
    } catch (e) {
      Alert.alert(
        "Search failed",
        e instanceof Error ? e.message : "Could not search."
      );
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey, restaurantQuery]);

  const openRating = (place: PlaceResult) => {
    setRatingPlace(place);
    setRating(null);
  };

  const submitRating = () => {
    if (!ratingPlace || rating === null) return;
    Alert.alert(
      "Rating saved",
      `You rated ${ratingPlace.name} ${rating} star${rating === 1 ? "" : "s"} for ${selectedDish ?? "this dish"}. (Saved locally for now.)`
    );
    setRatingPlace(null);
    setRating(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>1. Pick a dish type</Text>
        <View style={styles.chipRow}>
          {DISH_OPTIONS.map((dish) => (
            <TouchableOpacity
              key={dish}
              style={[
                styles.chip,
                selectedDish === dish && styles.chipSelected,
              ]}
              onPress={() => setSelectedDish(dish)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedDish === dish && styles.chipTextSelected,
                ]}
              >
                {dish}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>2. Search for the restaurant</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Restaurant name or area"
            placeholderTextColor="#888"
            value={restaurantQuery}
            onChangeText={setRestaurantQuery}
            onSubmitEditing={searchRestaurants}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchRestaurants}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>3. Choose & rate</Text>
        {places.length === 0 && !loading && (
          <Text style={styles.hint}>Search above to see restaurants.</Text>
        )}
        {places.map((place) => (
          <TouchableOpacity
            key={place.id}
            style={styles.placeCard}
            onPress={() => openRating(place)}
            activeOpacity={0.7}
          >
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeAddress} numberOfLines={1}>
              {place.address}
            </Text>
          </TouchableOpacity>
        ))}

        {ratingPlace && (
          <View style={styles.ratingCard}>
            <Text style={styles.ratingTitle}>
              Rate {ratingPlace.name} for {selectedDish ?? "this dish"}
            </Text>
            <View style={styles.starsRow}>
              {STARS.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setRating(s)}
                  style={styles.starButton}
                >
                  <Text style={styles.starText}>
                    {rating !== null && s <= rating ? "★" : "☆"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.ratingActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setRatingPlace(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  rating === null && styles.submitButtonDisabled,
                ]}
                onPress={submitRating}
                disabled={rating === null}
              >
                <Text style={styles.submitButtonText}>Submit rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
