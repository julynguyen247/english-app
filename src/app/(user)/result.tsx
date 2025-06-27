import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getExamScoreAPI } from "@/utils/api";

import { APP_COLOR } from "@/utils/constant";
import { PieChart, BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const getBandFromScore = (percent: number): string => {
  if (percent >= 90) return "Band 9";
  if (percent >= 80) return "Band 8";
  if (percent >= 70) return "Band 7";
  if (percent >= 60) return "Band 6";
  if (percent >= 50) return "Band 5";
  if (percent >= 40) return "Band 4";
  return "Below Band 4";
};

const labelMap: Record<string, string> = {
  TRUE_FALSE_NOT_GIVEN: "True/False/Not Given",
  YES_NO_NOT_GIVEN: "Yes/No/Not Given",
  MATCHING_HEADING: "Matching Heading",
  SUMMARY_COMPLETION: "Summary Completion",
  TABLE_COMPLETION: "Table Completion",
  DIAGRAM_LABEL: "Diagram Label",
  MULTIPLE_CHOICE_SINGLE: "Multiple Choice",
};

const ExamResultScreen = () => {
  const { idUser, idExam, sectionId } = useLocalSearchParams<{
    idUser: string;
    idExam: string;
    sectionId: string;
  }>();

  const [score, setScore] = useState<IExamScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        if (!idUser || !idExam || !sectionId) return;
        const res = await getExamScoreAPI(
          Number(idUser),
          Number(idExam),
          Number(sectionId)
        );
        setScore(res);
      } catch (err) {
        console.error("Failed to fetch exam score", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [idUser, idExam, sectionId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={APP_COLOR.PRIMARY_BLUE} />
      </View>
    );
  }

  if (!score) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, color: "red" }}>
          No score data available.
        </Text>
      </View>
    );
  }

  const pieData = [
    {
      name: "Correct",
      population: score.correctAnswers,
      color: "#4CAF50",
      legendFontColor: "#4CAF50",
      legendFontSize: 14,
    },
    {
      name: "Incorrect",
      population: score.incorrectAnswers,
      color: "#F44336",
      legendFontColor: "#F44336",
      legendFontSize: 14,
    },
  ];

  const readableLabels = score.typeStats.map((s) => labelMap[s.type] || s.type);

  const barData = {
    labels: readableLabels,
    datasets: [
      {
        data: score.typeStats.map((s) => s.correct),
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Exam Result
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 16 }}>
          Total Questions: {score.totalQuestions}
        </Text>
        <Text style={{ fontSize: 16, color: "#4CAF50" }}>
          Correct: {score.correctAnswers}
        </Text>
        <Text style={{ fontSize: 16, color: "#F44336" }}>
          Incorrect: {score.incorrectAnswers}
        </Text>
        <Text style={{ fontSize: 16 }}>
          Accuracy: {score.percentCorrect.toFixed(1)}%
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 8 }}>
          Estimated Band: {getBandFromScore(score.percentCorrect)}
        </Text>
      </View>

      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Accuracy Distribution
      </Text>
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={180}
        chartConfig={{
          color: () => `#000`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
        center={[0, 0]}
        absolute
      />

      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 16 }}>
        Score by Question Type
      </Text>
      <BarChart
        data={barData}
        width={Math.max(screenWidth - 32, readableLabels.length * 80)}
        height={240}
        yAxisLabel=""
        yAxisSuffix=" pts"
        chartConfig={{
          backgroundGradientFrom: "#e0f7fa",
          backgroundGradientTo: "#e0f2f1",
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: () => "#000",
          barPercentage: 0.7,
          propsForLabels: {
            fontSize: "10",
          },
        }}
        verticalLabelRotation={0}
        fromZero
        showValuesOnTopOfBars
      />

      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/(user)/answer",
            params: {
              idUser: idUser?.toString(),
              idExam: idExam?.toString(),
              sectionId: sectionId?.toString(),
            },
          });
        }}
        style={{
          marginTop: 28,
          backgroundColor: APP_COLOR.PRIMARY_BLUE,
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          Show Answers
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ExamResultScreen;
