import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedWrapper from "@/components/animation/animate";
import { APP_COLOR } from "@/utils/constant";

const vocabularyByCategory: Record<
  string,
  { word: string; meaning: string }[]
> = {
  "1": [
    { word: "Check-in", meaning: "Quầy làm thủ tục" },
    { word: "Customs", meaning: "Hải quan" },
  ],
  "2": [
    { word: "Meeting", meaning: "Cuộc họp" },
    { word: "Presentation", meaning: "Thuyết trình" },
  ],
  // các category khác...
};

const LearnCardScreen = () => {
  const { categoryId } = useLocalSearchParams();
  const cards = vocabularyByCategory[categoryId as string] || [];

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const currentCard = cards[index];

  const handleNext = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
      setShowAnswer(false);
    }
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper
        fade
        slideUp
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        {currentCard ? (
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 12,
                color: APP_COLOR.TEXT_PRIMARY,
              }}
            >
              {currentCard.word}
            </Text>

            {showAnswer ? (
              <Text style={{ fontSize: 18, color: APP_COLOR.TEXT_SECONDARY }}>
                {currentCard.meaning}
              </Text>
            ) : (
              <TouchableOpacity
                onPress={() => setShowAnswer(true)}
                style={{
                  backgroundColor: APP_COLOR.PRIMARY_BLUE,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  marginTop: 12,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Show Answer
                </Text>
              </TouchableOpacity>
            )}

            {index < cards.length - 1 && showAnswer && (
              <TouchableOpacity
                onPress={handleNext}
                style={{
                  marginTop: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  backgroundColor: "#ccc",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={{ fontSize: 16 }}>No cards found.</Text>
        )}
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default LearnCardScreen;
