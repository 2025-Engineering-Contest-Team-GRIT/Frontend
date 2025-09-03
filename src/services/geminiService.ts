import { GoogleGenAI } from "@google/genai";
import type { Course, Student } from '@/types';

// The API key is injected from the environment and should not be hardcoded.
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

if (!API_KEY) {
  // In a real app, you might have better error handling or fallback behavior.
  // For this example, we'll log an error.
  console.error("NEXT_PUBLIC_GOOGLE_API_KEY is not set. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getCourseRecommendationReason = async (course: Course, student: Student): Promise<string> => {
  if (!API_KEY || !ai) {
    return Promise.resolve("AI 기능을 사용하려면 API 키가 필요합니다. 관리자에게 문의하세요.");
  }

  const prompt = `
    당신은 한성대학교 컴퓨터공학부의 친절하고 유능한 AI 진로 상담 어드바이저 '한성 길라잡이'입니다.
    학생의 정보를 바탕으로 특정 과목을 왜 수강해야 하는지 명확하고 설득력 있게 설명해주세요.

    학생 정보:
    - 이름: ${student.name}
    - 학년: ${student.status}
    - 희망 진로: ${student.careerPaths.join(', ')}
    - 이수 학점: ${student.completedCredits} / ${student.totalCredits}

    추천 과목 정보:
    - 과목명: ${course.name}
    - 학점: ${course.credits}
    - 과목 설명: ${course.description || '제공된 설명 없음'}

    요청:
    '${student.name}' 학생이 '${student.careerPaths.join(', ')}' 진로를 희망하는 상황에서, '${course.name}' 과목을 수강하는 것이 왜 중요한지, 어떤 도움이 되는지 2~3문장으로 간결하게 설명해주세요. 
    학생이 이해하기 쉽게, 긍정적이고 응원하는 톤으로 작성해주세요.
    예를 들어, "이 과목은 ... 역량을 키우는 데 핵심적인 역할을 합니다." 와 같은 형식으로 답변해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text || "AI 응답을 받을 수 없습니다.";
  } catch (error) {
    console.error("Error fetching recommendation from Gemini:", error);
    // Provide a user-friendly error message in Korean.
    return "AI 추천 사유를 가져오는 데 실패했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.";
  }
};
