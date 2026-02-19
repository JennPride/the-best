import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { homeStyles as styles } from "../styles";

type HomeScreenProps = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.homeContent}>
        <Text style={styles.homeTitle}>Welcome back!</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("DishSearch")}
          activeOpacity={0.7}
        >
          <Text style={styles.optionCardTitle}>Search for a dish in a city</Text>
          <Text style={styles.optionCardDescription}>
            Find any dish (e.g. pizza, sushi, tacos) in a city or area. See results on a map.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("RateRestaurant")}
          activeOpacity={0.7}
        >
          <Text style={styles.optionCardTitle}>Rate a restaurant by dish</Text>
          <Text style={styles.optionCardDescription}>
            Pick a dish type (e.g. burger, sushi), choose a restaurant, and rate how good that dish is there.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
