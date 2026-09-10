package com.budgetbrain.smsapp

import android.content.Context
import android.util.Log
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

object ApiClient {
    private val baseUrl = BuildConfig.API_BASE_URL.trimEnd('/')
    private val client = OkHttpClient()

    fun sendTransaction(context: Context, transaction: ParsedTransaction) {
        val token = getStoredToken(context) ?: run {
            Log.e("ApiClient", "No auth token stored - user needs to log in first")
            return
        }

        val json = JSONObject().apply {
            put("amount", transaction.amount)
            put("type", transaction.type)
            put("category", transaction.merchant)
            put("description", "Auto-captured from SMS")
        }

        val body = json.toString().toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url("$baseUrl/transactions/")
            .addHeader("Authorization", "Bearer $token")
            .post(body)
            .build()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: IOException) {
                Log.e("ApiClient", "Failed to send transaction: ${e.message}")
            }

            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
                Log.d("ApiClient", "Transaction sent: ${response.code}")
                response.close()
            }
        })
    }

    fun login(context: Context, email: String, password: String, onSuccess: () -> Unit, onError: (String) -> Unit) {
        val json = JSONObject().apply {
            put("email", email)
            put("password", password)
        }

        val body = json.toString().toRequestBody("application/json".toMediaType())
        val request = Request.Builder()
            .url("$baseUrl/auth/login")
            .post(body)
            .build()

        client.newCall(request).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: IOException) {
                onError("Network error: ${e.message}")
            }

            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
                val responseBody = response.body?.string()
                if (response.isSuccessful && responseBody != null) {
                    val token = JSONObject(responseBody).getString("access_token")
                    val prefs = context.getSharedPreferences("budgetbrain_prefs", Context.MODE_PRIVATE)
                    prefs.edit().putString("auth_token", token).apply()
                    onSuccess()
                } else {
                    onError("Invalid email or password")
                }
                response.close()
            }
        })
    }

    private fun getStoredToken(context: Context): String? {
        val prefs = context.getSharedPreferences("budgetbrain_prefs", Context.MODE_PRIVATE)
        return prefs.getString("auth_token", null)
    }
}
