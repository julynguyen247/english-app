import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getExercisesByLessonIdAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";

const ExerciseScreen = () => {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await getExercisesByLessonIdAPI(Number(lessonId));
        setExercises(res);
      } catch (err) {
        console.error("Failed to fetch exercises", err);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchExercises();
  }, [lessonId]);

  const handleSelect = (exerciseId: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [exerciseId]: option,
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
      ) : exercises.length === 0 ? (
        <Text style={{ color: APP_COLOR.TEXT_SECONDARY }}>
          No exercises found.
        </Text>
      ) : (
        exercises.map((ex, i) => (
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

            {ex.exerciseOptions?.map((opt: string, j: number) => {
              const selected = selectedAnswers[ex.exerciseId] === opt;
              return (
                <TouchableOpacity
                  key={j}
                  onPress={() => handleSelect(ex.exerciseId, opt)}
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
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ExerciseScreen;
