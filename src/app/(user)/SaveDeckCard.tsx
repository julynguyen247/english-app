import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";
import Toast from "react-native-toast-message";
import {
  getFlashcardsByDeckIdAPI,
  addFlashcardAPI,
  deleteFlashcardAPI,
  updateFlashcardAPI,
} from "@/utils/api";

const SaveDeckDetail = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [cards, setCards] = useState<
    { flashcardId: number; frontText: string; backText: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const fetchCards = async () => {
    try {
      const data = await getFlashcardsByDeckIdAPI(id!);
      setCards(data);
    } catch (err) {
      Toast.show({ type: "error", text1: "Cannot load flashcard" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCards();
  }, [id]);

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, "#ffffff"]}
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
            <Text className="text-blue-400 font-bold text-base mr-1">Back</Text>
          </TouchableOpacity>

          <View className="items-center mb-6">
            <Ionicons name="layers-outline" size={48} color="#3b82f6" />
            <Text className="text-black font-bold text-2xl mt-2">
              {name || "Deck"}
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              {cards.length} flashcards in this deck.
            </Text>
          </View>

          {loading ? (
            <Text className="text-center text-gray-500">Loading data...</Text>
          ) : (
            cards.map((card) => (
              <View
                key={card.flashcardId}
                className="mb-4 p-4 rounded-2xl bg-white shadow border border-gray-200"
              >
                <Text className="font-semibold text-base text-black">
                  Front: {card.frontText}
                </Text>
                <Text className="text-gray-700 mt-1">
                  Back: {card.backText}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SaveDeckDetail;
