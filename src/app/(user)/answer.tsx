import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchExamAnswerResultAPI } from "@/utils/api";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

const ExamAnswerScreen = () => {
  const { idUser, idExam, sectionId } = useLocalSearchParams<{
    idUser: string;
    idExam: string;
    sectionId: string;
  }>();

  const [data, setData] = useState<IExamAnswerResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!idUser || !idExam || !sectionId) return;
      try {
        const res = await fetchExamAnswerResultAPI(
          Number(idUser),
          Number(idExam),
          Number(sectionId)
        );
        setData(res);
      } catch (err) {
        console.error("Error loading exam answer result", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [idUser, idExam, sectionId]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={tw`p-4`}>
        <Text style={tw`text-red-500 text-base`}>No answer data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={tw`p-4 pb-12`}>
      <View
        style={tw`bg-white rounded-xl p-4 mb-6 shadow-md border border-gray-200`}
      >
        <Text style={tw`text-xl font-bold mb-3`}>Transcript</Text>
        <View style={tw`bg-gray-100 p-3 rounded-lg`}>
          <Text style={tw`text-gray-700 text-sm leading-5`}>
            {data.transript}
          </Text>
        </View>
      </View>

      <Text style={tw`text-xl font-bold mb-4`}>Answers</Text>
      {data.detailedResults.map((item, index) => {
        const isCorrect = item.isCorrect;
        return (
          <View
            key={item.userAnswerId}
            style={tw.style(
              `p-4 rounded-xl mb-4 border`,
              isCorrect
                ? "border-green-500 bg-green-100"
                : "border-red-500 bg-red-100"
            )}
          >
            <Text style={tw`font-bold mb-1`}>Question {index + 1}</Text>
            <Text style={tw`text-sm mb-1`}>
              <Text style={tw`font-medium text-gray-600`}>Your Answer:</Text>{" "}
              <Text style={tw`font-semibold`}>
                {item.userAnswer || "Empty"}
              </Text>
            </Text>
            <Text style={tw`text-sm`}>
              <Text style={tw`font-medium text-gray-600`}>Correct Answer:</Text>{" "}
              <Text style={tw`font-semibold`}>{item.correctAnswer}</Text>
            </Text>

            <View style={tw`mt-2 flex-row items-center`}>
              <Ionicons
                name={isCorrect ? "checkmark-circle" : "close-circle"}
                size={20}
                color={isCorrect ? "#22c55e" : "#ef4444"}
              />
              <Text
                style={tw.style(
                  `ml-2 font-semibold`,
                  isCorrect ? "text-green-600" : "text-red-600"
                )}
              >
                {isCorrect ? "Correct" : "Incorrect"}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ExamAnswerScreen;
