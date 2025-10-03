import React from "react";
import "./Landing.css";
import { ThemeToggle } from "./ThemeToggle";

interface LandingProps {
  loading: boolean;
  onFeelingMagical: () => void;
  onCreateYourOwn: () => void;
  language?: 'en' | 'vi';
  onToggleLanguage?: () => void;
  adultEnabled?: boolean;
  onToggleAdult?: () => void;
}

export const Landing: React.FC<LandingProps> = ({
  loading,
  onFeelingMagical,
  onCreateYourOwn,
  language = 'en',
  onToggleLanguage,
  adultEnabled = false,
  onToggleAdult,
}) => {
  const t = (en: string, vi: string) => (language === 'vi' ? vi : en);
  return (
    <div className="landing">
      <ThemeToggle />
      {onToggleLanguage && (
        <button
          className="lang-toggle"
          onClick={onToggleLanguage}
          aria-label={t('Toggle language', 'Chuyển ngôn ngữ')}
          title={t('Toggle language', 'Chuyển ngôn ngữ')}
        >
          {language.toUpperCase()}
        </button>
      )}
      {onToggleAdult && (
        <button
          className={`adult-toggle ${adultEnabled ? 'on' : ''}`}
          onClick={onToggleAdult}
          aria-pressed={adultEnabled}
          aria-label={t('Toggle 18+ mode', 'Bật/tắt chế độ 18+')}
          title={t('Toggle 18+ mode', 'Bật/tắt chế độ 18+')}
        >
          18+
        </button>
      )}

      <main className="landing__content">
        <h1 className="landing__title">{t('Forge Your Fantasy', 'Dệt Nên Huyền Ảo')}</h1>
        <p className="landing__subtitle">{t('Summon a tale from the ether or weave one of your own.', 'Gọi mời một câu chuyện từ hư vô hoặc tự tay dệt nên của riêng bạn.')}</p>

        <div className="landing__prompt">
          <button
            className="btn btn-primary"
            onClick={onFeelingMagical}
            disabled={loading}
          >
            {loading ? t('Conjuring...', 'Đang triệu hồi...') : t("I'm Feeling Magical", 'Tôi Muốn Phép Màu')}
          </button>
          <button className="btn" onClick={onCreateYourOwn} disabled={loading}>
            {t('Create your own', 'Tự bạn sáng tác')}
          </button>
        </div>
      </main>

      <footer className="landing__footer">
        <span>{t('Fantasy Story Generator', 'Trình Tạo Truyện Giả Tưởng')}</span>
      </footer>
    </div>
  );
};
