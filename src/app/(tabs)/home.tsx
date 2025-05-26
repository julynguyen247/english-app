import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import tw from "twrnc";
import { useNavigation } from "expo-router";

const HomeTab = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentOffset = useRef(0);
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const diff = offsetY - currentOffset.current;

    if (diff > 10 && visible) {
      setVisible(false);
      navigation.setOptions?.({ tabBarStyle: { display: "none" } });
    } else if (diff < -10 && !visible) {
      setVisible(true);
      navigation.setOptions?.({
        tabBarStyle: {
          backgroundColor: APP_COLOR.WHITE,
          borderTopWidth: 0,
          height: 70,
        },
      });
    }

    currentOffset.current = offsetY;
  };

  useEffect(() => {
    const mockTopics = [
      {
        id: "1",
        topic: "Technology",
        imageUrl: "https://placehold.co/120x100?text=Tech",
      },
      {
        id: "2",
        topic: "Environment",
        imageUrl: "https://placehold.co/120x100?text=Env",
      },
      {
        id: "3",
        topic: "Education",
        imageUrl: "https://placehold.co/120x100?text=Edu",
      },
      {
        id: "4",
        topic: "Health",
        imageUrl: "https://placehold.co/120x100?text=Health",
      },
    ];
    setTimeout(() => {
      setTopics(mockTopics);
      setLoading(false);
    }, 300);
  }, []);

  return (
    <LinearGradient
      colors={[APP_COLOR.SKY_BLUE, APP_COLOR.BACKGROUND]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          className="flex-1 px-4"
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          <View className="pt-8">
            {/* Banner */}
            <LinearGradient
              colors={[APP_COLOR.LIGHT_BLUE, APP_COLOR.PRIMARY_BLUE]}
              style={tw`w-full h-[150px] justify-center items-center rounded-[12px]`}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text
                style={tw`text-white font-bold text-2xl absolute left-5 top-5`}
              >
                Learn English Daily
              </Text>
              <Text style={tw`text-white pt-7 mx-5 text-[17px] text-center`}>
                Study vocabulary by topic, improve reading & listening with
                IELTS lessons!
              </Text>
            </LinearGradient>

            {/* Topics */}
            <View className="mb-6 pt-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: APP_COLOR.TEXT_PRIMARY,
                  }}
                >
                  Vocabulary Topics
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: APP_COLOR.PRIMARY_BLUE,
                    }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row pt-3"
              >
                {topics.map((word, i) => (
                  <View key={i} className="w-[140px] mr-3">
                    <Image
                      source={{ uri: word.imageUrl }}
                      className="w-full h-[100px] rounded-xl mb-2"
                      resizeMode="cover"
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        color: APP_COLOR.TEXT_PRIMARY,
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      {word.topic}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Practice Skills */}
            <View className="mb-6 mt-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: APP_COLOR.TEXT_PRIMARY,
                  }}
                >
                  Practice Skills
                </Text>
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: APP_COLOR.PRIMARY_BLUE,
                    }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={APP_COLOR.PRIMARY_BLUE}
                />
              ) : (
                <View className="flex-row flex-wrap justify-between pt-3">
                  {["Reading", "Listening"].map((skill, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{
                        width: "48%",
                        backgroundColor: APP_COLOR.WHITE,
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 16,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: APP_COLOR.TEXT_PRIMARY,
                          marginBottom: 4,
                        }}
                      >
                        {skill}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: APP_COLOR.TEXT_SECONDARY,
                        }}
                      >
                        Practice your IELTS {skill.toLowerCase()} skills
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </AnimatedWrapper>
    </LinearGradient>
  );
};

export default HomeTab;
