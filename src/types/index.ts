export interface StoryFormData {
    characterName: string;
    backstory: string;
    bonds: string;
    setting: string;
    world: string;
}

export interface StoryResponse {
    story: string;
    loading: boolean;
    error: string | null;
}