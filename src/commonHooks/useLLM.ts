import { ChatGroq } from "@langchain/groq";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

interface LLMProps {
  model?: string;
  service?: string;
}
export default function useLLM({
  model = "llama3-groq-70b-8192-tool-use-preview",
  service = "groq",
}: LLMProps) {
  /*
    - temperature(온도)s
       높게 설정 - 랜덤한 텍스트, 낮은 확률을 가진 단어들의 선택 확률이 높아져 창의적.
       낮게 설정 - 덜 랜덤하고 예측 가능한 텍스트

    - maxTokens(최대 토큰)
        한 번의 요청 당 생성할 수 있는 텍스트의 최대 길이를 제한.
        TODO: 1 TOKEN당 몇 자 정도인지는 확인 필요.
  */
  const checkService = (service: string) => {
    if (service === "groq") {
      return new ChatGroq({
        apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        model: model,
        temperature: 0.2,
        maxTokens: undefined,
        maxRetries: 2,
        // other params...
      });
    }

    // TODO: 추후 GPT 연동? (Usage Limits 옵션이 있어서 안전성 높음)
    return new ChatGroq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      model: model,
      temperature: 0.2,
      maxTokens: undefined,
      maxRetries: 2,
      // other params...
    });
  };
  const llm = checkService(service);

  const createPrompt = (
    input: string,
    topic?: string,
    // ): BaseLanguageModelInput => {
  ): ChatPromptTemplate => {
    const inputTopic = topic || "topic user inputs";
    const systemContent_default = `You are an expert on ${inputTopic}. Provide an organized and thorough explanation on the following prompt. `;

    // TODO: systemContent_rule 다듬기. (tell me units 다른 걸로 수정)
    const systemContent_rule = `
      and you must follow the rules below: 
      1. Break down the components described in the prompt into their smallest logical, contextual units.
      2. Sequentially grasp the logical and contextual relationships between these units.
      3. tell me units.
    `;
    const systemContent = systemContent_default + systemContent_rule;
    const userContent_default = `${input}`;

    return ChatPromptTemplate.fromMessages([
      {
        role: "system",
        content: "You are my friend",
      },
      {
        role: "user",
        content: userContent_default,
      },
      // new SystemMessage(systemContent),
      // new HumanMessage(userContent_default),
    ]);
  };

  const getAnswerFromModel = async (input: string, topic?: string) => {
    const prompt = createPrompt(input, topic);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    try {
      // TODO: Loaing 정의
      const output = await chain.invoke({});
      console.log("output --- ", output);
      return output;
    } catch (error) {
      switch (error) {
        case "context_length_exceeded":
          // TODO: 추후 ALERT 추가 (Shardcn ui)
          // TODO: 국제화 i18n
          alert(
            "토큰이 너무 많습니다. 다른 ai 등을 통해 요약해서 다시 시도하는 걸 추천드립니다.",
          );
          break;
        default:
          break;
      }
      console.error("error :: ", error);
    } finally {
      // TODO: Loading 해제
    }
  };

  return { getAnswerFromModel };
}
