import { ChatGroq } from "@langchain/groq";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/*
  고민 및 TODOLIST 
  TODO: (비용) Groq과 HuggingFace pro 둘 다 사용한다면? (Groq 무료버전 이용량 초과 시 HuggingFace 이용.)

*/

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
    const systemContent_default = `
      You are an expert on ${inputTopic}. you must generate JSON structure following user's guideline.
    `;

    // TODO: systemContent_rule 다듬기. (tell me units 다른 걸로 수정)
    const userContent_rule_guide = `
      You must follow the rules below guide line about 'INPUT TEXT'.
      guide line:
      1. Break down the components described in the prompt into their smallest logical elements.
      2. Understand the logical and contextual relationships between these elements.
      3. Based on those elements, perform the following process:
        3-1. Define the relationships and context with each element.
        3-2. Based on '3-1', define the concept, hierarchy and context of the elements of '3-1'.
        3-3. Repeat this sequentially from the smallest element to the largest element covering small element.
    `;

    // TODO: LLM이 CSS까지 생성 안해주면 그냥 각 요소의 계층 관계 등을 바탕으로 내가 그 구조에 맞게 CSS 작성하는게 맞는듯..?
    // * 아니면 기본 구조를 형성하는 함수를 콜백처럼 LLM에 넘겨줘서 얘가 파악한 구조를 바탕으로 그걸 채우게 해야되나? => *** 아예 ui 타입을 지정해서.
    const userContent_rule_format = `
      4. Using the provided element, you must generate a JSON structure that represents a relationship diagram. Each element in the JSON should follow this format:
        [
          {
            "element_name": "Name of the element",
            "related_elements": [  // related elements. It can be a functional relationship or a hierarchical relationship.
              {
                "element_name": "Name of the element",
                "relationTypeWithParent": "Describe relationship with the parent element", 
                "relationship": [if there is a relationship between elements, describe it here],
                "description": "Description explaining relationship and context of this element",
              },
            ],
            "description": "Description explaining relationship and context of this element",
          }
        ]


        INPUT TEXT:
        
    `;

    // const systemContent = systemContent_default + userContent_rule_guide + userContent_rule_format;
    // const userContent = `${input}`;

    const systemContent = systemContent_default;
    const userContent =
      userContent_rule_guide + userContent_rule_format + `${input}`;

    return ChatPromptTemplate.fromMessages([
      /*
        Format Example :
        {
          role: "system",
          content: "You are my friend",
        },
        {
          role: "user",
          content: let you introduce yourself",
        },
      */
      // NOTE: input으로 중괄호가 들어올 경우 ChatPromptTemplate이 이를 프롬프트의 {}로 인식하여 오류가 발생하는 경우 생김 - SystemMessage, HumanMessage 객체 사용해서 방지.
      new SystemMessage(systemContent),
      new HumanMessage(userContent),
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
    } catch (e: any) {
      console.log("error  ---------------- ", e.error.error.code);
      switch (e.error.error.code) {
        case "context_length_exceeded":
          // TODO: 추후 ALERT 추가 (Shardcn ui)
          // TODO: 국제화 i18n

          handleTokenExceeded();
          break;
        default:
          break;
      }
      console.error("error :: ", e.error.error);
    } finally {
      // TODO: Loading 해제
    }
  };

  const handleTokenExceeded = () => {
    // TODO: 토큰 너무 많으면 두 개로 나눠서 보내기 + History 이용해서 맥락 기억 (Chat History?)
    console.log("token exceeded");
  };

  return { getAnswerFromModel };
}
