// import { HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { ChatGroq } from "@langchain/groq";
// import { NextResponse } from "next/server";

// /*
//     * 프롬프트 주의사항
//       - 따옴표 안에 들어가는 언어로 설명될 가능성이 높음 ex) [focusType]: Character-focused에서 Character-focused에 따옴표를 붙여버리면 영어로 output을 줄 확률이 높다.
// */

// const userContent_rule_guide = `
//   You must follow below 'Guideline' about [INPUT TEXT].
//   Guideline:
// `;

// const rule_guide_displayType_tree = `
//   a. Break down the input content into indivisible conceptual units. Each unit should be an atomic element within the context.
//   b. Group these units into larger logical structures or categories that share a common theme or relationship.
//   c. Within each group, if further subdivisions are possible, repeat the process by clustering smaller related units until no further meaningful grouping can be performed.
//   d. Include all necessary elements from the input text, ensuring no duplication, while maintaining maximum coverage of important information.
// `;
// const rule_guide_displayType_list_compare = `
//   a. Identify the main criteria or themes that can be used to list elements from the input content. (There can be multiple top-level elements, and if there are multiple, it is 'compare'.)
//   b. Break down the content into individual elements that fit these criteria.
//   c. Organize these elements into a simple list, ensuring each aligns with the main context or theme.
// `;

// /*
//   모델링
//   1. 맥락을 구성할 때, 가장 큰 행위와 그 행위를 이루는 행위들을 나눈다.
//   2. 각 행위의 맥락에 대응되는 예시를 만들건데, 예시를 만들 때, 큰 행위에 대응되는 예시가 작응 행위에 영향을 끼치는거면

//   1. INPUT TEXT의 예시를 만들기 위해, 먼저 가장 큰 논리적인 맥락을 파악한다.
//   2. 가장 큰 논리적인 맥락에 대응되는 예시를 만든다.
//   3. largest logical context의 하위 맥락들을 파악하기 위해서, 처음에 만들었던 가장 큰 논리적인 맥락에 대응되는 예시를 기반으로 하위 맥락을 파악한다.
//      이 때, 가장 큰 논리적인 맥락의 예시를 INPUT TEXT에 대입했을 때 파악될 수 있는 논리적인 chunk를 기반으로 하위 맥락을 파악한다.
//      즉 하위 맥락에 대응되는 예시는, 상위 맥락에서 먼저 파악한 예시를 기반으로 만들어진다.

// */

// // * 현재까지 가장 정확
// // const rule_guide_displayType_example = `
// // a. create an step-by-step example that is specific to the largest context.
// // b. the example should be able to be applied as an actual use case.
// // c. for figuring out sub steps of the example, use the example created by the larger example.
// // c-1. The examples of sub step must be derived from the larger examples. (An example that comes up by substituting a larger example)
// // d. repeat the above process to configure sub steps.
// // e. ensure each step is developed in detail. it should show all the steps in a logical order.
// // f. ensure there are enough examples. (for recursive, at least 5 steps)
// // `;

// /*

//   핵심적인 맥락을 추출한다.
//   (첫 번째 레이어에서는 여러 맥락 중에 하나를 추출한다?)

//   * => 여기서 User feedback으로 다른 걸 중점 맥락으로 할 수도 있게??

//     만들어진 example의 시작점과 끝점에 유의해 하위 요소들의 순서를 지정.
//     그걸 바탕으로 예시를 생성.

//   step은 example에서의 flow를 따라야한다.
// */

// // * 모든 스텝은 연결되어야한다? 시작점과 끝점을 바탕으로 연결관계를 찾아라. -> 이 연결관계를 바탕으로 순서를 정리 . '선후관계'를 바탕으로?
// // largest context to smaller context - 각 layer에서의 요소들의 연결관계를 파악. 이 연결관계를 바탕으로 시작점과 끝점 / 대입의 방법.

// /*
//   * input text에 대해 대입할 수 있는 parameter를 지정해라. to create example of input text.
//   *그 parameter를 기준으로 step을 생성해라.

// */

// // '연결구조'
// // const rule_guide_displayType_example = `
// //   (n은 5에서부터 시작)
// //   a. please create step-by-step example of INPUT TEXT in detail.
// //   b. the example should be able to be applied as an actual use case.
// //   c. when creating steps, check if the step has progressed to the end of the given example.
// // `;

