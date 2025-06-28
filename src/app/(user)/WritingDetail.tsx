import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import Toast from "react-native-toast-message";
import { getExamQuestionsByIdAPI, getWritingScoreAPI } from "@/utils/api";
import { useCurrentApp } from "../context/appContext";
import { Ionicons } from "@expo/vector-icons";

const WritingDetail = () => {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const { appState } = useCurrentApp();
  const userId = appState?.userId;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30 * 60);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  useEffect(() => {
    const fetchWritingQuestion = async () => {
      try {
        const data = await getExamQuestionsByIdAPI(Number(examId));
        if (data?.length > 0) {
          setQuestion(data[0].question);
        } else {
          Toast.show({ type: "info", text1: "No question found." });
        }
      } catch (err) {
        console.error("Failed to fetch writing question", err);
        Toast.show({ type: "error", text1: "Error loading question." });
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchWritingQuestion();
  }, [examId]);

  const handleSubmit = async () => {
    if (!question || !answer) {
      Toast.show({ type: "info", text1: "Please fill in your answer." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await getWritingScoreAPI(
        Number(userId),
        Number(examId),
        question,
        answer
      );
      const content =
        res?.choices?.[0]?.message?.content || "No feedback received.";
      setFeedback(content);
      setSubmitted(true);
    } catch (err) {
      console.error("Scoring failed", err);
      Toast.show({ type: "error", text1: "Failed to get score." });
    } finally {
      setSubmitting(false);
    }
  };
  const renderMarkdownText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} style={{ fontWeight: "bold" }}>
            {part.slice(2, -2)}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };
  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 16, paddingTop: 32 }}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {loading ? (
              <ActivityIndicator size="large" color={APP_COLOR.PRIMARY_BLUE} />
            ) : (
              <>
                <View
                  style={{
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (submitted) return router.back();
                      Alert.alert(
                        "Do you want to exit?",
                        "Your answer will not be saved.",
                        [
                          { text: "No", style: "cancel" },
                          { text: "Yes", onPress: () => router.back() },
                        ]
                      );
                    }}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}
                  >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: APP_COLOR.TEXT_PRIMARY,
                    }}
                  >
                    ⏱ Time Left: {formatTime(countdown)}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  {question
                    .replace(/\\n/g, "\n")
                    .split("\n")
                    .map((line, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: APP_COLOR.TEXT_PRIMARY,
                          marginBottom: 6,
                        }}
                      >
                        {line}
                      </Text>
                    ))}
                </View>

                <TextInput
                  multiline
                  editable={!submitted}
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Write your answer here..."
                  style={{
                    minHeight: 400,
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 12,
                    textAlignVertical: "top",
                    color: APP_COLOR.TEXT_PRIMARY,
                    fontSize: 16,
                    lineHeight: 22,
                  }}
                />

                {!submitted && (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={submitting}
                    style={{
                      marginTop: 20,
                      backgroundColor: submitting
                        ? "#ccc"
                        : APP_COLOR.PRIMARY_BLUE,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        Submit
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                {feedback !== "" && (
                  <View
                    style={{
                      marginTop: 24,
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    {feedback.split("\n").map((line, idx) => (
                      <Text key={idx} style={{ marginBottom: 6, fontSize: 14 }}>
                        {renderMarkdownText(line)}
                      </Text>
                    ))}
                  </View>
                )}

                {submitted && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                      marginTop: 24,
                      backgroundColor: "#999",
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Back
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default WritingDetail;
