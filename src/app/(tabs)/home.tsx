import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { APP_COLOR } from "@/utils/constant";
import AnimatedWrapper from "@/components/animation/animate";
import tw from "twrnc";
import { router, useNavigation } from "expo-router";
import { getCategoriesAPI, getCurrentUserInfoAPI } from "@/utils/api";
import { useCurrentApp } from "../context/appContext";

const HomeTab = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setAppState } = useCurrentApp();

  useEffect(() => {
    const checkLogin = async () => {
      const res = await getCurrentUserInfoAPI();
      if (res) {
        setAppState(res);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await getCategoriesAPI();
        const data = Array.isArray(res) ? res : res?.data ?? [];
        setSkills(data);
      } catch (err) {
        console.error("Failed to load skills", err);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
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
          style={tw`flex-1 px-4`}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          scrollEventThrottle={16}
        >
          <View style={tw`pt-8`}>
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

            <View style={tw`mb-6 mt-8`}>
              <View style={tw`flex-row justify-between items-center mb-3`}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: APP_COLOR.TEXT_PRIMARY,
                  }}
                >
                  Practice Skills
                </Text>
              </View>

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={APP_COLOR.PRIMARY_BLUE}
                />
              ) : (
                <View style={tw`flex-row flex-wrap justify-between pt-3`}>
                  {skills.map((skill, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        router.push({
                          pathname: "/(user)/lessons",
                          params: {
                            categoryId: skill.categoryId,
                            level: "Beginner",
                          },
                        });
                      }}
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
                        {skill.categoryName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: APP_COLOR.TEXT_SECONDARY,
                        }}
                      >
                        {skill.categoryDescription}
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
