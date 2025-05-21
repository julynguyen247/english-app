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
          backgroundColor: "#000",
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
      colors={[APP_COLOR.LT_PINK, APP_COLOR.BLACK]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.5]}
      style={{ flex: 1 }}
    >
      <AnimatedWrapper fade scale slideUp style={{ flex: 1 }}>
        <ScrollView
          className="flex-1 px-4"
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          <View className="pt-8">
            <LinearGradient
              colors={[APP_COLOR.PINK, APP_COLOR.PURPLE]}
              style={tw`w-full h-[150px] justify-center items-center rounded-[10px]`}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text className="text-white font-bold text-2xl absolute left-5 top-5">
                Learn English Daily
              </Text>
              <Text className="text-white pt-7 mx-5 text-[18px] text-center">
                Study vocabulary by topic, improve reading & listening with
                IELTS lessons!
              </Text>
            </LinearGradient>

            <View className="mb-6 pt-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-2xl font-bold">
                  Vocabulary Topics
                </Text>
                <TouchableOpacity>
                  <Text style={tw`text-[${APP_COLOR.PINK}] font-bold text-xl`}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row pt-3"
              >
                {topics.slice(0, 10).map((word, i) => (
                  <View key={i} className="w-[140px] mr-3">
                    <Image
                      source={{ uri: word.imageUrl }}
                      className="w-full h-[100px] rounded-xl mb-2"
                      resizeMode="cover"
                    />
                    <Text
                      className="text-white font-semibold text-sm"
                      numberOfLines={1}
                    >
                      {word.topic}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Practice Section */}
            <View className="mb-6 mt-7">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white text-2xl font-bold">
                  Practice Skills
                </Text>
                <TouchableOpacity>
                  <Text style={tw`text-[${APP_COLOR.PINK}] font-bold text-xl`}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <View className="flex-row flex-wrap justify-between pt-3">
                  {["Reading", "Listening"].map((skill, i) => (
                    <TouchableOpacity
                      key={i}
                      className="w-[48%] bg-white/10 p-4 rounded-xl mb-4"
                    >
                      <Text className="text-white font-bold text-xl mb-1">
                        {skill}
                      </Text>
                      <Text className="text-gray-300 text-sm">
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
