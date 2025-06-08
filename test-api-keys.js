// Test script to verify real Gemini API validation with actual keys

async function testRealAPIKeys() {
  console.log("🔬 Testing Real Gemini API Keys...\n");

  // User-provided keys to test
  const testKeys = [
    {
      name: "Key 1",
      key: "AIzaSyAy7cxW5ChnQdhbN4ghelJNmdkb3OrrSo4",
      expected: "Should be tested against real API",
    },
    {
      name: "Key 2",
      key: "AIzaSyAy7cxW5ChnQdhbN4ghelJNmdkb3Orrnot",
      expected: "Should be tested against real API",
    },
  ];

  console.log("🔄 Creating validation service...");

  try {
    // Direct approach using Google Generative AI
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    const validateKey = async (apiKey) => {
      console.log(`🔍 Format check for key: ${apiKey.substring(0, 8)}...`);

      // Basic format validation
      if (!apiKey?.trim()?.startsWith("AIza") || apiKey.trim().length < 35) {
        console.log("❌ Format validation failed");
        return false;
      }
      console.log("✅ Format validation passed");

      try {
        console.log("🌐 Making API request...");
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            maxOutputTokens: 5,
            temperature: 0,
          },
        });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: "1" }] }],
        });

        const response = await result.response;
        const text = response.text();

        if (text && text.length > 0) {
          console.log(`✅ API response received: "${text.trim()}"`);
          return true;
        } else {
          console.log("❌ Empty API response");
          return false;
        }
      } catch (apiError) {
        console.log(`❌ API error: ${apiError.message}`);
        throw apiError;
      }
    };

    console.log("✅ Validation service ready\n");

    // Test each key
    for (let i = 0; i < testKeys.length; i++) {
      const testKey = testKeys[i];
      console.log(`🔑 Testing ${testKey.name}`);
      console.log(`📝 Key: ${testKey.key}`);
      console.log(`📋 Expected: ${testKey.expected}\n`);

      const startTime = Date.now();

      try {
        const isValid = await validateKey(testKey.key);
        const duration = Date.now() - startTime;

        if (isValid) {
          console.log(`🎉 RESULT: VALID ✅ (${duration}ms)`);
          console.log("🎯 This API key is working and can access Gemini!");
        } else {
          console.log(`💔 RESULT: INVALID ❌ (${duration}ms)`);
          console.log("🚫 This API key failed validation");
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        console.log(`💥 RESULT: ERROR ❌ (${duration}ms)`);

        // Provide specific error diagnosis
        const errorMsg = error.message.toLowerCase();
        if (
          errorMsg.includes("api_key_invalid") ||
          errorMsg.includes("invalid")
        ) {
          console.log(
            "🔍 DIAGNOSIS: Invalid API key - The key is malformed or has been revoked"
          );
        } else if (
          errorMsg.includes("permission") ||
          errorMsg.includes("denied")
        ) {
          console.log(
            "🔍 DIAGNOSIS: Permission denied - API key lacks required permissions"
          );
        } else if (errorMsg.includes("quota") || errorMsg.includes("limit")) {
          console.log(
            "🔍 DIAGNOSIS: Quota exceeded - You've hit your usage limit"
          );
        } else if (errorMsg.includes("rate") || errorMsg.includes("limit")) {
          console.log("🔍 DIAGNOSIS: Rate limited - Too many requests");
        } else if (errorMsg.includes("network") || errorMsg.includes("fetch")) {
          console.log(
            "🔍 DIAGNOSIS: Network error - Check internet connection"
          );
        } else {
          console.log(`🔍 DIAGNOSIS: Unknown error - ${error.message}`);
        }
      }

      console.log("═".repeat(70));
      if (i < testKeys.length - 1) {
        console.log(); // Add space between tests
      }
    }

    console.log("\n🏁 API Key testing completed!");
    console.log("💡 If keys are valid, you can use them in the extension!");
  } catch (importError) {
    console.error(
      "❌ Could not import Google Generative AI library:",
      importError.message
    );
    console.log(
      "💡 Make sure @google/generative-ai is installed: npm install @google/generative-ai"
    );
  }
}

// Run the test
testRealAPIKeys().catch((error) => {
  console.error("💥 Test script failed:", error);
});
