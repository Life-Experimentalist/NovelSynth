import type { AIService } from "@/types";
import { GeminiService } from "./gemini";
import { OpenAIService } from "./openai";
import { AnthropicService } from "./anthropic";

// Service Registry - Add new services here
class ServiceRegistry {
  private services: Map<string, AIService> = new Map();

  constructor() {
    this.registerDefaultServices();
  }

  private registerDefaultServices() {
    // Register Gemini as default
    this.register(new GeminiService());

    // Register additional services
    this.register(new OpenAIService());
    this.register(new AnthropicService());
  }

  register(service: AIService) {
    this.services.set(service.id, service);
  }

  get(serviceId: string): AIService | undefined {
    return this.services.get(serviceId);
  }

  getAll(): AIService[] {
    return Array.from(this.services.values());
  }

  getConfiguredServices(): AIService[] {
    return this.getAll().filter((service) => service.isConfigured);
  }

  getDefaultService(): AIService {
    return this.get("gemini") || this.getAll()[0];
  }

  getByMode(mode: string): AIService[] {
    return this.getAll().filter((service) =>
      service.models.some((model) => model.supportedModes.includes(mode as any))
    );
  }
}

export const serviceRegistry = new ServiceRegistry();
