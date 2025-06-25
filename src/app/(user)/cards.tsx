import React, { useState } from "react";
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

const DeckDetailScreen = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  const [cards, setCards] = useState([
    { id: "1", front: "Hello", back: "Xin chào" },
    { id: "2", front: "Thank you", back: "Cảm ơn" },
    { id: "3", front: "Goodbye", back: "Tạm biệt" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const handleAddCard = () => {
    if (!frontText.trim() || !backText.trim()) {
      Toast.show({ type: "error", text1: "Không được để trống!" });
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      front: frontText.trim(),
      back: backText.trim(),
    };

    setCards((prev) => [...prev, newCard]);
    setFrontText("");
    setBackText("");
    setModalVisible(false);
    Toast.show({ type: "success", text1: "Đã thêm thẻ!" });
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
            <Text className="text-black font-bold text-2xl mt-2">{name}</Text>
            <Text className="text-gray-500 text-center mt-1">
              {cards.length} flashcards trong bộ này.
            </Text>
          </View>

          {cards.map((card) => (
            <View
              key={card.id}
              className="mb-4 p-4 rounded-xl bg-blue-100 shadow"
            >
              <Text className="font-semibold text-base text-black">
                Front: {card.front}
              </Text>
              <Text className="text-gray-700 mt-1">Back: {card.back}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add card button */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Entypo name="plus" size={28} color="white" />
      </TouchableOpacity>

      {/* Modal add card */}
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
