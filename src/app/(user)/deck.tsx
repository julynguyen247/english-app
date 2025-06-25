import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { addDeckAPI } from "@/utils/api";
import Toast from "react-native-toast-message";

const DeckScreen = () => {
  const [decks, setDecks] = useState([
    { id: "1", name: "English Vocabulary", count: 12 },
    { id: "2", name: "IELTS Reading", count: 5 },
    { id: "3", name: "Travel Phrases", count: 8 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [deckName, setDeckName] = useState("");

  const handleCreateDeck = async () => {
    if (!deckName.trim()) {
      Toast.show({ type: "error", text1: "Tên deck không được để trống" });
      return;
    }

    try {
      const res = await addDeckAPI(deckName.trim());
      const newDeck = {
        id: Date.now().toString(),
        name: deckName.trim(),
        count: 0,
      };
      setDecks((prev) => [...prev, newDeck]);
      Toast.show({ type: "success", text1: "Tạo deck thành công!" });
      setDeckName("");
      setModalVisible(false);
    } catch (err) {
      Toast.show({ type: "error", text1: "Lỗi tạo deck" });
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
        <View className="bg-white rounded-2xl px-6 py-6 shadow-md h-[75vh]">
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

          {decks.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center mb-5"
              onPress={() =>
                router.push({
                  pathname: "/(user)/cards",
                  params: { id: item.id, name: item.name },
                })
              }
            >
              <View className="w-20 h-20 bg-blue-200 rounded-lg mr-4" />
              <View className="justify-center">
                <Text className="text-black font-bold">{item.name}</Text>
                <Text className="text-gray-500">Flashcards: {item.count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Deck Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => setModalVisible(true)}
      >
        <Entypo name="plus" size={28} color="white" />
      </TouchableOpacity>

      {/* Modal to create deck */}
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
    </LinearGradient>
  );
};

export default DeckScreen;
