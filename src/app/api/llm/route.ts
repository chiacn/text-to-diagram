import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { NextResponse } from "next/server";

/*
    * 프롬프트 주의사항
      - 따옴표 안에 들어가는 언어로 설명될 가능성이 높음 ex) [focusType]: Character-focused에서 Character-focused에 따옴표를 붙여버리면 영어로 output을 줄 확률이 높다.
*/

const userContent_rule_guide = `
  You must follow below 'Guide line' about 'INPUT TEXT'.
  Guide line:
  1. You should understand INPUT TEXT to explain it based on the below way.
`;

const rule_guide_displayType_tree = `
  a. Break down the input content into indivisible conceptual units. Each unit should be an atomic element within the context.
  b. Group these units into larger logical structures or categories that share a common theme or relationship.
  c. Within each group, if further subdivisions are possible, repeat the process by clustering smaller related units until no further meaningful grouping can be performed.
  d. Include all necessary elements from the input text, ensuring no duplication, while maintaining maximum coverage of important information.
  e. You have to translate each element and description into japanese.
`;
const rule_guide_displayType_list_compare = `
  a. Identify the main criteria or themes that can be used to list elements from the input content. (There can be multiple top-level elements, and if there are multiple, it is 'compare'.)
  b. Break down the content into individual elements that fit these criteria.
  c. Organize these elements into a simple list, ensuring each aligns with the main context or theme.
`;
// const rule_guide_displayType_example = `
// a. First, identify the key logical steps or core concepts in the input text. Ensure that you clearly understand the sequence or flow of these steps.
// b. Based on your understanding, generate a relevant example that illustrates these concepts or steps. Ensure the example directly relates to the context of the input.
// c. Present the example in a step-by-step manner, ensuring that each part of the example corresponds to a specific step or concept in the input. Each step in the example should clearly demonstrate the logical flow of the original content.
// `;

/*

  element로 예시의 unit을 나눈다. => 만약 그 예시의 unit이 펼쳐질 수 있는(전개될 수 있는거라면.) ex. for문의 n은 최소 4번 정도의 하위 step을 가져야 한다.

  input의 맥락에서 핵심적인
  DFS

  EX)
  User 피드백도 넣을까 ..?
  FEED BACK - "DFS 위주로 알려줘"

  '예시'라는 것을 모델링하는데, 이 때 모델링의 구성 요소는 
  너가 이해한 input의 예시에 필요한 다른 요소가 될 수도 있고,
  loop문이라면 특정 구성요소가 반복되는 것일 수도 있다.

  1. 그 요소들을 구성하는 여러 가지 논리적인 청크를 만든다?  시작 - (끝이 있는)
  2. 가장 큰 논리적인 맥락에서부터 step을 나누고, 각 step마다 하위 step이 있으면 그것을 나눈다.
  step에 기반한 청크. -> 각 스텝을 기준으로 나눈다.

*/

// const rule_guide_displayType_example = `
//   a. first, understand the INPUT TEXT based on its logical flow to create a real use case.
//     a-1. extraction of key context should be based on real cases that can be applied to the logic of input text.
//     a-2. based on the example, create the step-by-step process.
//     a-3. Each step must be structured according to the rules below.
//       - if logical flow has parameter, each step should be structured focusing on the development of the parameters.
//       - the logical chunk that can be divided into multiple steps should be ensured that all step is displayed. ( for example. Do not lump each step into a comprehensive explanation, but specify each step. )
//   b. If there are sub-logical units within a chunk, break them down into sequential sub steps.
// `;

/*
  모델링
  1. 맥락을 구성할 때, 가장 큰 행위와 그 행위를 이루는 행위들을 나눈다. 
  2. 각 행위의 맥락에 대응되는 예시를 만들건데, 예시를 만들 때, 큰 행위에 대응되는 예시가 작응 행위에 영향을 끼치는거면

 
  1. INPUT TEXT의 예시를 만들기 위해, 먼저 가장 큰 논리적인 맥락을 파악한다.
  2. 가장 큰 논리적인 맥락에 대응되는 예시를 만든다. 
  3. largest logical context의 하위 맥락들을 파악하기 위해서, 처음에 만들었던 가장 큰 논리적인 맥락에 대응되는 예시를 기반으로 하위 맥락을 파악한다.
     이 때, 가장 큰 논리적인 맥락의 예시를 INPUT TEXT에 대입했을 때 파악될 수 있는 논리적인 chunk를 기반으로 하위 맥락을 파악한다.
     즉 하위 맥락에 대응되는 예시는, 상위 맥락에서 먼저 파악한 예시를 기반으로 만들어진다.

*/

// const rule_guide_displayType_example = `
//   a. First, understand the INPUT TEXT by understanding its logical flow.
//   b. based on your understand, create actual use case for step-by-step example.
//   c. Each step should follow these rules:
//     - If the logical flow includes parameters, each step should focus on how the parameters are developed.
//     - Break down each logical chunk into multiple steps when possible. Do not condense steps into a single explanation; specify each step separately.
//   b. If there are sub-logical units within a chunk, break them down into sequential sub-steps.
// `;

/*
  largest element를 파악하고 그걸로 예시 만들기?
*/

const rule_guide_displayType_example = `
  a. define the largest conceptual element that makes up the input text.
  b. create step-by-step example using actual example that can be substituted. (An Example or use case corresponding to the element.)
  b-1. each step should be defined based on the example of the largest element. (these steps should be derived directly from the example created by the largest element.)
  b-2. define sub-steps based on larger example.
`;

