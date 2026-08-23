package com.budgetbrain.smsapp

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log

data class ParsedTransaction(
    val amount: Double,
    val type: String, // "income" or "expense"
    val merchant: String
)

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            for (sms in messages) {
                val body = sms.messageBody ?: ""
                Log.d("SmsReceiver", "Raw SMS: $body")

                val parsed = parseTransactionSms(body)
                if (parsed != null) {
                    Log.d("SmsReceiver", "Parsed: ₹${parsed.amount} | ${parsed.type} | ${parsed.merchant}")
                    ApiClient.sendTransaction(context, parsed)
                } else {
                    Log.d("SmsReceiver", "Not a recognized transaction SMS")
                }
            }
        }
    }

    private fun parseTransactionSms(body: String): ParsedTransaction? {
        val amountRegex = Regex("""(?:Rs\.?|INR)\s?([\d,]+\.?\d*)""", RegexOption.IGNORE_CASE)
        val amountMatch = amountRegex.find(body) ?: return null
        val amount = amountMatch.groupValues[1].replace(",", "").toDoubleOrNull() ?: return null

        val lowerBody = body.lowercase()
        val type = when {
            lowerBody.contains("debited") || lowerBody.contains("spent") || lowerBody.contains("paid") || lowerBody.contains("withdrawn") -> "expense"
            lowerBody.contains("credited") || lowerBody.contains("received") || lowerBody.contains("deposited") || lowerBody.contains("added to") -> "income"
            else -> return null
        }

        val merchantRegex = Regex("""(?:to|at)\s+([A-Z][A-Za-z0-9\s]{2,30})""")
        val merchant = merchantRegex.find(body)?.groupValues?.get(1)?.trim() ?: "Unknown"

        return ParsedTransaction(amount, type, merchant)
    }
}