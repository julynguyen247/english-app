import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getAllExerciseAndOptionAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";

const ExerciseScreen = () => {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllExerciseAndOptionAPI(Number(lessonId));
        setExerciseList(res);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setExerciseList([]);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchData();
  }, [lessonId]);

  const handleSelect = (exerciseId: number, optionId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [exerciseId]: optionId,
    }));
  };

  return (
    <ScrollView style={{ padding: 16, backgroundColor: APP_COLOR.BACKGROUND }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: APP_COLOR.TEXT_PRIMARY,
          marginBottom: 12,
        }}
      >
        Exercises
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={APP_COLOR.PRIMARY_BLUE} />
      ) : exerciseList.length === 0 ? (
        <Text style={{ color: APP_COLOR.TEXT_SECONDARY }}>
          No exercises found.
        </Text>
      ) : (
        exerciseList.map((item, i) => {
          const ex = item.exercise;
          const options = item.exerciseOptionList;
          const selectedOptionId = selectedAnswers[ex.exerciseId];

          return (
            <View
              key={ex.exerciseId}
              style={{
                backgroundColor: APP_COLOR.WHITE,
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 8,
                  color: APP_COLOR.TEXT_PRIMARY,
                }}
              >
                {i + 1}. {ex.question}
              </Text>

              {options.map((opt: any, idx: number) => {
                const selected = selectedOptionId === opt.optionId;
                return (
                  <TouchableOpacity
                    key={`${ex.exerciseId}-${opt.optionId ?? idx}`}
                    onPress={() => handleSelect(ex.exerciseId, opt.optionId)}
                    style={{
                      padding: 10,
                      backgroundColor: selected
                        ? APP_COLOR.PRIMARY_BLUE
                        : "#f1f1f1",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? "#fff" : APP_COLOR.TEXT_PRIMARY,
                        fontWeight: selected ? "bold" : "normal",
                      }}
                    >
                      {opt.optionText}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default ExerciseScreen;
