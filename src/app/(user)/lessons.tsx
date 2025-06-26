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
      {/* Header with back button and title */}
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
            style={{ marginRight: 8 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: APP_COLOR.TEXT_PRIMARY,
          }}
        >
          Lessons - {level}
        </Text>
      </View>

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
            onPress={() =>
              router.push({
                pathname: "/(user)/exercises",
                params: { lessonId: lesson.lessonId },
              })
            }
            style={{
              backgroundColor: APP_COLOR.WHITE,
              borderRadius: 16,
              marginBottom: 16,
              flexDirection: "row",
              padding: 14,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={{ uri: lesson.imageUrl }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 12,
                marginRight: 12,
                backgroundColor: "#eee",
              }}
              resizeMode="cover"
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: APP_COLOR.TEXT_PRIMARY,
                  marginBottom: 4,
                }}
              >
                {lesson.title}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 13,
                  color: APP_COLOR.TEXT_SECONDARY,
                  lineHeight: 18,
                }}
              >
                {lesson.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default LessonScreen;
