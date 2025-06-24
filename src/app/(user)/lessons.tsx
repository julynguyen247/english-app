import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getLessonsByCategoryAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";

const LessonScreen = () => {
  const { categoryId, level } = useLocalSearchParams<{
    categoryId: string;
    level: string;
  }>();

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await getLessonsByCategoryAPI(Number(categoryId), level);
        setLessons(res);
      } catch (err) {
        console.error("Error loading lessons", err);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId && level) {
      fetchLessons();
    }
  }, [categoryId, level]);

  return (
    <ScrollView style={{ padding: 16, backgroundColor: APP_COLOR.BACKGROUND }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: APP_COLOR.TEXT_PRIMARY,
          marginBottom: 12,
        }}
      >
        Lessons - {level}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={APP_COLOR.PRIMARY_BLUE} />
      ) : lessons.length === 0 ? (
        <Text style={{ color: APP_COLOR.TEXT_SECONDARY }}>
          No lessons found.
        </Text>
      ) : (
        lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.lessonId}
            onPress={() => {
              router.push({
                pathname: "/(user)/exercises",
                params: { lessonId: lesson.lessonId },
              });
            }}
            style={{
              backgroundColor: APP_COLOR.WHITE,
              borderRadius: 12,
              marginBottom: 16,
              flexDirection: "row",
              padding: 12,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: lesson.imageUrl }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                marginRight: 12,
                backgroundColor: "#eee",
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: APP_COLOR.TEXT_PRIMARY,
                }}
              >
                {lesson.title}
              </Text>
              <Text
                numberOfLines={2}
                style={{ fontSize: 13, color: APP_COLOR.TEXT_SECONDARY }}
              >
                {lesson.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default LessonScreen;
