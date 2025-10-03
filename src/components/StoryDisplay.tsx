import React, { useEffect, useMemo, useRef, useState } from "react";

import "./StoryDisplay.css";

interface StoryDisplayProps {
    story: string;
    onBack?: () => void;
    language?: 'en' | 'vi';
    model?: string;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({
    story,
    onBack,
    language = 'en',
    model,
}) => {
    const [displayed, setDisplayed] = useState("");
    const rafRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);
    const cps = 60; // characters per second

    const normalized = useMemo(() => story.replace(/\r\n?/g, "\n"), [story]);

    useEffect(() => {
        // time-based typing so it catches up after tab inactivity
        setDisplayed("");
        startRef.current = null;
        const step = (t: number) => {
            if (startRef.current === null) startRef.current = t;
            const elapsed = t - startRef.current;
            const count = Math.floor((elapsed / 1000) * cps);
            if (count >= normalized.length) {
                setDisplayed(normalized);
                rafRef.current = null;
                return;
            }
            setDisplayed(normalized.slice(0, count));
            rafRef.current = window.requestAnimationFrame(step);
        };
        rafRef.current = window.requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [normalized, cps]);

    const isDone = displayed.length >= normalized.length;

    return (
        <div className="story-page">
            <div className="story-controls">
                {onBack && (
                    <button className="story-btn story-btn-text left" onClick={onBack}>
                        {language === 'vi' ? 'Quay lại' : 'Back'}
                    </button>
                )}
                <div className="right">
                    <button
                        className="story-btn story-btn-text"
                        onClick={() => navigator.clipboard.writeText(story)}
                        title={language === 'vi' ? 'Sao chép' : 'Copy'}
                    >
                        {language === 'vi' ? 'Sao chép' : 'Copy'}
                    </button>
                    <button
                        className="story-btn story-btn-text"
                        onClick={() => {
                            const blob = new Blob([story], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `fantasy-story-${Date.now()}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        title={language === 'vi' ? 'Lưu' : 'Save'}
                    >
                        {language === 'vi' ? 'Lưu' : 'Save'}
                    </button>
                </div>
            </div>
            <div className="story-read">
                {displayed.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="story-paragraph">
                        {paragraph}
                    </p>
                ))}
                {isDone && model && (
                  <div className="story-attrib">
                    {language === 'vi' ? 'Tạo bằng mô hình' : 'Created with model'}: <strong>{model}</strong>
                  </div>
                )}
            </div>
        </div>
    );
}
;