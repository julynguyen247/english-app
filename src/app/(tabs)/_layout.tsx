import { router, Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { APP_COLOR } from "@/utils/constant";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: APP_COLOR.WHITE,
          borderTopWidth: 0,
          elevation: 4,
          height: 65,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
          position: "absolute",
        },
        tabBarActiveTintColor: APP_COLOR.PRIMARY_BLUE,
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {[
        {
          name: "home",
          label: "Home",
          icon: ["home-variant", "home-variant-outline"],
          title: "Home",
        },
        {
          name: "deck",
          label: "Decks",
          icon: ["book-search", "book-search-outline"],
          title: "Decks",
        },
        {
          name: "practice",
          label: "Practice",
          icon: ["clipboard-text", "clipboard-text-outline"],
          title: "Practice",
        },
        {
          name: "history",
          label: "History",
          icon: ["history", "history"],
          title: "History",
        },
        {
          name: "profile",
          label: "Profile",
          icon: ["account-circle", "account-circle-outline"],
          title: "Profile",
        },
      ].map(({ name, label, icon, title }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarLabel: label,
            headerTitle: () =>
              title ? (
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: APP_COLOR.TEXT_PRIMARY,
                    padding: 10,
                    marginBottom: 4,
                  }}
                >
                  {title}
                </Text>
              ) : (
                ""
              ),

            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: APP_COLOR.BACKGROUND,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={
                  (focused
                    ? icon[0]
                    : icon[1]) as keyof typeof MaterialCommunityIcons.glyphMap
                }
                color={color}
                size={size + 2}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
