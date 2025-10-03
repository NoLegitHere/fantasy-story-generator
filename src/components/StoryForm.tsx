import React, { useState } from "react";
import type { StoryFormData } from "../types";
import { Sparkles } from "lucide-react";

interface StoryFormProps {
    onSubmit: (data: StoryFormData) => void;
    loading: boolean;
}

export const StoryForm: React.FC<StoryFormProps> = ({
    onSubmit,
    loading,
}) => {
    const [formData, setFormData] = useState<StoryFormData>({
        characterName: "",
        backstory: "",
        bonds: "",
        setting: "",
        world: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const isFormValid =
        formData.characterName &&
        formData.backstory &&
        formData.bonds &&
        formData.setting &&
        formData.world;

    return (
        <form onSubmit={handleSubmit} className="story-form">
            <div className="form-group">
                <label htmlFor="characterName">Character Name *</label>
                <input
                    type="text"
                    id="characterName"
                    name="characterName"
                    value={formData.characterName}
                    onChange={handleChange}
                    placeholder="e.g., Aria Silverwind"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="backstory">Backstory *</label>
                <textarea
                    id="backstory"
                    name="backstory"
                    value={formData.backstory}
                    onChange={handleChange}
                    placeholder="Describe your character's past, motivations, and personality..."
                    rows={4}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="bonds">Bonds & Relationships *</label>
                <textarea
                    id="bonds"
                    name="bonds"
                    value={formData.bonds}
                    onChange={handleChange}
                    placeholder="Who are they connected to? Friends, family, rivals..."
                    rows={3}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="setting">Setting *</label>
                <input
                    type="text"
                    id="setting"
                    name="setting"
                    value={formData.setting}
                    onChange={handleChange}
                    placeholder="e.g., Ancient forest temple, Floating sky city"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="world">World & Lore *</label>
                <textarea
                    id="world"
                    name="world"
                    value={formData.world}
                    onChange={handleChange}
                    placeholder="Describe the world, magic system, culture, technology level..."
                    rows={4}
                    required
                />
            </div>

            <button
                type="submit"
                className="submit-btn"
                disabled={!isFormValid || loading}
            >
                {loading ? (
                    "Generating..."
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate Story
                    </>
                )}
            </button>
        </form>
    );
};