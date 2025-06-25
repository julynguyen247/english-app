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
import { getFlashcardsByDeckIdAPI, addFlashcardAPI } from "@/utils/api";

const DeckDetailScreen = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const [cards, setCards] = useState<
    { flashcardId: number; frontText: string; backText: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const fetchCards = async () => {
    try {
      const data = await getFlashcardsByDeckIdAPI(id!);
      setCards(data);
    } catch (err) {
      Toast.show({ type: "error", text1: "Không thể tải flashcard" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCards();
  }, [id]);

  const handleAddCard = async () => {
    if (!frontText.trim() || !backText.trim()) {
      Toast.show({ type: "error", text1: "Không được để trống!" });
      return;
    }

    try {
      await addFlashcardAPI(id!, [
        { frontText: frontText.trim(), backText: backText.trim() },
      ]);
      Toast.show({ type: "success", text1: "Đã thêm thẻ mới!" });

      // Refresh lại danh sách flashcards sau khi thêm
      fetchCards();

      // Reset input
      setFrontText("");
      setBackText("");
      setModalVisible(false);
    } catch (err) {
      Toast.show({ type: "error", text1: "Lỗi khi thêm thẻ" });
    }
  };

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
                className="mb-4 p-4 rounded-xl bg-blue-100 shadow"
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
            <Text className="text-lg font-bold text-center mb-4">Add Card</Text>

            <TextInput
              placeholder="Front"
              value={frontText}
              onChangeText={setFrontText}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
            />
            <TextInput
              placeholder="Back"
              value={backText}
              onChangeText={setBackText}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-500 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddCard}>
                <Text className="text-blue-500 font-bold">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default DeckDetailScreen;
