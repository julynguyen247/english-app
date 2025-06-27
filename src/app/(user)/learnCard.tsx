import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedWrapper from "@/components/animation/animate";
import { APP_COLOR } from "@/utils/constant";
import { getFlashcardsByDeckIdAPI } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";

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

  const handleBack = () => {
    if (isFinished || index === 0) {
      router.back();
    } else {
      Alert.alert("Exit Learning?", "Your progress will be lost.", [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => router.back() },
      ]);
    }
  };

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      style={{ flex: 1 }}
    >
      {/* Navigation bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 48,
          paddingBottom: 12,
        }}
      >
        <TouchableOpacity onPress={handleBack}>
          <Ionicons
            name="arrow-back"
            size={28}
            color={APP_COLOR.TEXT_PRIMARY}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: APP_COLOR.TEXT_PRIMARY,
            marginLeft: 16,
          }}
        >
          Learn Flashcards
        </Text>
      </View>

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
              borderRadius: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 6,
              width: "100%",
            }}
          >
            <Text style={{ fontSize: 48 }}>🎉</Text>
            <Text
              style={{
                fontSize: 26,
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
                paddingVertical: 12,
                paddingHorizontal: 28,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Back to Study
              </Text>
            </TouchableOpacity>
          </View>
        ) : currentCard ? (
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 28,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: APP_COLOR.TEXT_SECONDARY,
                marginBottom: 6,
              }}
            >
              {index + 1} / {cards.length}
            </Text>

            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                marginBottom: 16,
                color: APP_COLOR.TEXT_PRIMARY,
                textAlign: "center",
              }}
            >
              {currentCard.frontText}
            </Text>

            {showAnswer ? (
              <>
                <Text
                  style={{
                    fontSize: 20,
                    color: APP_COLOR.TEXT_SECONDARY,
                    textAlign: "center",
                  }}
                >
                  {currentCard.backText}
                </Text>
                <TouchableOpacity
                  onPress={handleNext}
                  style={{
                    marginTop: 24,
                    paddingVertical: 12,
                    paddingHorizontal: 28,
                    borderRadius: 10,
                    backgroundColor: APP_COLOR.PRIMARY_BLUE,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {index < cards.length - 1 ? "Next" : "Finish"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={() => setShowAnswer(true)}
                style={{
                  backgroundColor: APP_COLOR.PRIMARY_BLUE,
                  paddingVertical: 12,
                  paddingHorizontal: 28,
                  borderRadius: 10,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Show Answer
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={{ fontSize: 16, color: APP_COLOR.TEXT_SECONDARY }}>
            No flashcards found.
          </Text>
        )}
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default LearnCardScreen;
