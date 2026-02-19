const PLACES_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.location";

export type PlaceResult = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export function getPlacesApiKey(): string {
  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
}

export async function searchPlaces(
  textQuery: string,
  apiKey: string,
  location?: { latitude: number; longitude: number }
): Promise<PlaceResult[]> {
  const body: Record<string, unknown> = {
    textQuery: textQuery.trim() || "restaurants nearby",
    pageSize: 20,
  };
  if (location) {
    body.locationBias = {
      circle: { center: location, radius: 10000 },
    };
  }

  const res = await fetch(PLACES_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Places API error: ${res.status}`);
  }

  const data = (await res.json()) as {
    places?: Array<{
      id?: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      location?: { latitude?: number; longitude?: number };
    }>;
  };

  const places = data.places ?? [];
  return places
    .filter(
      (p) =>
        p.location?.latitude != null && p.location?.longitude != null
    )
    .map((p) => ({
      id: p.id ?? `${p.location!.latitude}-${p.location!.longitude}`,
      name: p.displayName?.text ?? "Unknown",
      address: p.formattedAddress ?? "",
      latitude: p.location!.latitude!,
      longitude: p.location!.longitude!,
    }));
}
