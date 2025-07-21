/*
	* index.ts - Cloudflare Worker의 진입점(핸들러)
	클라우드에서 HTTP 요청을 받으면 어떤 함수를 실행하도록 구성되는데, 이 때 실행되는 함수가 바로 async fetch(req: Request, env: Env)... 
	즉, index.ts는 Cloudflare Worker 전체의 서버 역할을 하는 파일임.

	* 이 코드는 어디서 사용되는지? -----------------------------
	Cloudflare가 wrangler deploy를 통해 이 코드를 배포한 후,
	https://<name>.<account>.workers.dev 주소에서 자동 실행된다.
	즉, 브라우저나 클라이언트가 이 주소로 요청만 보내면

	- 이 코드가 실행되고
	- Groq API를 호출하고
	- 응답을 브라우저로 보내는 프록시 서버 역할을 한다.
  (정리)
		1) 브라우저가 보낸 { model, messages, temperature, ... } JSON 수신
		2) env.GROQ_API_KEY 붙여 Groq API로 그대로 포워딩
		3) Groq 응답(JSON) 을 그대로 반환 (CORS 허용)
	* --------------------------------------------------------

 * Note: ApI KEY 등록 - wrangler secret put GROQ_API_KEY --name groq-proxy  // <- 여기서 groq-proxy는 내가 지정해준 worker 이름임
	* 배포 - wrangler deploy : groq-proxy 디렉토리가 루트 (명령어 이 디렉토리에서 쳐야함.)
	* 
	* 주의:
	* - localhost에서 테스트 할 때는, groq-proxy 디렉토리 루트에서 wrangler dev 명령어로 로컬 서버 실행, 주소를 해당 로컬 ip로 지정해서 테스트.
	* 
	* Test:
	* npx wrangler tail - 배포된 worker의 로그를 실시간으로 확인할 수 있음.
	* console이라거나 바뀌는 값 있으면 wrangler deploy 해 줄 것.
*/

// ❶ ‘포트가 있는 localhost’를 전부 허용하고, 서비스 도메인은 화이트리스트로.
const WHITELIST = new Set(['https://textdiagram.com']);
const isAllowedOrigin = (origin: string) => {
	try {
		const { hostname } = new URL(origin);
		if (hostname === 'localhost') return true; // localhost:ANY PORT
		return WHITELIST.has(origin); // 서비스 도메인
	} catch {
		return false;
	}
};

export interface Env {
	GROQ_API_KEY: string;
}

export default {
	async fetch(req: Request, env: Env) {
		console.log('====================================================================');
		// console.log('req ----------', req);
		console.log('env ----------', env);
		//  (선택) CORS origin 제한
		const origin = req.headers.get('Origin') ?? '';
		const method = req.method.toUpperCase();
		// OPTIONS 요청 (CORS preflight)
		if (method === 'OPTIONS') {
			if (isAllowedOrigin(origin)) {
				return new Response(null, {
					status: 204,
					headers: {
						'Access-Control-Allow-Origin': origin,
						'Access-Control-Allow-Methods': 'POST, OPTIONS',
						'Access-Control-Allow-Headers': req.headers.get('Access-Control-Request-Headers') || 'Content-Type',
						'Access-Control-Max-Age': '86400',
						Vary: 'Origin',
					},
				});
			} else {
				return new Response('Forbidden', { status: 403 });
			}
		}

		// POST만 허용
		if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
		// Origin 검사
		if (!isAllowedOrigin(origin)) return new Response('Forbidden', { status: 403 });

		// 3. 프론트가 보낸 JSON 을 가공 없이 그대로 Groq 에 전달
		const body = await req.text();

		console.log('body ----------', body);

		// 4. Groq API 호출 (키는 Worker Secret)

		/*
		 * Note: Groq 객체로 보낼 때랑 cloudflare에서
		 */
		const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.GROQ_API_KEY}`,
			},
			body,
		}).catch((e) => new Response(JSON.stringify({ error: e.message }), { status: 500 }));

		console.log('groqRes ----------', groqRes);

		if (groqRes.status !== 200) {
			const errText = await groqRes.text();
			console.log('error reason ⇒', errText);
		}

		// 5. Groq 응답을 그대로 브라우저로 전달
		return new Response(groqRes.body, {
			status: groqRes.status,
			headers: {
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Headers': 'Content-Type',
				'Content-Type': 'application/json',
			},
		});
	},
};