const rule_guide_displayType_logical_progression = `

`;

// User Content Rule Format ====================================================

// * Based on divided element .. 뒤 문장에 RULE: YOU MUST TRANSLATE IT INTO KOREAN. 박으니까 한국어로 나옴. (근데 일본어로는 안된다..)
const userContent_rule_format_tree = `
  2. Based on divided elements, generate a JSON structure that represents relationship of elements. Each element in the JSON should follow this format:
  {
    displayType: tree,
    content: [ 
      {
        "element_name": Name of the element
        "related_elements": [
          {
            "element_name": Name of child element, 
            "relationTypeWithParent": Describe relationship with the parent element, 
            "relationship": [if there is a relationship between elements, display it here],
            "description": Description explaining relationship and context of this element,
          },
        ],
        description: Description explaining relationship and context of this element,
      }
    ]
  }
`;
const userContent_rule_format_list_compare = `
  2. Based on divided elements, generate a JSON structure that represents relationship of elements. Each element in the JSON should follow this format:
`;
const userContent_rule_format_example = `
  2. Based on example, generate a JSON structure that represents relationship of elements. Each element in the JSON should follow this format:
   {
    displayType: "example",
    steps: [ 
      {
        step: 1,  // steps in the example
        target: "Target corresponding to actual input text",
        example: "Example of the step",
        description: "Explanation of the overall logic for this step",
        sub_steps: [], // If there are sub steps
      }
    ]
  }
`;
const userContent_rule_format_logical_progression = `
  2. Based on divided elements, generate a JSON structure that represents relationship of elements. Each element in the JSON should follow this format:
`;

// ===========================================================================

let userContent_rule_response = `
  RESPONSE RULE:
  - Respond strictly in JSON format.

  INPUT TEXT:
`;

const setUserContentByInquiryType = (inquiryType: string, input: string) => {
  switch (inquiryType) {
    case "tree":
      return (
        userContent_rule_guide +
        rule_guide_displayType_tree +
        userContent_rule_format_tree +
        userContent_rule_response +
        `${input}`
      );
    case "list_compare":
      return (
        userContent_rule_guide +
        rule_guide_displayType_list_compare +
        userContent_rule_format_list_compare +
        userContent_rule_response +
        `${input}`
      );
    case "example":
      return (
        userContent_rule_guide +
        rule_guide_displayType_example +
        userContent_rule_format_example +
        userContent_rule_response +
        `${input}`
      );
    case "logical_progression":
      return (
        userContent_rule_guide +
        rule_guide_displayType_logical_progression +
        userContent_rule_format_logical_progression +
        userContent_rule_response +
        `${input}`
      );
    default:
      throw new Error("Invalid inquiry type");
  }
};

const setUserContentRuleByLanguage = (lang: string = "EN") => {
  let language = "English";
  switch (lang) {
    case "EN":
      return;
    case "KO":
      language = "Korean";
      break;
    case "JP":
      language = "Japanese";
      break;
    case "CN":
      language = "Chinese";
      break;
    case "SP":
      language = "Spanish";
      break;
    case "FR":
      language = "French";
      break;
    case "RU":
      language = "Russian";
      break;
    default:
      break;
  }
  userContent_rule_response =
    lang === "EN"
      ? `
        RESPONSE RULE:
          - Respond strictly in JSON format.

          INPUT TEXT:
      `
      : `
        RESPONSE RULE:
          - Respond strictly in JSON format.
          - Translate all descriptions and explanations into ${language} language
            Only use ${language} language for translation.

          INPUT TEXT:
      `;
};

const createPrompt = (
  input: string,
  inquiryType: string,
  topic?: string,
): ChatPromptTemplate => {
  const inputTopic = topic || "topic user inputs";
  const systemContent_default = `
    You are an expert on ${inputTopic}. you should understand INPUT TEXT to explain it with best way.
  `;

  setUserContentRuleByLanguage(); // 언어 설정.

  const systemContent = systemContent_default;
  const userContent = setUserContentByInquiryType(inquiryType, input);

  return ChatPromptTemplate.fromMessages([
    // NOTE: input으로 중괄호가 들어올 경우 ChatPromptTemplate이 이를 프롬프트의 {}로 인식하여 오류가 발생하는 경우 생김 - SystemMessage, HumanMessage 객체 사용해서 방지.
    new SystemMessage(systemContent),
    new HumanMessage(userContent),
  ]);
};

export async function POST(request: Request) {
  try {
    const { input, topic, inquiryType, serviceInfo } = await request.json();

    const checkService = (service: string) => {
      if (service === "groq") {
        return new ChatGroq({
          apiKey: process.env.GROQ_API_KEY,
          model: serviceInfo.model,
          temperature: 0.1,
          maxTokens: undefined,
          maxRetries: 2,
          // other params...
        });
      }

      // TODO: 추후 GPT 연동? (Usage Limits 옵션이 있어서 안전성 높음)
      return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: serviceInfo.model,
        temperature: 0.2,
        maxTokens: undefined,
        maxRetries: 2,
        // other params...
      });
    };
    const llm = checkService(serviceInfo.service);

    const prompt = createPrompt(input, inquiryType, topic);
    console.log(prompt.promptMessages[1]);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    const output = await chain.invoke({});

    return NextResponse.json({ output });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
