import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getAllExerciseAndOptionAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";

const ExerciseScreen = () => {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [exerciseList, setExerciseList] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllExerciseAndOptionAPI(Number(lessonId));
        setExerciseList(res || []);
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
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [exerciseId]: optionId,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleBack = () => {
    if (submitted) {
      router.back();
    } else {
      Alert.alert("Do you want to exit?", "Your answers will not be saved.", [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <ScrollView style={{ padding: 16, backgroundColor: APP_COLOR.BACKGROUND }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <TouchableOpacity onPress={handleBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={APP_COLOR.TEXT_PRIMARY}
            style={{ marginRight: 8 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: APP_COLOR.TEXT_PRIMARY,
          }}
        >
          Exercises
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={APP_COLOR.PRIMARY_BLUE} />
      ) : exerciseList.length === 0 ? (
        <Text style={{ color: APP_COLOR.TEXT_SECONDARY }}>
          No exercises found.
        </Text>
      ) : (
        <>
          {exerciseList.map((item, i) => {
            const ex = item.exercise;
            const options = item.exerciseOptionList;
            const exId = ex.id ?? ex.exerciseId ?? i;
            const selectedOptionId = selectedAnswers[exId];
            const correctOption = options.find((opt: any) => opt.isCorrect);
            const isCorrect = submitted
              ? correctOption?.optionId === selectedOptionId
              : null;

            return (
              <View
                key={`exercise-${exId}`}
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
                  const isRightAnswer = submitted && opt.isCorrect;
                  const isWrongSelected =
                    submitted && selected && !opt.isCorrect;

                  return (
                    <TouchableOpacity
                      key={`option-${opt.optionId}`}
                      onPress={() => handleSelect(exId, opt.optionId)}
                      disabled={submitted}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
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
                          flex: 1,
                          color: selected ? "#fff" : APP_COLOR.TEXT_PRIMARY,
                          fontWeight: selected ? "bold" : "normal",
                        }}
                      >
                        {opt.optionText}
                      </Text>

                      {isRightAnswer && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="green"
                        />
                      )}
                      {isWrongSelected && (
                        <Ionicons name="close-circle" size={20} color="red" />
                      )}
                    </TouchableOpacity>
                  );
                })}

                {submitted && (
                  <Text
                    style={{
                      marginTop: 10,
                      color: isCorrect ? "green" : "red",
                      fontStyle: "italic",
                    }}
                  >
                    {isCorrect ? "Correct!" : "Incorrect."} Explanation:{" "}
                    {ex.explanation}
                  </Text>
                )}
              </View>
            );
          })}

          {!submitted && (
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: APP_COLOR.PRIMARY_BLUE,
                padding: 16,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 10,
                marginBottom: 50,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default ExerciseScreen;
