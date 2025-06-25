// components/DeckMoreMenu.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DeckMoreMenuProps {
  onSave: () => void;
  onClose: () => void;
}

const DeckMoreMenu: React.FC<DeckMoreMenuProps> = ({ onSave, onClose }) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 24,
        minHeight: 200,
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
        onPress={onSave}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Ionicons
          name="bookmark-outline"
          size={20}
          color="#333"
          style={{ marginRight: 12 }}
        />
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#333" }}>
          Save this deck
        </Text>
      </TouchableOpacity>

      <View
        style={{
          height: 1,
          backgroundColor: "#eee",
          marginVertical: 8,
        }}
      />

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

export default DeckMoreMenu;
