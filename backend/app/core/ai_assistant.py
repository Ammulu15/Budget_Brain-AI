from groq import Groq
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

MODELS_TO_TRY = [
    "openai/gpt-oss-120b",
    "qwen/qwen3.6-27b",
    "openai/gpt-oss-20b",
    "groq/compound",
]

def generate_financial_insights(transactions: list) -> str:
    if not transactions:
        return "Add some transactions first, and I'll analyze your spending patterns!"

    summary_lines = []
    for t in transactions:
        t_date = t.transaction_date.strftime('%Y-%m-%d') if hasattr(t.transaction_date, 'strftime') else str(t.transaction_date)
        summary_lines.append(f"{t_date}: {t.type} of ₹{t.amount} in {t.category}")
    transaction_summary = "\n".join(summary_lines)

    prompt = f"""You are a friendly personal finance assistant. Analyze the following transaction history and provide:
1. A brief summary of spending patterns (2-3 sentences)
2. One specific, actionable budgeting suggestion
3. An encouraging closing note

Keep the entire response under 150 words, warm and conversational tone.

Transactions:
{transaction_summary}
"""

    if not settings.groq_api_key:
        return "Please set your GROQ_API_KEY in .env to enable live AI analysis!"

    client = Groq(api_key=settings.groq_api_key)

    for model_name in MODELS_TO_TRY:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=350,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.warning(f"Failed with model {model_name}: {e}")
            continue

    return "Unable to generate insights at the moment. Please try again shortly!"