// // const rule_guide_displayType_example = `
// //   a. indentify all elements that can be used to create an example.
// //   b. create an step-by-step example in order.
// //   c. every time you create a step, check about all the elements and identify all changes.
// //   d. ensure each step is developed in detail. it should show all the steps in a logical order.
// // `;

// // const rule_guide_displayType_example = `
// //   a. create an step-by-step example that is specific to the largest context.
// //   b. the example should be able to be applied as an actual use case.
// //   c. The examples of sub step must be derived from the larger examples. (An example that comes up by substituting a larger example)
// //   d. repeat the above process to configure sub steps.
// //   e. ensure there are enough examples.
// // `;

// const rule_guide_displayType_logical_progression = `
//   a. Identify the main logical flow or sequence of arguments presented in the INPUT TEXT.
//   b. Break down the content into a series of logical steps or stages that build upon each other.
//   c. Ensure each step logically follows from the previous one, creating a coherent progression toward a conclusion.
//   d. Highlight any assumptions, inferences, or implications made between steps.
//   e. Include all critical points from the INPUT TEXT, maintaining the integrity of the original logical argument.
// `;

// // User Content Rule Format ====================================================

// // * Based on divided element .. 뒤 문장에 RULE: YOU MUST TRANSLATE IT INTO KOREAN. 박으니까 한국어로 나옴. (근데 일본어로는 안된다..)
// const userContent_rule_format_tree = `
//   2. Based on divided elements, generate a JSON structure that represents relationship of elements.  Each element in the JSON should follow this format:
//   {
//     displayType: tree,
//     content: [
//       {
//         "element_name": Name of the element
//         "related_elements": [
//           {
//             "element_name": Name of child element,
//             "relationTypeWithParent": Describe relationship with the parent element,
//             "relationship": [if there is a relationship between elements, display it here],
//             "description": Description explaining relationship and context of this element,
//           },
//         ],
//         description: Description explaining relationship and context of this element,
//       }
//     ]
//   }
// `;
// const userContent_rule_format_list_compare = `
//   2. Based on divided elements, generate a JSON structure that represents relationship of elements. Each element in the JSON should follow this format:
// `;

// //* 현재까지 best
// //* Note: 1-1. Next step must be derived from the previous step based on the logical context of parent step.를 넣어줘서 논리적 연결성을 강화했더니 정확도가 높아짐. (오답률이 낮아졌다.)
// // const userContent_rule_format_example = `
// // Complete a [step-by-step example] following the guide below:
// // {
// //   "target": <Identify main largest element within the logical context of INPUT TEXT>,
// //   "example": <Create a [use case] applicable to the target>,
// //   "steps": [
// //     {
// //       [Creating steps guide]:
// //       1. Generate a step-by-step example that progressively develops the logic or process of INPUT TEXT while maintaining a consistent context.
// //       2. Each step should be a part of the logical progression, leading to a final conclusion.
// //       3. Ensure that the example is created in a consistent logical context in which the INPUT TEXT develops.

// //       "step": <Step number>,
// //       "target": <Identify the element that corresponds to the INPUT TEXT within the logical context>,
// //       "example": <Create a [use case] that applies to the target at this step>,
// //       "description": <Explain the effects when the example is applied>,
// //       "result": {
// //         <Provide specific elements that are changed as a result at this step in the logical context>,
// //       },
// //       "steps": [
// //         [Developing sub steps guide]:
// //         1. Each sub-step should contribute to the overall progression of the parent step, progressing sequentially from the starting point to the endpoint.
// //         1-1. Next step must be derived from the previous step based on the logical context of parent step.
// //         2. Continue expanding each step fully, especially for recursive functions, until the final result is reached.
// //         3. The criteria for subdividing sub-steps should be based on the progression of the higher-level step.
// //         4. The progression of the higher-level steps and the logic of the input text should consistently and logically lead to the final result.
// //       ]
// //     }
// //   ]
// //   Note: When developing each 'steps' array must include all recursive calls made within that step, fully expanded, until the end step is reached.
// // }
// // `;

// // * 저장용 (다른 방식)
// // const userContent_rule_format_example = `
// //   Complete a [step-by-step example] following the [Guideline] and [format] below:
// //   [Guideline]:
// //     - Fully expand each 'steps' array for recursive calls or process, showing all intermediate results.
// //     - Each step should be a part of the logical progression, leading to a final conclusion.
// //     - Next step must be derived from the previous step based on the logical context of parent step.

