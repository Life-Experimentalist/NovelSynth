import type { Feature } from "@/types";
import { defaultFeatures } from "./defaults";

class FeatureRegistry {
  private features: Map<string, Feature> = new Map();

  constructor() {
    this.registerDefaultFeatures();
  }

  private registerDefaultFeatures() {
    defaultFeatures.forEach((feature) => {
      this.register(feature);
    });
  }

  register(feature: Feature) {
    this.features.set(feature.id, feature);
  }

  get(featureId: string): Feature | undefined {
    return this.features.get(featureId);
  }

  getAll(): Feature[] {
    return Array.from(this.features.values());
  }

  getByCategory(category: Feature["category"]): Feature[] {
    return this.getAll().filter((feature) => feature.category === category);
  }

  getRecent(): Feature[] {
    return this.getAll().filter((feature) => feature.isRecent);
  }

  setRecent(featureId: string, isRecent: boolean) {
    const feature = this.get(featureId);
    if (feature) {
      feature.isRecent = isRecent;
    }
  }
}

export const featureRegistry = new FeatureRegistry();
