import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";
import Nigeria_State_Cities from "./nigeria_state&cities";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

type NigeriaState = { name: string; cities: string[] };

const STATES = Nigeria_State_Cities as NigeriaState[];

const normalize = (s: string) => s.trim().toLowerCase();

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

export default function HomeScreen() {
  const inputRef = useRef<TextInput>(null);

  const viewHeight = 400;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const viewAnimated = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, viewHeight],
      [1, 0.3],
      "clamp",
    );
    const translateY = interpolate(
      scrollOffset.value,
      [0, viewHeight],
      [0, -40],
      "clamp",
    );
    return {
      transform: [
        {
          scale: interpolate(
            scrollOffset.value,
            [-viewHeight, 0, viewHeight],
            [1.25, 1, 0.7],
            "clamp",
          ),
        },
        { translateY },
      ],
      opacity,
    };
  });

  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedState, setSelectedState] = useState<NigeriaState | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [finalLocation, setFinalLocation] = useState<{
    state: string;
    city: string;
  } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  const mode: "state" | "city" | "done" =
    selectedState === null ? "state" : selectedCity === null ? "city" : "done";

  const cityQuery =
    mode === "city" && selectedState
      ? searchValue
          .replace(new RegExp(`^${selectedState.name}[,\\s]*`, "i"), "")
          .trim()
      : "";

  const results =
    mode === "state"
      ? STATES.filter((s) => normalize(s.name).includes(normalize(searchValue)))
      : mode === "city"
        ? selectedState!.cities.filter((c) =>
            normalize(c).includes(normalize(cityQuery)),
          )
        : [];

  const showResults =
    (mode === "state" && (isFocused || searchValue.trim().length > 0)) ||
    (mode === "city" && selectedState !== null);

  useEffect(() => {
    const fetchWeather = async (CITY: string, STATE: string) => {
      const state = normalize(STATE);
      const city = normalize(CITY);
      const query = `${city},${state}`;

      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
            query,
          )}&days=5`,
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Weather data:", data);
        setWeatherData(data);
      } catch {
        console.log("Failed to fetch weather data.");
      }
    };

    if (finalLocation) {
      fetchWeather(finalLocation.city, finalLocation.state);
    } else {
      console.log("No location selected yet.");
    }
  }, [finalLocation]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetPress = useCallback(() => {
    bottomSheetRef.current?.expand(); // Method to open the bottom sheet modal
    setOpenBottomSheet(true);
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close(); // Method to close the bottom sheet modal
    setOpenBottomSheet(false);
  }, []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const snapPoints = useMemo(() => ["25%"], []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient colors={["#202020", "#000000"]} style={styles.container}>
        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 2, paddingBottom: 10 }}
          ref={scrollRef}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: "#444444",
                borderRadius: 15,
                padding: 12,
                gap: 8,
              }}
            >
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search-icon lucide-search"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>

                <TextInput
                  ref={inputRef}
                  style={[
                    {
                      flex: 1,
                      padding: 3,
                      width: "100%",
                      height: "100%",
                      color: "#c8c8c8",
                      fontSize: 16,
                    },
                    Platform.OS === "web" &&
                      ({ outlineStyle: "none", outlineWidth: 0 } as any),
                  ]}
                  placeholder="Oyo, Ibadan"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    // Small delay so onPress on list items fires before hiding
                    setTimeout(() => setIsFocused(false), 300);
                  }}
                  onChangeText={(text) => {
                    setSearchValue(text);
                    if (
                      selectedState &&
                      !text
                        .toLowerCase()
                        .startsWith(selectedState.name.toLowerCase())
                    ) {
                      setSelectedState(null);
                      setSelectedCity(null);
                    }
                  }}
                  value={searchValue}
                />
              </View>
              <TouchableOpacity
                onPress={
                  openBottomSheet ? handleCloseModalPress : handleSheetPress
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-settings2-icon lucide-settings-2"
                >
                  <path d="M14 17H5" />
                  <path d="M19 7h-9" />
                  <circle cx="17" cy="17" r="3" />
                  <circle cx="7" cy="7" r="3" />
                </svg>
              </TouchableOpacity>
            </View>
            {showResults && (
              <View
                style={{
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: "#444",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <ScrollView
                  style={{ maxHeight: 290, zIndex: 30 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {results.map((item) => {
                    const label =
                      mode === "state"
                        ? (item as NigeriaState).name
                        : (item as string);
                    return (
                      <TouchableOpacity
                        key={label}
                        onPress={() => {
                          if (mode === "state") {
                            const picked = item as NigeriaState;
                            setSearchValue(`${picked.name}, `);
                            setSelectedState(picked);
                            inputRef.current?.focus();
                            console.log(`Selected state: ${picked.name}`); // Debug log
                            // now user starts typing city
                          } else {
                            const pickedCity = item as string;
                            setSelectedCity(pickedCity);

                            const saved = {
                              state: selectedState!.name,
                              city: pickedCity,
                            };
                            setFinalLocation(saved); // <-- final value saved in state
                            setSearchValue(`${saved.state}, ${saved.city}`);
                            setIsFocused(false); // close the list
                          }
                        }}
                        style={{
                          padding: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: "#222",
                        }}
                      >
                        <Text style={{ color: "#fff" }}>{label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
            <Animated.View
              style={[
                {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 32,
                  height: viewHeight,
                },
                viewAnimated,
              ]}
            >
              <View
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 42,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#c4c4c4",
                      fontSize: 20,
                      fontFamily: "Nunito-Regular",
                    }}
                  >
                    {weatherData?.current?.condition?.text || "Loading..."}
                  </Text>
                  <img
                    src={`${weatherData?.current?.condition?.icon}`}
                    alt={`${weatherData?.current?.condition?.text} icon`}
                    width={34}
                    height={34}
                    style={{ filter: "invert(100%)" }}
                  />
                </View>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 110,
                    fontWeight: "600",
                    fontFamily: "Nunito-ExtraBold",
                  }}
                >
                  {tempUnit === "C"
                    ? weatherData?.current?.temp_c != null
                      ? `${Math.round(weatherData.current.temp_c)}°`
                      : "--°"
                    : weatherData?.current?.temp_f != null
                      ? `${Math.round(weatherData.current.temp_f)}°`
                      : "--°"}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 32,
                  marginTop: 32,
                  gap: 4,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#c4c4c4",
                      fontSize: 20,
                      fontFamily: "Nunito-Regular",
                    }}
                  >
                    {weatherData?.forecast?.forecastday?.[0]?.hour?.[9]
                      ?.condition?.text !== null
                      ? "Morning"
                      : "Loading..."}
                  </Text>
                  <img
                    src={`${weatherData?.forecast?.forecastday?.[0]?.hour?.[8]?.condition?.icon}`}
                    alt={`${weatherData?.forecast?.forecastday?.[0]?.hour?.[8]?.condition?.text} icon`}
                    width={30}
                    height={30}
                    style={{ filter: "invert(100%)" }}
                  />
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 40,
                      fontWeight: "600",
                    }}
                  >
                    {tempUnit === "C"
                      ? weatherData?.forecast?.forecastday?.[0]?.hour?.[8]
                          ?.temp_c != null
                        ? `${Math.round(weatherData.forecast.forecastday[0].hour[8].temp_c)}°`
                        : "--°"
                      : weatherData?.forecast?.forecastday?.[0]?.hour?.[8]
                            ?.temp_f != null
                        ? `${Math.round(weatherData.forecast.forecastday[0].hour[8].temp_f)}°`
                        : "--°"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#c4c4c4",
                      fontSize: 20,
                      fontFamily: "Nunito-Regular",
                    }}
                  >
                    {weatherData?.forecast?.forecastday?.[0]?.hour?.[15]
                      ?.condition?.text !== null
                      ? "Afternoon"
                      : "Loading..."}
                  </Text>
                  <img
                    src={`${weatherData?.forecast?.forecastday?.[0]?.hour?.[15]?.condition?.icon}`}
                    alt={`${weatherData?.forecast?.forecastday?.[0]?.hour?.[15]?.condition?.text} icon`}
                    width={30}
                    height={30}
                    style={{ filter: "invert(100%)" }}
                  />

                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 40,
                      fontWeight: "600",
                    }}
                  >
                    {tempUnit === "C"
                      ? weatherData?.forecast?.forecastday?.[0]?.hour?.[15]
                          ?.temp_c != null
                        ? `${Math.round(weatherData.forecast.forecastday[0].hour[15].temp_c)}°`
                        : "--°"
                      : weatherData?.forecast?.forecastday?.[0]?.hour?.[15]
                            ?.temp_f != null
                        ? `${Math.round(weatherData.forecast.forecastday[0].hour[15].temp_f)}°`
                        : "--°"}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#c4c4c4",
                      fontSize: 20,
                      fontFamily: "Nunito-Regular",
                    }}
                  >
                    {weatherData?.forecast?.forecastday?.[0]?.hour?.[18]
                      ?.condition?.text !== null
                      ? "Evening"
                      : "Loading..."}
                  </Text>
                  <img
                    src={`${weatherData?.forecast?.forecastday?.[0]?.hour?.[18]?.condition?.icon}`}
                    alt={`${weatherData?.forecast?.forecastday?.[0]?.hour?.[18]?.condition?.text} icon`}
                    width={30}
                    height={30}
                    style={{ filter: "invert(100%)" }}
                  />
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 40,
                      fontWeight: "600",
                    }}
                  >
                    {tempUnit === "C"
                      ? weatherData?.forecast?.forecastday?.[0]?.hour?.[18]
                          ?.temp_c != null
                        ? `${Math.round(weatherData.forecast.forecastday[0].hour[18].temp_c)}°`
                        : "--°"
                      : weatherData?.forecast?.forecastday?.[0]?.hour?.[18]
                            ?.temp_f != null
                        ? `${Math.round(weatherData.forecast.forecastday[0].hour[18].temp_f)}°`
                        : "--°"}
                  </Text>
                </View>
              </View>
            </Animated.View>
            <View style={{ alignSelf: "stretch" }}>
              <LinearGradient
                colors={["#000000", "#2b2b2b", "#000000"]} // black -> lighter -> black
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  height: 2,
                  borderRadius: 999,
                  width: "100%",
                }}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 32,
              }}
            >
              <Text
                style={{
                  color: "#c4c4c4",
                  fontSize: 20,
                  marginBottom: 9,
                  fontFamily: "Nunito-Regular",
                }}
              >
                7 Days Forecast
              </Text>
              <View>
                {weatherData?.forecast?.forecastday?.map((dayItem: any) => {
                  const date = weatherData?.forecast?.forecastday
                    ?.map((d: any) => d.date)
                    .find((d: string) => d === dayItem.date);

                  const [year, month, day] = date.split("-").map(Number);

                  const dateObj = new Date(year, month - 1, day);

                  const dayName = dateObj.toLocaleDateString("en-US", {
                    weekday: "long",
                  });

                  return (
                    <View
                      key={dayItem.date}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                        marginTop: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          fontSize: 18,
                          fontWeight: "600",
                          fontFamily: "Nunito-Regular",
                        }}
                      >
                        {dayName}
                      </Text>
                      <img
                        src={`${dayItem.day.condition.icon}`}
                        alt={`${dayItem.day.condition.text} icon`}
                        width={24}
                        height={24}
                        style={{ filter: "invert(100%)" }}
                      />
                      <Text
                        style={{
                          color: "#ffffff",
                          fontSize: 14,
                          fontWeight: "600",
                          fontFamily: "Nunito-Regular",
                        }}
                      >
                        {dayItem.day.condition.text}
                      </Text>
                      <Text style={{ color: "#c4c4c4", fontSize: 18 }}>
                        {tempUnit === "C"
                          ? weatherData?.forecast?.forecastday?.[0]?.day
                              ?.mintemp_c != null &&
                            weatherData?.forecast?.forecastday?.[0]?.day
                              ?.maxtemp_c != null
                            ? `${Math.round(dayItem.day.mintemp_c)}° - ${Math.round(dayItem.day.maxtemp_c)}°`
                            : "--° - --°"
                          : weatherData?.forecast?.forecastday?.[0]?.day
                                ?.mintemp_f != null &&
                              weatherData?.forecast?.forecastday?.[0]?.day
                                ?.maxtemp_f != null
                            ? `${Math.round(dayItem.day.mintemp_f)}° - ${Math.round(dayItem.day.maxtemp_f)}°`
                            : "--° - --°"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </LinearGradient>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        index={-1} // Index of the initial snap point
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: "transparent" }}
        backgroundStyle={{ backgroundColor: "#202020", borderRadius: 62 }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View
            style={{
              flex: 1,
              padding: 14,
              width: "100%",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <TouchableOpacity onPress={handleCloseModalPress}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "600",
                fontFamily: "Nunito-Regular",
              }}
            >
              Temperature Unit
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                marginTop: 22,
              }}
            >
              <TouchableOpacity
                onPress={() => setTempUnit("C")}
                style={[
                  { flex: 1, display: "flex" },
                  Platform.OS === "web" && { cursor: "pointer" },
                  tempUnit === "C"
                    ? { borderWidth: 1, borderColor: "#fff", borderRadius: 12 }
                    : {},
                ]}
              >
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#2b2b2b",
                    padding: 12,
                    borderRadius: 12,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontFamily: "Nunito-Regular",
                      fontWeight: "600",
                    }}
                  >
                    Celcius
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTempUnit("F")}
                style={[
                  { flex: 1, display: "flex" },
                  Platform.OS === "web" && { cursor: "pointer" },
                  tempUnit === "F"
                    ? { borderWidth: 1, borderColor: "#fff", borderRadius: 12 }
                    : {},
                ]}
              >
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#2b2b2b",
                    padding: 12,
                    borderRadius: 12,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontFamily: "Nunito-Regular",
                      fontWeight: "600",
                    }}
                  >
                    Farenheit
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    padding: 14,
    fontFamily: "Nunito-Regular",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 4,
    width: "100%",
  },
});