// //   [format]:
// //   {
// //     "target": <Identify the key element from the INPUT TEXT>,
// //     "example": <Create a relevant use case for the target>,
// //     "steps": [
// //       {
// //         "step": <Step number>,
// //         "target": <Identify the element that corresponds to the INPUT TEXT within the logical context>,
// //         "example": <Create a [use case] that applies to the target at this step>,
// //         "description": <Explain the effects when the example is applied>,
// //         "result": {
// //           <Provide specific elements that are changed as a result at this step in the logical context>
// //         },
// //         "steps": [
// //           <Develop sub-steps sequentially, ensuring each builds logically on the prior step, continuing until final result>
// //           <Each step should be a part of the logical progression, leading to a final conclusion>
// //         ]
// //       }
// //     ]
// //   }
// // `;

// // ! 이제 남은 단계는 solution(3) 이렇게 넣더라도 구체적인 예시가 나오는거.
// //* Create a [use case] -> a [use case]로 바꾸니까 구체적인 예시 나오기시작함. => 통일성이 되게 중요한듯..?
// //* ★ Creating steps guide에서 Create a step-by-step example -> Generate a step-by-step example로 바꾸니까 solution(3)도 제대로 나옴.
// //* 여기 각 프롬프트에다 바로 korean 쓰면 한국어 적용되긴 함.
// //* 각 프로퍼티들의 정확도(프롬프트에서 요구하는대로 나왔는지)가 올라가야 전체 로직의 정확도가 올라감.
// //* 문맥이 길어지면 []로 묶어주는게 도움이 될지도..?

// //* 언어 문제는 SYSTEM 역할 지정 프롬프트에다가 해놓으면 될듯 ..?

// /*
//   * 현재 실험 중인 사항
//   context -> contextual element
//   target에서 identify -> extract

//   use case는 어떠려나..?
// */

// /*
//   * 아래 두 프롬프트 중 뭐가 나을지..
//   1. Generate a step-by-step example that logically builds upon each step, maintaining a consistent context
//   2. Generate a step-by-step example that progressively develops the logic of INPUT TEXT, maintaining a consistent context.

// */

// // Complete a [step-by-step example] following the guide below:
// // {
// //   "target": <Identify main largest element within the logical context of INPUT TEXT>,
// //   "example": <Create a [use case] applicable to the target>,
// //   "steps": [
// //     {
// //       [Creating steps guide]:
// //       1. Generate a step-by-step example that progressively develops the logic or process of INPUT TEXT while maintaining a consistent context.
// //       2. Each step should be a part of the logical progression, leading to a final conclusion.
// //       3. Ensure that the example is created in a consistent logical context in which the INPUT TEXT develops.

// //       "step": <Step number>,
// //       "target": <Identify the element that corresponds to the INPUT TEXT within the logical context>,
// //       "example": <Create a [use case] that applies to the target at this step>,
// //       "description": <Explain the effects when the example is applied>,
// //       "result": {
// //         <Provide specific elements that are changed as a result at this step in the logical context>,
// //       },
// //       "steps": [
// //         [Developing sub steps guide]:
// //         1. Each sub-step should contribute to the overall progression of the parent step, progressing sequentially from the starting point to the endpoint.
// //         1-1. Next step must be derived from the previous step based on the logical context of parent step.
// //         2. Continue expanding each step fully, especially for recursive functions, until the final result is reached.
// //         3. The criteria for subdividing sub-steps should be based on the progression of the higher-level step.
// //         4. The progression of the higher-level steps and the logic of the input text should consistently and logically lead to the final result.
// //       ]
// //     }
// //   ]
// //   Note: When developing each 'steps' array must include all recursive calls made within that step, fully expanded, until the end step is reached.
// // }

// const userContent_rule_format_example = `
//   Complete a [step-by-step example] following the [Guideline] and [format] below:
//   [Guideline]:
//     - Fully expand each 'steps' array for recursive calls or process, showing all intermediate results.
//     - Each step should be a part of the logical progression, leading to a final conclusion.
//     - Next step must be derived from the previous step based on the logical context of parent step.
//     - All steps must be verified to ensure their validity by verifying that they are derived from valid logic.

//   [format]:
//   {
//     "target": <Identify the key element from the INPUT TEXT>,
//     "example": <Create a relevant use case for the target>,
//     "steps": [
//       {
//         "step": <Step number>,
//         "target": <Identify the element that corresponds to the INPUT TEXT within the logical context>,
//         "example": <Create a [use case] that applies to the target at this step>,
//         "description": <Explain the effects when the example is applied>,
//         "result": {
//           <Provide specific elements that are changed as a result at this step in the logical context>
//         },
//         "steps": []
//       }
//     ]
//   }
// `;

