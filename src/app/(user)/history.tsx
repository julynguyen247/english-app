import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import Toast from "react-native-toast-message";
import { getUserHistoryAPI, getUserHistoryExamAPI } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedWrapper from "@/components/animation/animate";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCurrentApp } from "../context/appContext";

const HistoryScreen = () => {
  const [history, setHistory] = useState<IUserHistory[]>([]);
  const [examHistory, setExamHistory] = useState<IUserHistoryExam[]>([]);
  const [expandedWriting, setExpandedWriting] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { appState } = useCurrentApp();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) throw new Error("No token found");

        const userId = appState?.userId;
        if (!userId) throw new Error("User ID not found");

        const [readingListeningRes, examRes] = await Promise.all([
          getUserHistoryAPI(Number(userId)),
          getUserHistoryExamAPI(Number(userId)),
        ]);

        setHistory(readingListeningRes);
        setExamHistory(examRes);
      } catch (err) {
        Toast.show({ type: "error", text1: "Failed to load history" });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);
  const getBandScore = (correct: number, total: number): number => {
    const percent = (correct / total) * 100;

    if (percent >= 90) return 9.0;
    if (percent >= 85) return 8.5;
    if (percent >= 75) return 8.0;
    if (percent >= 65) return 7.0;
    if (percent >= 55) return 6.0;
    if (percent >= 45) return 5.0;
    if (percent >= 30) return 4.0;
    if (percent >= 15) return 3.0;
    return 2.0;
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={APP_COLOR.TEXT_PRIMARY}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 12,
                color: APP_COLOR.TEXT_PRIMARY,
              }}
            >
              Your Exams History
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator color={APP_COLOR.PRIMARY_BLUE} />
          ) : (
            <>
              {history.length === 0 ? (
                <Text style={{ color: "#555" }}>
                  No listening/reading history found.
                </Text>
              ) : (
                history.map((item, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: "#fff",
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        marginBottom: 6,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {item.examTitle}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Feather name="file-text" size={18} color="#444" />
                      <Text style={{ marginLeft: 6 }}>{item.sectionName}</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="green"
                      />
                      <Text style={{ marginLeft: 6 }}>
                        Correct: {item.correctAnswers} / {item.totalQuestions}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Ionicons name="close-circle" size={18} color="red" />
                      <Text style={{ marginLeft: 6 }}>
                        Incorrect: {item.incorrectAnswers}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Feather name="target" size={18} color="#555" />
                      <Text style={{ marginLeft: 6 }}>
                        Band:{" "}
                        {getBandScore(item.correctAnswers, item.totalQuestions)}
                      </Text>
                    </View>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons name="time-outline" size={16} color="#888" />
                      <Text
                        style={{ marginLeft: 6, fontSize: 12, color: "#888" }}
                      >
                        {new Date(item.latestAnsweredAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))
              )}

              {examHistory.length > 0 && (
                <View style={{ marginTop: 24 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 12,
                      color: APP_COLOR.TEXT_PRIMARY,
                    }}
                  >
                    Writing Task History
                  </Text>

                  {examHistory.map((item, idx) => {
                    const isExpanded = expandedWriting === idx;

                    return (
                      <TouchableOpacity
                        key={`writing-${idx}`}
                        onPress={() =>
                          setExpandedWriting(isExpanded ? null : idx)
                        }
                        activeOpacity={0.9}
                        style={{
                          backgroundColor: "#fff",
                          padding: 16,
                          borderRadius: 12,
                          marginBottom: 12,
                        }}
                      >
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                          {item.title}
                        </Text>
                        <Text style={{ marginTop: 4, color: "#555" }}>
                          {item.description}
                        </Text>

                        {isExpanded && (
                          <>
                            <Text style={{ marginTop: 8 }}>
                              <Text style={{ fontWeight: "600" }}>
                                Your Answer:
                              </Text>{" "}
                              {item.userAnswer}
                            </Text>
                            <Text style={{ marginTop: 8 }}>
                              <Text style={{ fontWeight: "600" }}>
                                Feedback:
                              </Text>{" "}
                              {item.aiFeedback}
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HistoryScreen;
