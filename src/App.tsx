import { useState } from "react";
import { StoryDisplay } from "./components/StoryDisplay";
import { Landing } from "./components/Landing";
import { CharacterPrompt } from "./components/CharacterPrompt";
import { generateStory, generateFeelingLuckyForm, generateLoadingText } from "./services/openrouter";
import type { StoryFormData } from "./types";
import "./App.css";

function App() {
  const [story, setStory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [language, setLanguage] = useState<'en' | 'vi'>('en');
  const t = (en: string, vi: string) => (language === 'vi' ? vi : en);
  const [storyModel, setStoryModel] = useState<string>("");
  const [adultEnabled, setAdultEnabled] = useState<boolean>(false);

  const handleGenerateStory = async (formData: StoryFormData, preferredModel?: string) => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const usingProxy = import.meta.env.PROD;

    if (!apiKey && !usingProxy) {
      setError(
        t(
          "OpenRouter API key not found. Please add VITE_OPENROUTER_API_KEY to your .env file",
          "Không tìm thấy API key OpenRouter. Vui lòng thêm VITE_OPENROUTER_API_KEY vào file .env"
        )
      );
      return;
    }

    setLoading(true);
    setError(null);
    setStory("");
    setShowLanding(false);
    setShowPrompt(false);
    setLoadingText("");
    // fire-and-forget AI loading text
    generateLoadingText(apiKey || "", language, preferredModel).then((text) => setLoadingText(text)).catch(() => {});

    try {
      const { story: generatedStory, model } = await generateStory(formData, apiKey || "", language, preferredModel);
      setStory(generatedStory);
      setStoryModel(model);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to generate story", "Không thể tạo truyện")
      );
      setShowLanding(true);
    } finally {
      setLoading(false);
    }
  };

  // Preferred model when 18+ is enabled
  const dolphin = "x-ai/grok-4-fast:free";

  const handleFeelingMagical = async () => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const usingProxy = import.meta.env.PROD;
    if (!apiKey && !usingProxy) {
      setError(
        "OpenRouter API key not found. Please add VITE_OPENROUTER_API_KEY to your .env file"
      );
      return;
    }
    setLoading(true);
    setError(null);
    setLoadingText("");
    generateLoadingText(apiKey || "", language, adultEnabled ? dolphin : undefined).then((text) => setLoadingText(text)).catch(() => {});
    try {
      const form = await generateFeelingLuckyForm(apiKey || "", language, adultEnabled ? dolphin : undefined);
      await handleGenerateStory(form, adultEnabled ? dolphin : undefined);
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : t("Failed to create magical prompt", "Không thể tạo gợi ý bằng phép màu")
      );
    }
  };

  const handleCreateYourOwn = () => {
    setShowLanding(false);
    setShowPrompt(true);
  };

  const handlePromptSubmit = async (data: StoryFormData) => {
    await handleGenerateStory(data, adultEnabled ? dolphin : undefined);
  };

  const handlePromptBack = () => {
    setShowPrompt(false);
    setShowLanding(true);
  };

  const handleStoryBack = () => {
    setStory("");
    setStoryModel("");
    setShowLanding(true);
  };

  return (
    <div className="app">
      {error && (
        <div className="error-toast">
          <span>{error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {showLanding && (
        <Landing
          loading={loading}
          onFeelingMagical={handleFeelingMagical}
          onCreateYourOwn={handleCreateYourOwn}
          language={language}
          onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'vi' : 'en'))}
          adultEnabled={adultEnabled}
          onToggleAdult={() => setAdultEnabled((v) => !v)}
        />
      )}

      {showPrompt && (
        <CharacterPrompt
          loading={loading}
          onSubmit={handlePromptSubmit}
          onBack={handlePromptBack}
          language={language}
        />
      )}

      {!showLanding && !showPrompt && story && !loading && (
        <StoryDisplay story={story} model={storyModel} onBack={handleStoryBack} language={language} />
      )}

      {!showLanding && !showPrompt && loading && (
        <div className="loading-page">
          <div className="loading-content">
            <div className="magic-orb">
              <div className="orb-inner"></div>
              <div className="orb-glow"></div>
            </div>
            <h2>{language === 'vi' ? 'Đang dệt nên câu chuyện...' : 'Weaving Your Tale...'}</h2>
            <p>{loadingText || (language === 'vi' ? 'Phép màu đang vận hành, câu chuyện của bạn sắp thành hình' : 'The magic is at work, crafting your unique story')}</p>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;