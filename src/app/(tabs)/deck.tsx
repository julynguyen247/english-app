import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import { getAllDecksAPI, saveDeckAPI } from "@/utils/api";
import { router, useFocusEffect } from "expo-router";
import DeckMoreMenu from "@/components/deck/DeckMoreMenu";
import Toast from "react-native-toast-message";
import { useCurrentApp } from "../context/appContext";

const CardTab = () => {
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const { appState } = useCurrentApp();
  const userId = appState?.userId;

  const fetchDecks = async () => {
    try {
      const res = await getAllDecksAPI();
      setDecks(res);
    } catch (err) {
      console.error("Lỗi khi tải bộ thẻ:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDecks();
    }, [])
  );

  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveDeck = async () => {
    const selectedDeck = decks.find((d) => d.id === selectedDeckId);
    if (!selectedDeck) {
      Toast.show({ type: "error", text1: "No deck selected!" });
      return;
    }

    if (selectedDeck.ownerId === userId) {
      setModalVisible(false);
      Toast.show({
        type: "error",
        text1: "This is your deck. You can't save it!",
      });
      return;
    }

    try {
      setLoading(true);
      await saveDeckAPI(selectedDeck.id);
      Toast.show({ type: "success", text1: "Deck saved!" });
      await fetchDecks();
    } catch (error) {
      Toast.show({ type: "error", text1: "Save failed!" });
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
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
          style={{
            flex: 1,
            paddingHorizontal: 24,
            marginTop: 8,
          }}
          contentContainerStyle={{ paddingBottom: 32 }}
          scrollEventThrottle={16}
        >
          <View style={{ paddingTop: 32 }}>
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
                style={{ flex: 1, fontSize: 16, color: APP_COLOR.TEXT_PRIMARY }}
                value={search}
                onChangeText={setSearch}
              />
            </View>

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
                        pathname: "/(user)/SaveDeckCard",
                        params: {
                          id: deck.id.toString(),
                          name: deck.name,
                        },
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
              {loading ? (
                <ActivityIndicator size="large" color={APP_COLOR.BLUE} />
              ) : (
                <DeckMoreMenu
                  onSave={handleSaveDeck}
                  onClose={() => setModalVisible(false)}
                />
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default CardTab;
