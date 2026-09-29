from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_id = "google/gemma-2b"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

def ask_gemma(prompt):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=200
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)

if __name__ == "__main__":
    print("Testing Gemma model...")
    print(ask_gemma("Explain Java in simple words"))