// const userContent_rule_format_logical_progression = `
//   Complete a [logical progression] following the guide below:
//   {
//     "title": <Provide a concise title summarizing the logical progression>,
//     "steps": [
//       {
//         "step": <Step number>,
//         "target": <Identify the matching element that corresponds to the INPUT TEXT within the logical context>,
//         "statement": <State the logical statement or argument at this step>,
//         "description": <Explain how this step follows from the previous step and contributes to the overall progression>,
//         "implications": <Describe any implications or consequences of this step>
//         "steps": [ // Optional, for nested logical progressions within this step
//           {
//             "step": <Sub-step number>,
//             "statement": <State the logical statement or argument at this sub-step>,
//             "description": <Explain how this sub-step relates to its parent step>,
//             "implications": <Describe any implications or consequences of this sub-step>
//           }
//         ]
//       }
//     ],
//     "conclusion": <Summarize the final conclusion or outcome of the logical progression>
//   }
// `;

// // ===========================================================================

// let userContent_rule_response = `
//   RESPONSE RULE:
//   - You must respond strictly in only JSON format.

//   [INPUT TEXT]:
// `;

// const setUserContentByInquiryType = (inquiryType: string, input: string) => {
//   switch (inquiryType) {
//     case "tree":
//       return (
//         userContent_rule_guide +
//         rule_guide_displayType_tree +
//         userContent_rule_format_tree +
//         userContent_rule_response +
//         `${input}`
//       );
//     case "list_compare":
//       return (
//         userContent_rule_guide +
//         rule_guide_displayType_list_compare +
//         userContent_rule_format_list_compare +
//         userContent_rule_response +
//         `${input}`
//       );
//     case "example":
//       return (
//         userContent_rule_guide +
//         userContent_rule_format_example +
//         userContent_rule_response +
//         `${input}`
//       );
//     case "logical_progression":
//       return (
//         userContent_rule_guide +
//         rule_guide_displayType_logical_progression +
//         userContent_rule_format_logical_progression +
//         userContent_rule_response +
//         `${input}`
//       );
//     default:
//       throw new Error("Invalid inquiry type");
//   }
// };

// const createPrompt = (
//   input: string,
//   inquiryType: string,
//   topic?: string,
// ): ChatPromptTemplate => {
//   const inputTopic = topic || "topic user inputs";
//   const systemContent_default = `
//     You should understand [INPUT TEXT] and structure it following guideline.
//   `;

//   const systemContent = systemContent_default;
//   const userContent = setUserContentByInquiryType(inquiryType, input);

//   return ChatPromptTemplate.fromMessages([
//     // NOTE: input으로 중괄호가 들어올 경우 ChatPromptTemplate이 이를 프롬프트의 {}로 인식하여 오류가 발생하는 경우 생김 - SystemMessage, HumanMessage 객체 사용해서 방지.
//     new SystemMessage(systemContent),
//     new HumanMessage(userContent),
//   ]);
// };

// export async function POST(request: Request) {
//   try {
//     const {
//       input,
//       topic,
//       inquiryType,
//       serviceInfo,
//       getOnlyPrompt = false,
//     } = await request.json();

//     if (getOnlyPrompt)
//       return NextResponse.json({
//         output: createPrompt(input, inquiryType, topic).promptMessages[1],
//       });
//     const checkService = (service: string) => {
//       if (service === "groq") {
//         return new ChatGroq({
//           apiKey: process.env.GROQ_API_KEY2,
//           model: serviceInfo.model,
//           temperature: 0.1,
//           maxTokens: undefined,
//           maxRetries: 2,
//           // other params...
//         });
//       }

//       // TODO: 추후 GPT 연동? (Usage Limits 옵션이 있어서 안전성 높음)
//       return new ChatGroq({
//         apiKey: process.env.GROQ_API_KEY2,
//         model: serviceInfo.model,
//         temperature: 0.2,
//         maxTokens: undefined,
//         maxRetries: 2,
//         // other params...
//       });
//     };
//     const llm = checkService(serviceInfo.service);

//     const prompt = createPrompt(input, inquiryType, topic);
//     console.log(prompt.promptMessages[1]);
//     const chain = prompt.pipe(llm).pipe(new StringOutputParser());
//     const output = await chain.invoke({});

//     return NextResponse.json({ output });
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error.message },
//       { status: 500 },
//     );
//   }
// }
