from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.groq_api_key)

def generate_financial_insights(transactions: list) -> str:
    if not transactions:
        return "Add some transactions first, and I'll analyze your spending patterns!"

    summary_lines = []
    for t in transactions:
        summary_lines.append(f"{t.transaction_date.strftime('%Y-%m-%d')}: {t.type} of ₹{t.amount} in {t.category}")
    transaction_summary = "\n".join(summary_lines)

    prompt = f"""You are a friendly personal finance assistant. Analyze the following transaction history and provide:
1. A brief summary of spending patterns (2-3 sentences)
2. One specific, actionable budgeting suggestion
3. An encouraging closing note

Keep the entire response under 150 words, warm and conversational tone.

Transactions:
{transaction_summary}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
    )

    return response.choices[0].message.content