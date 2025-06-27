import React from "react";
import { TouchableOpacity, Text, TextInput, View } from "react-native";
import { APP_COLOR } from "@/utils/constant";

interface Props {
  question: IQuestion;
  answer: string;
  onAnswer: (questionId: number, value: string) => void;
}

const QuestionRenderer: React.FC<Props> = ({ question, answer, onAnswer }) => {
  const currentAnswer = answer || "";

  switch (question.type) {
    case "MULTIPLE_CHOICE_SINGLE":
      return (
        <>
          {question.options.map((opt) => (
            <TouchableOpacity
              key={opt.optionId}
              onPress={() => onAnswer(question.questionId, opt.optionText)}
              style={{
                backgroundColor:
                  currentAnswer === opt.optionText
                    ? APP_COLOR.PRIMARY_BLUE
                    : "#eee",
                padding: 10,
                borderRadius: 8,
                marginTop: 6,
              }}
            >
              <Text
                style={{
                  color: currentAnswer === opt.optionText ? "#fff" : "#000",
                }}
              >
                {opt.optionText}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      );

    case "TRUE_FALSE_NOT_GIVEN":
    case "YES_NO_NOT_GIVEN":
      const tfOptions =
        question.type === "TRUE_FALSE_NOT_GIVEN"
          ? ["True", "False", "Not Given"]
          : ["Yes", "No", "Not Given"];
      return (
        <>
          {tfOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => onAnswer(question.questionId, opt)}
              style={{
                backgroundColor:
                  currentAnswer === opt ? APP_COLOR.PRIMARY_BLUE : "#eee",
                padding: 10,
                borderRadius: 8,
                marginTop: 6,
              }}
            >
              <Text style={{ color: currentAnswer === opt ? "#fff" : "#000" }}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      );

    case "NOTE_COMPLETION":
    case "SUMMARY_COMPLETION":
    case "TABLE_COMPLETION":
    case "FLOW_CHART":
    case "MAP_LABEL":
    case "DIAGRAM_LABEL":
      return (
        <TextInput
          value={currentAnswer}
          onChangeText={(text) => onAnswer(question.questionId, text)}
          placeholder="Enter your answer..."
          style={{
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginTop: 6,
          }}
        />
      );

    case "MATCHING_HEADING":
      return (
        <>
          {question.options.map((opt) => (
            <TouchableOpacity
              key={opt.optionId}
              onPress={() => onAnswer(question.questionId, opt.optionText)}
              style={{
                backgroundColor:
                  currentAnswer === opt.optionText
                    ? APP_COLOR.PRIMARY_BLUE
                    : "#eee",
                padding: 10,
                borderRadius: 8,
                marginTop: 6,
              }}
            >
              <Text
                style={{
                  color: currentAnswer === opt.optionText ? "#fff" : "#000",
                }}
              >
                {opt.optionText}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      );

    default:
      return (
        <Text style={{ fontStyle: "italic" }}>Loại câu hỏi chưa hỗ trợ</Text>
      );
  }
};

export default QuestionRenderer;
