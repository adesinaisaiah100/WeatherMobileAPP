import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedRef, useScrollOffset, useAnimatedStyle, interpolate } from "react-native-reanimated";


export default function HomeScreen() {

  const viewHeight = 400;

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const viewAnimated = useAnimatedStyle(() => {
     const opacity = interpolate(scrollOffset.value, [0, viewHeight], [1, 0.3], "clamp");
  const translateY = interpolate(scrollOffset.value, [0, viewHeight], [0, -40], "clamp");
    return {  transform: [
      {scale: interpolate(
        scrollOffset.value, 
        [-viewHeight, 0, viewHeight],
         [1.25, 1, 0.7],
          "clamp"
        )},
        {translateY}
    ]
    , opacity }
  })

  return (
    <LinearGradient colors={["#202020", "#000000"]} style={styles.container}>
      <Animated.ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 2, paddingBottom: 10 }}
      ref= {scrollRef}
      scrollEventThrottle={16}
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
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-search-icon lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <TextInput
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
            />
          </View>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-settings2-icon lucide-settings-2"
          >
            <path d="M14 17H5" />
            <path d="M19 7h-9" />
            <circle cx="17" cy="17" r="3" />
            <circle cx="7" cy="7" r="3" />
          </svg>
        </View>
        <Animated.View style={[{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 32, height: viewHeight }, viewAnimated]} >
        <View style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 42}}>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, }}>
            <Text style={{ color: "#c4c4c4", fontSize: 20,fontFamily:"Nunito-Regular"  }}>Sunny Wind</Text>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-cloud-sun-icon lucide-cloud-sun"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>
          </View>
          <Text style={{ color: "#ffffff", fontSize: 110, fontWeight: "600", fontFamily:"Nunito-ExtraBold" }}>27°</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 32, marginTop: 32, gap: 4, width: "100%" }}>
      
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#c4c4c4", fontSize: 20,fontFamily:"Nunito-Regular"  }}>Afternoon</Text>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-cloudy-icon lucide-cloudy"><path d="M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z"/><path d="M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61"/></svg>
            <Text style={{ color: "#ffffff", fontSize: 40, fontWeight: "600"}}>26°</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#c4c4c4", fontSize: 20,fontFamily:"Nunito-Regular"  }}>Afternoon</Text>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-cloudy-icon lucide-cloudy"><path d="M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z"/><path d="M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61"/></svg>
            <Text style={{ color: "#ffffff", fontSize: 40, fontWeight: "600"}}>24°</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#c4c4c4", fontSize: 20,fontFamily:"Nunito-Regular"  }}>Afternoon</Text>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-cloudy-icon lucide-cloudy"><path d="M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z"/><path d="M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61"/></svg>
            <Text style={{ color: "#ffffff", fontSize: 40, fontWeight: "600"}}>25°</Text>
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
         <View style={{ display: "flex", flexDirection: "column", marginTop: 32 }}>
          <Text style={{ color: "#c4c4c4", fontSize: 20, marginBottom: 9, fontFamily:"Nunito-Regular"  }}>7 Days Forecast</Text>
          <View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 12 }}>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular" }}>Thursday</Text>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular"  }}>Sunny</Text>
              <Text style={{ color: "#c4c4c4", fontSize: 18}}>22° - 25°</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 12 }}>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular" }}>Thursday</Text>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular"  }}>Sunny</Text>
              <Text style={{ color: "#c4c4c4", fontSize: 18}}>22° - 25°</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 12 }}>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular" }}>Thursday</Text>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular"  }}>Sunny</Text>
              <Text style={{ color: "#c4c4c4", fontSize: 18}}>22° - 25°</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 12 }}>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular" }}>Thursday</Text>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular"  }}>Sunny</Text>
              <Text style={{ color: "#c4c4c4", fontSize: 18}}>22° - 25°</Text>
            </View>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 12 }}>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular" }}>Thursday</Text>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4c4c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "600", fontFamily:"Nunito-Regular"  }}>Sunny</Text>
              <Text style={{ color: "#c4c4c4", fontSize: 18}}>22° - 25°</Text>
            </View>
      
          </View>
         </View>
      </View>
      </Animated.ScrollView>
    </LinearGradient>
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
});
