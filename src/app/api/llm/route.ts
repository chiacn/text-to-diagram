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
`;
const rule_guide_displayType_list_compare = `
  a. Identify the main criteria or themes that can be used to list elements from the input content. (There can be multiple top-level elements, and if there are multiple, it is 'compare'.)
  b. Break down the content into individual elements that fit these criteria.
  c. Organize these elements into a simple list, ensuring each aligns with the main context or theme.
`;

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

// * 현재까지 가장 정확
// const rule_guide_displayType_example = `
//   a. create an step-by-step example that is specific to the largest context.
//   b. the example should be able to be applied as an actual use case.
//   c. for figuring out sub steps of the example, use the example created by the larger example.
//   c-1. The examples of sub step must be derived from the larger examples. (An example that comes up by substituting a larger example)
//   d. repeat the above process to configure sub steps.
//   e. ensure each step is developed in detail. it should show all the steps in a logical order.
//   f. ensure threre are enough examples. (for recursive, at least 5 steps)
// `;

/*

  핵심적인 맥락을 추출한다.
  (첫 번째 레이어에서는 여러 맥락 중에 하나를 추출한다?)

  * => 여기서 User feedback으로 다른 걸 중점 맥락으로 할 수도 있게??

  
  * 아예 초반에 했던 것처럼 엘리먼트 파악한 뒤 그 구조를 토대로 예시를 만드는걸로 하자.
  
  하위 example은 상위 example의 step을 빠짐없이 구성해야한다.
  
  step은 example에서의 flow를 따라야한다.
*/

// 모든 스텝은 연결되어야한다? 시작점과 끝점을 바탕으로 연결관계를 찾아라. -> 이 연결관계를 바탕으로 순서를 정리 . '선후관계'를 바탕으로?
// largest context to smaller context - 각 layer에서의 요소들의 연결관계를 파악. 이 연결관계를 바탕으로 시작점과 끝점 / 대입의 방법.
// '연결구조'
const rule_guide_displayType_example = ` 
  a. Create a specific, step-by-step example based on the provided input text.
  b. Organize the steps in a logical sequence, ensuring that each step follows naturally from the previous one based on their causal relationships.
  c. For each primary step, break it down into smaller sub-steps that derive from the main action or idea.
  d. Repeat the process recursively, ensuring that each sub-step is broken down further as needed to maintain clarity.
  e. Ensure that each step and sub-step is detailed, explaining all relevant actions or decisions.
  f. Provide enough examples, ensuring that recursive processes contain at least 5 well-defined steps.
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

// * 그냥 displayType을 response format에 {displayType: "example", content: "response"} 이런식으로 넣어주자.
const userContent_rule_format_example = `
  2. Based on created example, generate a JSON structure based on example. Each element in the JSON should follow this format:
   {
    target: element of INPUT TEXT corresponding to the example,
    example: actual example corresponding to the step by substituting the target,
    description: explanation of the step,
    steps: [ // if there are sub steps.
      {
        step: 1,2,3,4 ..., 
        ... // add the above process to configure sub steps. ( you have to include step, target, example, description )
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

const setUserContentRuleByLanguage = (lang: string = "KR") => {
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
