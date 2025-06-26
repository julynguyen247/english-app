import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import { Ionicons } from "@expo/vector-icons";
import { getAllExamsAPI } from "@/utils/api";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const PracticeTab = () => {
  const [exams, setExams] = useState<IExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await getAllExamsAPI();
        setExams(res || []);
      } catch (err) {
        Toast.show({ type: "error", text1: "Failed to load exams" });
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16, paddingTop: 32 }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F5F5F5",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              marginBottom: 24,
            }}
          >
            <Ionicons
              name="search"
              size={20}
              color="#555"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Tìm bộ đề Cambridge..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, fontSize: 16, color: APP_COLOR.TEXT_PRIMARY }}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={APP_COLOR.PRIMARY_BLUE} />
          ) : filteredExams.length === 0 ? (
            <Text className="text-center text-gray-500">No exams found.</Text>
          ) : (
            filteredExams.map((exam) => (
              <View
                key={exam.examId}
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 16,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: APP_COLOR.TEXT_PRIMARY,
                    marginBottom: 6,
                  }}
                >
                  {exam.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: APP_COLOR.TEXT_SECONDARY,
                    marginBottom: 12,
                  }}
                >
                  {exam.description}
                </Text>

                <TouchableOpacity
                  style={{
                    backgroundColor: APP_COLOR.PRIMARY_BLUE,
                    paddingVertical: 10,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    router.push({
                      pathname: "/(user)/ExamPage",
                      params: { examId: exam.examId.toString() },
                    });
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Take the exam now
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default PracticeTab;
