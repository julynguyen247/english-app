import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useCurrentApp } from "../context/appContext";
import { addDeckAPI, getOwnDecksAPI, updateDeckStatusAPI } from "@/utils/api";
import YourDeckMoreMenu from "@/components/deck/YourDeckMoreMenu";

interface IDeck {
  id: number;
  name: string;
  flashCardNumber: number;
  status: "public" | "private";
}

const DeckScreen = () => {
  const { appState } = useCurrentApp();
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const fetchDecks = async () => {
    if (!appState?.userId) return;
    try {
      setLoading(true);
      const data = await getOwnDecksAPI(appState.userId);
      setDecks(data);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to load decks" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [appState]);

  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      Toast.show({ type: "error", text1: "Deck name cannot be empty." });
      return;
    }

    if (!appState?.userId) {
      Toast.show({
        type: "error",
        text1: "User not found.",
        text2: "Please log in again.",
      });
      return;
    }

    try {
      await addDeckAPI(deckName.trim(), appState.userId);
      Toast.show({ type: "success", text1: "Created Deck Successfully!" });
      setDeckName("");
      setModalVisible(false);
      fetchDecks();
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to create deck." });
    }
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.LIGHT_BLUE, "#ffffff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 48,
          paddingBottom: 80,
        }}
      >
        <View className="bg-white rounded-2xl px-6 py-6 shadow-md min-h-[75vh]">
          <TouchableOpacity onPress={() => router.back()} className="self-end">
            <Text className="text-blue-400 font-bold text-base mr-1">Done</Text>
          </TouchableOpacity>

          <View className="items-center mb-6">
            <Ionicons name="book-outline" size={48} color="#3b82f6" />
            <Text className="text-black font-bold text-2xl mt-2">
              Your Decks
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              Your flashcard decks are stored here. Create your own and start
              learning!
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#3b82f6" size="large" />
          ) : decks.length === 0 ? (
            <Text className="text-center text-gray-500">No decks found.</Text>
          ) : (
            decks.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="flex-row items-center mb-5"
                onPress={() =>
                  router.push({
                    pathname: "/(user)/cards",
                    params: {
                      id: item.id.toString(),
                      name: item.name,
                    },
                  })
                }
              >
                <View className="w-20 h-20 bg-blue-200 rounded-lg mr-4" />
                <View className="justify-center">
                  <Text className="text-black font-bold">{item.name}</Text>
                  <Text className="text-gray-500">
                    Flashcards: {item.flashCardNumber}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDeckId(item.id);
                    setMenuVisible(true);
                  }}
                  style={{ position: "absolute", top: 8, right: 8, padding: 4 }}
                >
                  <Ionicons name="ellipsis-vertical" size={18} color="#999" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Entypo name="plus" size={28} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-2xl p-6">
            <Text className="text-lg font-bold text-center mb-4">
              Create New Deck
            </Text>
            <TextInput
              placeholder="Enter deck name"
              value={deckName}
              onChangeText={setDeckName}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-500 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateDeck}>
                <Text className="text-blue-500 font-bold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <YourDeckMoreMenu
            deckStatus={
              decks.find((d) => d.id === selectedDeckId)?.status ?? "private"
            }
            onToggleStatus={async (newStatus) => {
              const selectedDeck = decks.find((d) => d.id === selectedDeckId);
              if (!selectedDeck) return;

              try {
                await updateDeckStatusAPI(
                  selectedDeck.id,
                  newStatus,
                  selectedDeck.name
                );
                Toast.show({
                  type: "success",
                  text1: `Deck is now ${newStatus}!`,
                });

                await fetchDecks();
                setMenuVisible(false);
              } catch {
                Toast.show({
                  type: "error",
                  text1: "Failed to update status.",
                });
                setMenuVisible(false);
              }
            }}
            onClose={() => setMenuVisible(false)}
          />
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

export default DeckScreen;
