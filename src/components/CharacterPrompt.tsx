import React, { useEffect, useRef, useState } from "react";
import "./CharacterPrompt.css";
import { ThemeToggle } from "./ThemeToggle";
import type { StoryFormData } from "../types";

interface CharacterPromptProps {
  loading: boolean;
  onSubmit: (data: StoryFormData) => void;
  onBack: () => void;
  language?: 'en' | 'vi';
}

type Field = keyof StoryFormData;

const buildSteps = (lang: 'en' | 'vi') => {
  if (lang === 'vi') {
    return [
      { field: "characterName" as Field, placeholder: "Tên nhân vật" },
      { field: "backstory" as Field, placeholder: "Quá khứ / xuất thân" },
      { field: "bonds" as Field, placeholder: "Mối quan hệ / ràng buộc" },
      { field: "setting" as Field, placeholder: "Bối cảnh" },
      { field: "world" as Field, placeholder: "Thế giới" },
    ];
  }
  return [
    { field: "characterName" as Field, placeholder: "Character name" },
    { field: "backstory" as Field, placeholder: "Backstory" },
    { field: "bonds" as Field, placeholder: "Bonds" },
    { field: "setting" as Field, placeholder: "Setting" },
    { field: "world" as Field, placeholder: "World" },
  ];
};

export const CharacterPrompt: React.FC<CharacterPromptProps> = ({ loading, onSubmit, onBack, language = 'en' }) => {
  const [index, setIndex] = useState(0);
  const steps = buildSteps(language);
  const [form, setForm] = useState<StoryFormData>({
    characterName: "",
    backstory: "",
    bonds: "",
    setting: "",
    world: "",
  });
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  const handleEnter = () => {
    if (loading) return;
    const field = steps[index].field;
    if (!value.trim()) return;
    const nextForm = { ...form, [field]: value.trim() } as StoryFormData;
    setForm(nextForm);
    setValue("");
    if (index < steps.length - 1) {
      setIndex(index + 1);
    } else {
      onSubmit(nextForm);
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEnter();
    }
  };

  const handleBackClick = () => {
    if (index === 0) {
      onBack();
      return;
    }
    const prevIndex = index - 1;
    const prevField = steps[prevIndex].field;
    setIndex(prevIndex);
    setValue((form[prevField] as string) ?? "");
  };

  return (
    <div className="prompt-screen">
      <ThemeToggle />
      <button className="prompt-back" onClick={handleBackClick} aria-label={language === 'vi' ? 'Quay lại' : 'Back'}>{language === 'vi' ? 'Quay lại' : 'Back'}</button>
      <input
        ref={inputRef}
        className="prompt-input-minimal"
        placeholder={steps[index].placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={loading}
      />
    </div>
  );
}
