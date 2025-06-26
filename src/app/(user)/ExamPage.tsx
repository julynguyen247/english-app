import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import Toast from "react-native-toast-message";
import { Audio } from "expo-av";
import {
  getSectionsByExamIdAPI,
  getQuestionsBySectionIdAPI,
  addUserExamResultAPI,
} from "@/utils/api";
import QuestionRenderer from "@/components/exam/QuestionRenderer";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentApp } from "../context/appContext";

const ExamPage = () => {
  const { examId } = useLocalSearchParams<{ examId: string }>();
  const [sections, setSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const { appState } = useCurrentApp();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rawSections = await getSectionsByExamIdAPI(Number(examId));
        const sectionsWithQuestions = await Promise.all(
          rawSections.map(async (section: ISection) => {
            const questions = await getQuestionsBySectionIdAPI(
              section.sectionId
            );
            return { ...section, questions };
          })
        );
        setSections(sectionsWithQuestions);
      } catch (err) {
        Toast.show({ type: "error", text1: "Failed to load exam data." });
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchData();
  }, [examId]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload: IUserExamResult[] = [];

      sections.forEach((section) => {
        section.questions?.forEach((q) => {
          const userAnswerText = answers[q.questionId] || "";

          let answerOptionId = 0;

          if (
            q.type === "MULTIPLE_CHOICE_SINGLE" ||
            q.type === "MATCHING_HEADING" ||
            q.type === "YES_NO_NOT_GIVEN" ||
            q.type === "TRUE_FALSE_NOT_GIVEN"
          ) {
            const selected = q.options.find(
              (opt) => opt.optionText === userAnswerText
            );
            answerOptionId = selected?.optionId || 0;
          } else {
            if (q.options.length === 1) {
              answerOptionId = q.options[0].optionId;
            }
          }

          payload.push({
            userId: appState?.userId || 1,
            examId: Number(examId),
            sectionId: section.sectionId,
            questionId: q.questionId,
            answerOptionId,
            answerText: userAnswerText,
            answerJson: null,
            isSubmitted: true,
            answeredAt: new Date().toISOString(),
          });
        });
      });

      console.log("Payload:", JSON.stringify(payload, null, 2));
      await addUserExamResultAPI(payload);
      Toast.show({ type: "success", text1: "Submit Successfully!" });
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Error submitting result", err);
      Toast.show({ type: "error", text1: "Submit Failed!" });
    }
  };

  const playAudio = async (url: string) => {
    try {
      if (playingUrl === url && sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await sound.pauseAsync();
          setPlayingUrl(null);
          return;
        } else if (status.isLoaded && !status.isPlaying) {
          await sound.playAsync();
          setPlayingUrl(url);
          return;
        }
      }

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        if (status.didJustFinish) {
          setPlayingUrl(null);
        }
      });

      setSound(newSound);
      setPlayingUrl(url);
    } catch (err) {
      setPlayingUrl(null);
      Toast.show({ type: "error", text1: "Không thể phát audio" });
    }
  };

  const handleBack = () => {
    Alert.alert("Thoát khỏi bài thi?", "Bạn có chắc chắn muốn thoát?", [
      {
        text: "Không",
        style: "cancel",
      },
      {
        text: "Có",
        onPress: async () => {
          try {
            if (sound) {
              await sound.stopAsync();
              await sound.unloadAsync();
              setSound(null);
              setPlayingUrl(null);
            }
          } catch (err) {}
          router.back();
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      style={{ flex: 1 }}
    >
      <View
        style={{
          padding: 16,
          paddingTop: 48,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "transparent",
        }}
      >
        <TouchableOpacity onPress={handleBack} style={{ marginRight: 12 }}>
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
            color: APP_COLOR.TEXT_PRIMARY,
          }}
        >
          Exam
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {loading ? (
          <ActivityIndicator size="large" color={APP_COLOR.PRIMARY_BLUE} />
        ) : (
          sections.map((section, secIdx) => (
            <View key={section.sectionId} style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: APP_COLOR.TEXT_PRIMARY,
                  marginBottom: 12,
                }}
              >
                {secIdx + 1}. {section.name}
              </Text>

              {section.audioUrl?.trim() ? (
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                  }}
                >
                  <Text style={{ fontWeight: "600", marginBottom: 8 }}>
                    Audio:
                  </Text>
                  <TouchableOpacity onPress={() => playAudio(section.audioUrl)}>
                    <Text style={{ color: APP_COLOR.PRIMARY_BLUE }}>
                      {playingUrl === section.audioUrl
                        ? "⏸ Pause"
                        : "▶ Play audio"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : section.transcript?.trim() ? (
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24,
                  }}
                >
                  <Text
                    style={{ color: APP_COLOR.TEXT_SECONDARY, lineHeight: 22 }}
                  >
                    {section.transcript}
                  </Text>
                </View>
              ) : null}

              {section.questions?.map((q, idx) => (
                <View key={q.questionId} style={{ marginBottom: 24 }}>
                  <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                    {idx + 1}. {q.questionText}
                  </Text>
                  <QuestionRenderer
                    question={q}
                    answer={answers[q.questionId]}
                    onAnswer={handleAnswer}
                  />
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: APP_COLOR.PRIMARY_BLUE,
          margin: 16,
          borderRadius: 8,
          paddingVertical: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Submit</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ExamPage;
