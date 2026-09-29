"""AI Hub API. Run with: uvicorn main:app --host 0.0.0.0 --port $PORT"""
from __future__ import annotations

import base64
import os
import re
import time
from datetime import datetime
from typing import Any
from urllib.parse import quote

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
app = FastAPI(title="AI Hub API", version="1.0.0")
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").strip().rstrip("/")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


class Payload(BaseModel):
    model_config = {"extra": "allow"}


def fail(message: str, status: int = 400) -> None:
    raise HTTPException(status_code=status, detail=message)


async def generate(prompt: str, system: str = "", *, image: str | None = None,
                   image_mime: str = "image/jpeg", audio: str | None = None,
                   mode: str = "auto") -> tuple[str, str]:
    """Try configured providers in order, keeping credentials on the server."""
    google_key = os.getenv("GOOGLE_API_KEY")
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    full_prompt = f"{system}\n\nUser Request: {prompt}" if system else prompt
    async with httpx.AsyncClient(timeout=60) as client:
        if google_key and mode not in ("local", "gemma"):
            data: dict[str, Any] = {"contents": [{"parts": [{"text": full_prompt}]}]}
            if image:
                raw = image.split(",", 1)[-1]
                data["contents"][0]["parts"].append({"inline_data": {"mime_type": image_mime, "data": raw}})
            if audio:
                raw = audio.split(",", 1)[-1]
                data["contents"][0]["parts"].append({"inline_data": {"mime_type": "audio/mp3", "data": raw}})
            for model in ("gemini-2.5-flash", "gemini-2.0-flash"):
                try:
                    response = await client.post(
                        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                        params={"key": google_key}, json=data)
                    response.raise_for_status()
                    text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
                    if text:
                        return text, model
                except (httpx.HTTPError, KeyError, IndexError):
                    continue
        if openrouter_key:
            headers = {"Authorization": f"Bearer {openrouter_key}", "HTTP-Referer": "https://ai-hub-tools.vercel.app", "X-Title": "AI Hub Tools"}
            for model in ("anthropic/claude-sonnet-4", "qwen/qwen3.8-27b:free", "meta-llama/llama-3.1-8b-instruct:free"):
                try:
                    response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers,
                        json={"model": model, "messages": ([{"role": "system", "content": system}] if system else []) + [{"role": "user", "content": full_prompt}], "max_tokens": 2000})
                    response.raise_for_status()
                    text = response.json()["choices"][0]["message"]["content"]
                    if text:
                        return text, model
                except (httpx.HTTPError, KeyError, IndexError):
                    continue
        # Preserve the legacy local Ollama fallback.
        try:
            message: dict[str, Any] = {"role": "user", "content": full_prompt}
            if image: message["images"] = [image.split(",", 1)[-1]]
            if audio: message["audio"] = [audio.split(",", 1)[-1]]
            response = await client.post("http://localhost:11434/api/chat", json={"model": "gemma4:e4b", "messages": [message], "stream": False}, timeout=8)
            response.raise_for_status()
            text = response.json().get("message", {}).get("content", "")
            if text:
                return text, "Gemma 4 E4B (Ollama Local)"
        except httpx.HTTPError:
            pass
    # Retain the original app's offline demo mode when cloud/local providers are unavailable.
    if image:
        raise HTTPException(status_code=503, detail="Image analysis requires an available Gemini provider.")
    return offline_response(prompt), "Offline simulator"


def offline_response(prompt: str) -> str:
    query = prompt.strip()
    lower = query.lower()
    if re.match(r"^(hi|hello|hey|namaste)\b", lower):
        return "Hello! I'm the AI Hub assistant. I can help with coding, creative writing, AI tool recommendations, summaries, and analysis. What would you like to work on?"
    if any(word in lower for word in ("summarize", "summary", "tldr")):
        return "I’m in offline mode, so I can’t generate a model-based summary right now. You can still use the document and text tools when an AI provider is configured."
    if any(word in lower for word in ("pricing", "price", "plan", "subscription")):
        return "AI Hub plans: Free ($0/mo) for basic use, Pro ($19/mo) for expanded model access, and Team ($49/mo) for collaboration features. See the Pricing page for current details."
    if any(word in lower for word in ("tool", "recommend", "best")):
        return "For general chat, try ChatGPT or Claude; for coding, GitHub Copilot; and for image creation, Midjourney or Flux. Browse AI Hub's search page to compare tools."
    if any(word in lower for word in ("calculate", "math", "solve")):
        return "I’m offline and can’t reliably solve this with an AI model right now. Please configure a Gemini or OpenRouter API key and try again."
    return f"AI providers are unavailable, so I couldn’t generate a response for: {query[:160]}"


@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "AI Hub API is online"}

