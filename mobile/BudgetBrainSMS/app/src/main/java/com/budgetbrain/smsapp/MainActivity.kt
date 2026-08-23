package com.budgetbrain.smsapp

import android.Manifest
import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.budgetbrain.smsapp.ui.theme.BudgetBrainSMSTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            BudgetBrainSMSTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    AppScreen(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun AppScreen(modifier: Modifier = Modifier) {
    val context = androidx.compose.ui.platform.LocalContext.current
    var isLoggedIn by remember { mutableStateOf(hasStoredToken(context)) }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { }

    LaunchedEffect(Unit) {
        permissionLauncher.launch(
            arrayOf(Manifest.permission.RECEIVE_SMS, Manifest.permission.READ_SMS)
        )
    }

    if (isLoggedIn) {
        Column(modifier = modifier.padding(24.dp)) {
            Text("BudgetBrain AI - SMS Sync", style = MaterialTheme.typography.headlineSmall)
            Spacer(modifier = Modifier.height(12.dp))
            Text("✅ Logged in. Listening for transaction SMS in the background.")
        }
    } else {
        LoginScreen(modifier = modifier, onLoginSuccess = { isLoggedIn = true })
    }
}

@Composable
fun LoginScreen(modifier: Modifier = Modifier, onLoginSuccess: () -> Unit) {
    val context = androidx.compose.ui.platform.LocalContext.current
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var error by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }

    Column(modifier = modifier.padding(24.dp).fillMaxWidth()) {
        Text("Log in to BudgetBrain AI", style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            visualTransformation = androidx.compose.ui.text.input.PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(16.dp))

        if (error.isNotEmpty()) {
            Text(error, color = MaterialTheme.colorScheme.error)
            Spacer(modifier = Modifier.height(8.dp))
        }

        Button(
            onClick = {
                loading = true
                error = ""
                ApiClient.login(context, email, password,
                    onSuccess = { loading = false; onLoginSuccess() },
                    onError = { loading = false; error = it }
                )
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !loading
        ) {
            Text(if (loading) "Logging in..." else "Log In")
        }
    }
}

fun hasStoredToken(context: Context): Boolean {
    val prefs = context.getSharedPreferences("budgetbrain_prefs", Context.MODE_PRIVATE)
    return prefs.getString("auth_token", null) != null
}