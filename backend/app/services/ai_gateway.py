import asyncio
import traceback
import os
import json

# FIX: Disable SSL key logging to prevent Windows permission errors
os.environ["SSLKEYLOGFILE"] = ""

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

# Using OpenAI-compatible HF Router with guaranteed-working model
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)
MODEL_ID = "moonshotai/Kimi-K2-Instruct-0905"

async def generate_roadmap_stream(user_goal: str, skill_level: str):
    prompt = f"""
    You are an expert Curriculum Architect.
    User Goal: {user_goal}
    Skill Level: {skill_level}
    
    Create a detailed, step-by-step learning roadmap.
    Return ONLY a JSON object with the following structure:
    {{
      "roadmap_title": "string",
      "summary": "string",
      "stages": [
        {{
            "stage_id": "string",
            "title": "string",
            "description": "string",
            "learning_objectives": ["string"],
            "project_idea": "string"
        }}
      ]
    }}
    """
    
    # Format the full prompt
    full_prompt = f"{prompt}\n\nUser Goal: {user_goal}\nSkill Level: {skill_level}"
    
    try:
        yield f'0:{json.dumps("[DEBUG] Connecting to HF Router (OpenAI-compatible)...")}\n'
        
        # OpenAI client is sync, so run in executor
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.chat.completions.create(
                model=MODEL_ID,
                messages=[
                    {
                        "role": "user",
                        "content": full_prompt
                    }
                ],
                temperature=0.3,
                max_tokens=1200,
            )
        )
        
        generated_text = response.choices[0].message.content
        
        yield f'0:{json.dumps("[DEBUG] Connection Successful. Processing response...")}\n'
        
        # Simulate streaming by chunking the response for better UX
        chunk_size = 50
        for i in range(0, len(generated_text), chunk_size):
            chunk = generated_text[i:i+chunk_size]
            yield f"0:{json.dumps(chunk)}\n"
            await asyncio.sleep(0.05)  # Small delay for visual streaming effect
                        
    except Exception as e:
        tb = traceback.format_exc()
        yield f'0:{json.dumps(f"[DEBUG] Exception: {str(e)}")}\n'
        yield f'0:{json.dumps(f"[DEBUG] Traceback: {tb}")}\n'
        yield f'0:{json.dumps("[DEBUG] Waiting 3 seconds before activating Mock Protocol...")}\n'
        await asyncio.sleep(3)
        
        yield f'0:{json.dumps("[DEBUG] SWITCHING TO MOCK DATA NOW.")}\n'
        # Fallback Mock Data (Streamed)
        mock_data = '{\n  "roadmap_title": "AI Engineer (Mock)",\n  "summary": "API Connection Failed - Showing Backup Plan.",\n  "stages": [\n    {\n      "stage_id": "1",\n      "title": "Python Basics",\n      "description": "Learn Python syntax.",\n      "learning_objectives": ["Variables", "Loops"],\n      "project_idea": "Calculator"\n    }\n  ]\n}'
        chunk_size = 10
        for i in range(0, len(mock_data), chunk_size):
            chunk = mock_data[i:i+chunk_size]
            yield f"0:{json.dumps(chunk)}\n"