@app.post("/ai")
async def ai(payload: Payload):
    prompt = str(payload.model_extra.get("prompt", "")).strip()
    if not prompt:
        fail("Missing prompt")
    try:
        data = payload.model_extra
        text, model = await generate(prompt, image=(data.get("images") or [None])[0], audio=(data.get("audio") or [None])[0], mode=str(data.get("mode", "auto")))
    except HTTPException as exc:
        if exc.status_code != 503: raise
        text, model = f"[Offline Mock] AI providers are unavailable. Your prompt: {prompt[:50]}...", "Offline fallback"
    return {"response": text, "output": text, "model_used": model, "latency": "Variable"}

@app.post("/api/ai/chat")
async def chat(payload: Payload):
    data = payload.model_extra
    message = str(data.get("message", "")).strip()
    if not message: fail("Message is required")
    history = data.get("conversationHistory") or []
    context = "\n".join(f"{m.get('sender','user')}: {m.get('content','')}" for m in history if isinstance(m, dict))
    system = "You are the AI Utilities Assistant for AI Hub. Help users choose AI tools, explain platform features and pricing, and answer clearly in a friendly professional tone.\n\nPrevious conversation:\n" + (context or "None")
    reply, _ = await generate(message, system)
    return {"reply": reply}

@app.post("/api/ai/summarize")
async def summarize(payload: Payload):
    data = payload.model_extra; text = str(data.get("text", "")).strip()
    if not text: fail("Text is required")
    length = {"short": "very brief", "long": "detailed"}.get(data.get("length"), "medium-length")
    result, _ = await generate(f"Please summarize the following text:\n\n{text}", f"You are a helpful assistant that creates {length} summaries of text.")
    return {"summary": result}

@app.post("/api/ai/translate")
async def translate(payload: Payload):
    data = payload.model_extra; text = str(data.get("text", "")).strip()
    source, target = data.get("sourceLang"), data.get("targetLang")
    if not text: fail("Text is required")
    if not source or not target: fail("Source and target languages are required")
    if source == target: fail("Source and target languages cannot be the same")
    names = {"en":"English","es":"Spanish","fr":"French","de":"German","it":"Italian","pt":"Portuguese","ru":"Russian","ja":"Japanese","ko":"Korean","zh":"Chinese","ar":"Arabic","hi":"Hindi"}
    result, _ = await generate(f"Translate the following text from {names.get(source, source)} to {names.get(target, target)}:\n\n{text}", "You are a professional translator. Translate naturally, preserve meaning, tone, and formatting. Return only the translated text.")
    return {"translation": result.strip()}

@app.post("/api/ai/generate-code")
async def code(payload: Payload):
    data = payload.model_extra; prompt = str(data.get("prompt", "")).strip()
    if not prompt: fail("Prompt is required")
    language = str(data.get("language") or "the requested language")
    result, _ = await generate(prompt, f"You are an expert {language} programmer. Generate complete, runnable, well-commented, production-ready code. Return only raw code without markdown fences.")
    return {"code": re.sub(r"```[\w-]*\n?|```", "", result).strip()}

@app.post("/api/ai/generate-ideas")
async def ideas(payload: Payload):
    data = payload.model_extra; topic = str(data.get("topic", "")).strip()
    if not topic: fail("Topic is required")
    category = str(data.get("category") or "general")
    result, _ = await generate(f"Topic: {topic}\nCategory: {category}\n\nProvide 5 bullet points with a short description for each.", f"You are a creative brainstorming assistant. Generate 5 unique and practical ideas for a {category} project related to the topic.")
    parsed = [re.sub(r"^[-*•\d.]+\s*", "", line).strip() for line in result.splitlines() if line.strip()]
    return {"ideas": parsed[:5]}

@app.post("/api/ai/analyze-image")
async def analyze_image(payload: Payload):
    data = payload.model_extra; image = data.get("image")
    if not image: fail("Image data is required")
    if not os.getenv("GOOGLE_API_KEY"): fail("Image analysis requires GOOGLE_API_KEY", 503)
    result, _ = await generate(str(data.get("prompt") or "Analyze this image in detail. Provide a description, objects detected, mood, and tags."), image=str(image), image_mime=str(data.get("mimeType") or "image/jpeg"))
    description = result.splitlines()[0] if result else "No description available."
    objects = [{"name": line.split(":",1)[0].strip(), "confidence": 90} for line in result.split("Objects",1)[-1].splitlines() if ":" in line][:5] if "Objects" in result else []
    return {"analysis": {"description": description, "objects": objects or [{"name":"Image Scene","confidence":95}], "colors":[{"name":"Detected","percentage":100}], "text":"Parsed", "mood":"Professional", "tags":re.findall(r"#\w+", result)[:5] or ["ai","analyzed"]}}

