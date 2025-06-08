import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ExtensionStorage,
  Feature,
  AIService,
  ContentMode,
} from "@/types";

interface ExtensionState extends ExtensionStorage {
  // Services
  availableServices: AIService[];
  setApiKey: (serviceId: string, apiKey: string) => void;
  setSelectedModel: (serviceId: string, modelId: string) => void;
  addService: (service: AIService) => void;

  // Features
  availableFeatures: Feature[];
  updateFeatureConfig: (
    featureId: string,
    config: Partial<Feature["config"]>
  ) => void;
  addRecentFeature: (featureId: string) => void;

  // UI State
  setFloatingPopupVisible: (visible: boolean) => void;

  // Prompts
  updatePrompt: (featureId: string, mode: ContentMode, prompt: string) => void;
}

export const useExtensionStore = create<ExtensionState>()(
  persist(
    (set, get) => ({
      // Initial state
      services: {},
      features: {},
      ui: {
        recentFeatures: [],
        floatingPopupEnabled: true,
      },
      prompts: {},
      availableServices: [],
      availableFeatures: [],

      // Service actions
      setApiKey: (serviceId, apiKey) =>
        set((state) => ({
          services: {
            ...state.services,
            [serviceId]: {
              ...state.services[serviceId],
              apiKey,
              isConfigured: true,
            },
          },
        })),

      setSelectedModel: (serviceId, modelId) =>
        set((state) => ({
          services: {
            ...state.services,
            [serviceId]: {
              ...state.services[serviceId],
              selectedModel: modelId,
            },
          },
        })),

      addService: (service) =>
        set((state) => ({
          availableServices: [...state.availableServices, service],
        })),

      // Feature actions
      updateFeatureConfig: (featureId, config) =>
        set((state) => ({
          features: {
            ...state.features,
            [featureId]: {
              ...state.features[featureId],
              ...config,
            },
          },
        })),

      addRecentFeature: (featureId) =>
        set((state) => {
          const recentFeatures = [
            featureId,
            ...state.ui.recentFeatures.filter((id) => id !== featureId),
          ].slice(0, 2);

          return {
            ui: {
              ...state.ui,
              recentFeatures,
            },
          };
        }),

      // UI actions
      setFloatingPopupVisible: (visible) =>
        set((state) => ({
          ui: {
            ...state.ui,
            floatingPopupEnabled: visible,
          },
        })),

      // Prompt actions
      updatePrompt: (featureId, mode, prompt) =>
        set((state) => ({
          prompts: {
            ...state.prompts,
            [featureId]: {
              ...state.prompts[featureId],
              [mode]: prompt,
            },
          },
        })),
    }),
    {
      name: "novelsynth-storage",
      partialize: (state) => ({
        services: state.services,
        features: state.features,
        ui: state.ui,
        prompts: state.prompts,
      }),
    }
  )
);
