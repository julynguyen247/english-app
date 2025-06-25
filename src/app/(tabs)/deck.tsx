import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import { getAllDecksAPI } from "@/utils/api";
import { router } from "expo-router";
import DeckMoreMenu from "@/components/deck/DeckMoreMenu";

const CardTab = () => {
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const res = await getAllDecksAPI();
        setDecks(res);
      } catch (err) {
        console.error("Lỗi khi tải bộ thẻ:", err);
      }
    };
    fetchDecks();
  }, []);

  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveDeck = () => {
    if (selectedDeckId !== null) {
      console.log("Saving deck with id:", selectedDeckId);
      // TODO: Gọi API để lưu bộ thẻ ở đây
    }
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={{ paddingTop: 32 }}>
            {/* Search */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F5F5F5",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <Ionicons
                name="search"
                size={20}
                color="#555"
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder="Search decks"
                placeholderTextColor="#999"
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: APP_COLOR.TEXT_PRIMARY,
                }}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* Decks */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {filteredDecks.map((deck) => (
                <View
                  key={deck.id}
                  style={{
                    width: "48%",
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(user)/learnCard",
                        params: { categoryId: deck.id.toString() },
                      })
                    }
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 18,
                        marginBottom: 6,
                        color: APP_COLOR.TEXT_PRIMARY,
                      }}
                    >
                      {deck.name}
                    </Text>
                    <Text style={{ fontSize: 15, color: "#444" }}>
                      📄 {deck.flashCardNumber || 0} words
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      padding: 4,
                    }}
                    onPress={() => {
                      setSelectedDeckId(deck.id);
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color="#999" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={{ height: "auto" }}>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.4)",
                justifyContent: "flex-end",
              }}
              onPress={() => setModalVisible(false)}
              activeOpacity={1}
            >
              <View style={{ width: "100%" }}>
                <DeckMoreMenu
                  onSave={handleSaveDeck}
                  onClose={() => setModalVisible(false)}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default CardTab;
