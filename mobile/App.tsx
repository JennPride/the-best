import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { styles } from "./styles";
import {
  HomeScreen,
  MapSearchScreen,
  RateRestaurantScreen,
} from "./screens";

type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  DishSearch: undefined;
  RateRestaurant: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// IMPORTANT: for a real device, localhost is your PHONE, not your laptop.
// Set EXPO_PUBLIC_API_URL in a .env file or your shell to something like:
//   http://192.168.x.x:3000
// which is your computer's LAN IP.
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

type Mode = "register" | "login";

function AuthScreen({ navigation }: any) {
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const rawText = await response.text();
      let data: { token?: string; access_token?: string; error?: string; message?: string } = {};
      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        const message =
          data.error ?? data.message ?? rawText ?? "Something went wrong";
        Alert.alert("Error", String(message));
        return;
      }

      const token = data.token ?? data.access_token;
      if (token) {
        setLoading(false);
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        }, 0);
        return;
      }

      Alert.alert(
        "Unexpected response",
        rawText
          ? `Server returned 200 but no token in body: ${rawText.slice(0, 100)}`
          : "Server returned 200 with an empty body."
      );
    } catch (error) {
      Alert.alert(
        "Network error",
        "Check that the API is running and API_URL is reachable from your device."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          {mode === "register"
            ? "Create an account to get started."
            : "Log in to continue."}
        </Text>

        <View style={styles.toggleRow}>
          <Button
            title="Create account"
            onPress={() => setMode("register")}
            disabled={loading || mode === "register"}
          />
          <Button
            title="Log in"
            onPress={() => setMode("login")}
            disabled={loading || mode === "login"}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min 8 chars)"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.submitRow}>
          <Button
            title={
              loading
                ? "Submitting..."
                : mode === "register"
                ? "Create account"
                : "Log in"
            }
            onPress={handleSubmit}
            disabled={loading}
          />
          {loading && <ActivityIndicator style={{ marginLeft: 8 }} />}
        </View>

        <Text style={styles.hint}>
          API URL:{" "}
          <Text style={styles.hintBold}>{API_URL}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="DishSearch"
          component={MapSearchScreen}
          options={{ title: "Search" }}
        />
        <Stack.Screen
          name="RateRestaurant"
          component={RateRestaurantScreen}
          options={{ title: "Rate" }}
        />
      </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
