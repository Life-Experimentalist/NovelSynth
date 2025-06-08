// Test script to verify real Gemini API validation with actual keys
import { GeminiService } from "./dist/registry.js";

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

  // Create service instance
  let service;
  try {
    // Try to create a registry instance
    const { serviceRegistry } = await import("./dist/registry.js");
    service = serviceRegistry.get("gemini");

    if (!service) {
      console.error("❌ Could not get Gemini service from registry");
      return;
    }
  } catch (importError) {
    console.log("⚠️ Could not import from dist, trying direct import...");
    try {
      service = new GeminiService();
    } catch (directError) {
      console.error("❌ Could not create GeminiService:", directError.message);
      return;
    }
  }

  console.log("✅ Service loaded successfully\n");

  // Test each key
  for (let i = 0; i < testKeys.length; i++) {
    const testKey = testKeys[i];
    console.log(`🔑 Testing ${testKey.name}: ${testKey.key}`);
    console.log(`📝 Expected: ${testKey.expected}`);

    try {
      console.log("⏳ Validating API key...");
      const startTime = Date.now();

      const isValid = await service.validateApiKey(testKey.key);

      const endTime = Date.now();
      const duration = endTime - startTime;

      if (isValid) {
        console.log(`✅ VALID - Key is working! (${duration}ms)`);

        // Try to fetch models if validation succeeded
        try {
          console.log("📋 Fetching available models...");
          const models = await service.getModels();
          console.log(
            `🎯 Found ${models.length} models:`,
            models.map((m) => m.id).join(", ")
          );
        } catch (modelError) {
          console.log("⚠️ Could not fetch models:", modelError.message);
        }
      } else {
        console.log(`❌ INVALID - Key validation failed (${duration}ms)`);
      }
    } catch (error) {
      console.log(`💥 ERROR during validation:`, error.message);

      // Provide specific error insights
      if (error.message.includes("API_KEY_INVALID")) {
        console.log("🔍 Diagnosis: API key format is wrong or key is disabled");
      } else if (error.message.includes("PERMISSION_DENIED")) {
        console.log("🔍 Diagnosis: API key doesn't have required permissions");
      } else if (error.message.includes("QUOTA_EXCEEDED")) {
        console.log("🔍 Diagnosis: API quota has been exceeded");
      } else if (error.message.includes("fetch")) {
        console.log("🔍 Diagnosis: Network connectivity issue");
      } else {
        console.log("🔍 Diagnosis: Unknown error, check API service status");
      }
    }

    console.log("─".repeat(60));
  }

  console.log("\n🏁 API Key testing completed!");
}

// Run the test
testRealAPIKeys().catch((error) => {
  console.error("💥 Test script failed:", error);
});
