// export const runtime = 'edge'; // Switch to default nodejs for better stability locally

export async function POST(req: Request) {
    console.log("Frontend Proxy: Received request");
    const { prompt, skill_level } = await req.json();

    try {
        // Forward to FastAPI Backend
        const response = await fetch('http://localhost:8000/api/roadmap/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_goal: prompt,
                skill_level: skill_level || 'beginner',
            }),
        });

        // Proxy the stream
        if (!response.ok) {
            console.error(`Backend Error: ${response.status} ${response.statusText}`);
            return new Response(`Backend Error: ${response.statusText}`, { status: response.status });
        }

        console.log("Frontend Proxy: Backend response OK, streaming...");
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (e) {
        console.error("Frontend Proxy Error:", e);
        return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
    }
}