@app.post("/api/ai/document")
async def document(payload: Payload):
    data = payload.model_extra; content = data.get("documentContent")
    if not content: fail("Document content is required")
    file_type = data.get("fileType")
    if file_type in ("pdf", "docx"):
        try:
            raw = base64.b64decode(str(content))
            if file_type == "pdf":
                from pypdf import PdfReader
                import io
                content = "\n".join(page.extract_text() or "" for page in PdfReader(io.BytesIO(raw)).pages)
            else:
                import mammoth
                content = mammoth.extract_raw_text(fileobj=__import__("io").BytesIO(raw)).value
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Failed to parse {file_type.upper()} file") from exc
    kind = data.get("type")
    query = str(data.get("query") or "Summarize the document")
    task = "Summarize the document" if kind == "summary" else f"Answer the user question: {query}"
    guidance = ({"short": "Give 5–7 concise bullet points.", "medium": "Write 1–2 structured paragraphs covering the main topics.", "detailed": "Use headings and explain key ideas, definitions, processes, and steps."}.get(query, "Use a clear, concise summary.") if kind == "summary" else "Start with a direct answer and explain it using specific details from the document.")
    system = "Answer only using the provided document. Do not use outside knowledge or guess. If absent, say 'This information is not available in the uploaded document.' Use clear, student-friendly language. " + guidance + "\n\nDOCUMENT CONTENT:\n" + str(content)[:30000] + "\n\nTask: " + task
    reply, _ = await generate(query if kind != "summary" else "Summarize this document", system)
    return {"reply": reply}

@app.post("/api/ai/powerful-solve")
async def powerful_solve(payload: Payload):
    query = str(payload.model_extra.get("query", "")).strip()
    if not query: fail("Query is required")
    result, model = await generate(query, "You are a careful expert problem-solving assistant. Analyze the request, reason through it, and give a clear final answer.")
    return {"result": result, "process": f"AI orchestration ({model})", "intent": "text"}

@app.post("/api/ai-hub")
async def ai_hub(payload: Payload):
    data = payload.model_extra; prompt = str(data.get("prompt", "")).strip()
    if not prompt: fail("Missing prompt")
    started = time.monotonic()
    lowered = prompt.lower()
    modalities: list[str] = []
    if re.search(r"\b(draw|paint|sketch|generate an image|generate image|create an image|photo of|picture of|illustration of|render of)\b", lowered): modalities.append("image")
    if re.search(r"\b(generate video|create video|make a video|animate|animation of)\b", lowered): modalities.append("video")
    if re.search(r"\b(generate audio|create audio|make music|compose a song|text to speech|tts)\b", lowered): modalities.append("audio")
    if not modalities or re.search(r"\b(and|with|explain|write|poem|code|story|description|text)\b", lowered): modalities.append("text")
    outputs: list[dict[str, str]] = []
    for modality in modalities:
        if modality == "image":
            image_url = f"https://image.pollinations.ai/prompt/{quote(prompt)}"
            key = os.getenv("OPENROUTER_API_KEY")
            if key:
                try:
                    async with httpx.AsyncClient(timeout=60) as client:
                        response = await client.post("https://openrouter.ai/api/v1/chat/completions", headers={"Authorization": f"Bearer {key}", "X-Title": "AI Hub Tools"}, json={"model":"black-forest-labs/flux-1.1-pro","messages":[{"role":"user","content":prompt}]})
                        if response.is_success:
                            image_url = response.json().get("choices", [{}])[0].get("message", {}).get("content") or image_url
                except (httpx.HTTPError, KeyError, IndexError):
                    pass
            outputs.append({"type":"image","output":image_url,"model_used":"Flux 1.1 Pro","latency":"Fast"})
        elif modality == "video":
            outputs.append({"type":"video","output":"https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190828_27_Supernova_01_preview.mp4","model_used":"Runway (Mock)","latency":"Instant"})
        elif modality == "audio":
            outputs.append({"type":"audio","output":"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3","model_used":"ElevenLabs (Mock)","latency":"Instant"})
        else:
            text, model = await generate(prompt, image=(data.get("images") or [None])[0], audio=(data.get("audio") or [None])[0], mode=str(data.get("mode", "auto")))
            outputs.append({"type":"text","output":text,"model_used":model,"latency":"Standard"})
    if len(outputs) > 1:
        return {"output":"Parallel Tasks Completed.","outputs":outputs,"type":"multi","model_used":"Parallel Ensemble","latency":f"{time.monotonic()-started:.1f}s"}
    output = outputs[0]
    return {**output,"result":output["output"],"latency":f"{time.monotonic()-started:.1f}s"}

@app.post("/agent")
async def agent(payload: Payload):
    query = str(payload.model_extra.get("query", "")).strip()
    if not query: fail("Query is required")
    try:
        from AI_Hub_Agent import AIHubAgent
        answer = AIHubAgent().run(query)
        return {"answer": answer, "status": "success"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Agent unavailable: {exc}") from exc

@app.post("/save")
async def save():
    return {"message": "Saved successfully"}

@app.post("/test-api")
async def test_api():
    """Check the server-configured Gemini key without accepting secrets from clients."""
    key = os.getenv("GOOGLE_API_KEY")
    if not key:
        return {"status": "error", "message": "GOOGLE_API_KEY is not configured on the backend."}
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            response = await client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
                params={"key": key},
                json={"contents": [{"parts": [{"text": "Say 'API Key Working'"}]}]},
            )
            response.raise_for_status()
            return {"status": "success", "response": response.json()}
        except httpx.HTTPError as exc:
            return {"status": "error", "message": str(exc)}
