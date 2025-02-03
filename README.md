## 프로젝트 개요

주어진 text의 효율적인 이해를 위해, LLM을 이용하여 입력된 TEXT를 각각 tree, example, logical progression의 형태로 제공하는 서비스입니다.

## 사용 기술

- Next14
- typescript
- shadcn ui
- tailwind
- Langchain.js

## 주요 구현 사항

1. 입력한 text를 **llm으로 분석**해 선택한 response type (example, logical progression, tree)의 json 형태로 반환하는 로직 구현

2. LLM으로부터 얻은 JSON을 dfs로 분석해 각 노드를 출력해주는 ui를 **재귀 컴포넌트**로 구현

3. 사용자가 각 diagram을 클릭하면 해당 diagram과 해당되는 text를 **highlight처리**해주는 로직 구현

4. dfs 탐색으로 JSON 노드를 일렬화하고 play 버튼 클릭 시 그에 맞게 **text의 로직을 전개**해주는 기능 구현
