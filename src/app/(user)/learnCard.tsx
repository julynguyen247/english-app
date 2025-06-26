import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedWrapper from "@/components/animation/animate";
import { APP_COLOR } from "@/utils/constant";
import { getFlashcardsByDeckIdAPI } from "@/utils/api";

const LearnCardScreen = () => {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  const [cards, setCards] = useState<IFlashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const res = await getFlashcardsByDeckIdAPI(categoryId || "");
        setCards(res || []);
      } catch (err) {
        console.error("Lỗi khi tải flashcards:", err);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) fetchFlashcards();
  }, [categoryId]);

  const currentCard = cards[index];

  const handleNext = () => {
    if (index < cards.length - 1) {
      setIndex(index + 1);
      setShowAnswer(false);
    } else {
      setIsFinished(true);
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
        {loading ? (
          <ActivityIndicator size="large" color={APP_COLOR.PRIMARY_BLUE} />
        ) : isFinished ? (
          <View
            style={{
              backgroundColor: "white",
              padding: 32,
              borderRadius: 16,
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
                color: APP_COLOR.TEXT_PRIMARY,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Congratulations!
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: APP_COLOR.TEXT_SECONDARY,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              You have completed all the flashcards in this deck.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: APP_COLOR.PRIMARY_BLUE,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Back to Study
              </Text>
            </TouchableOpacity>
          </View>
        ) : currentCard ? (
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
              {currentCard.frontText}
            </Text>

            {showAnswer ? (
              <>
                <Text
                  style={{
                    fontSize: 18,
                    color: APP_COLOR.TEXT_SECONDARY,
                    textAlign: "center",
                  }}
                >
                  {currentCard.backText}
                </Text>
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
                  <Text style={{ fontWeight: "bold" }}>
                    {index < cards.length - 1 ? "Next" : "Finish"}
                  </Text>
                </TouchableOpacity>
              </>
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
          </View>
        ) : (
          <Text style={{ fontSize: 16 }}>No flashcards found.</Text>
        )}
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default LearnCardScreen;
