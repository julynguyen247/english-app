import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeckMoreMenuProps {
  deckStatus: "public" | "private";
  onToggleStatus: (newStatus: "public" | "private") => void;
  onDeleteDeck: () => void;
  onClose: () => void;
}

const YourDeckMoreMenu: React.FC<DeckMoreMenuProps> = ({
  deckStatus,
  onToggleStatus,
  onDeleteDeck,
  onClose,
}) => {
  const nextStatus = deckStatus === "public" ? "private" : "public";
  const iconName =
    nextStatus === "public" ? "earth-outline" : "lock-closed-outline";
  const label =
    nextStatus === "public"
      ? "Make this deck public"
      : "Make this deck private";

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        minHeight: 220,
      }}
    >
      <View
        style={{
          width: 40,
          height: 4,
          backgroundColor: "#ccc",
          borderRadius: 2,
          alignSelf: "center",
          marginBottom: 16,
        }}
      />

      <TouchableOpacity
        onPress={() => onToggleStatus(nextStatus)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Ionicons
          name={iconName}
          size={20}
          color="#333"
          style={{ marginRight: 12 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#333" }}>
          {label}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDeleteDeck}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Ionicons
          name="trash-bin-outline"
          size={20}
          color="#e11d48"
          style={{ marginRight: 12 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#e11d48" }}>
          Delete this deck
        </Text>
      </TouchableOpacity>

      <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 8 }} />

      <TouchableOpacity
        onPress={onClose}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Ionicons
          name="close-circle-outline"
          size={20}
          color="#999"
          style={{ marginRight: 12 }}
        />
        <Text style={{ fontSize: 16, color: "#999" }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default YourDeckMoreMenu;
