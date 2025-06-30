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

const DeckDetailScreen = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const [cards, setCards] = useState<
    { flashcardId: number; frontText: string; backText: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFrontText, setEditFrontText] = useState("");
  const [editBackText, setEditBackText] = useState("");

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

  const handleAddCard = async () => {
    if (!frontText.trim() || !backText.trim()) {
      Toast.show({ type: "error", text1: "This field cannot be empty." });
      return;
    }

    try {
      await addFlashcardAPI(id!, [
        { frontText: frontText.trim(), backText: backText.trim() },
      ]);
      Toast.show({ type: "success", text1: "Add Flashcard Successfully!" });

      fetchCards();
      setFrontText("");
      setBackText("");
      setModalVisible(false);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed" });
    }
  };

  const handleDeleteCard = async (flashcardId: number) => {
    try {
      const res = await deleteFlashcardAPI(flashcardId);
      console.log(res);
      Toast.show({ type: "success", text1: "Delete Successfully" });
      fetchCards();
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed" });
    }
  };

  const handleUpdateCard = async () => {
    if (!editFrontText.trim() || !editBackText.trim()) {
      Toast.show({ type: "error", text1: "This field cannot be empty!" });
      return;
    }

    try {
      await updateFlashcardAPI(editingId!, editFrontText, editBackText);
      Toast.show({ type: "success", text1: "Update Successfully!" });
      fetchCards();
      setEditingId(null);
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed!" });
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
                className="mb-4 p-4 rounded-2xl bg-white shadow border border-gray-200"
              >
                <Text className="font-semibold text-base text-black">
                  Front: {card.frontText}
                </Text>
                <Text className="text-gray-700 mt-1">
                  Back: {card.backText}
                </Text>

                <View className="flex-row justify-end gap-4 mt-3">
                  <TouchableOpacity
                    onPress={() => {
                      setEditingId(card.flashcardId);
                      setEditFrontText(card.frontText);
                      setEditBackText(card.backText);
                    }}
                    className="bg-blue-100 px-3 py-1 rounded-full"
                  >
                    <Text className="text-blue-600 font-bold">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteCard(card.flashcardId)}
                    className="bg-red-100 px-3 py-1 rounded-full"
                  >
                    <Text className="text-red-600 font-bold">Delete</Text>
                  </TouchableOpacity>
                </View>
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

      <Modal
        visible={editingId !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setEditingId(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full rounded-2xl p-6">
            <Text className="text-lg font-bold text-center mb-4">
              Edit Card
            </Text>

            <TextInput
              placeholder="Front"
              value={editFrontText}
              onChangeText={setEditFrontText}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-3"
            />
            <TextInput
              placeholder="Back"
              value={editBackText}
              onChangeText={setEditBackText}
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />

            <View className="flex-row justify-end gap-3">
              <TouchableOpacity onPress={() => setEditingId(null)}>
                <Text className="text-gray-500 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateCard}>
                <Text className="text-blue-500 font-bold">Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default DeckDetailScreen;
