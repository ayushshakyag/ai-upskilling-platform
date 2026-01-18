export interface Resource {
    title: string;
    url: string;
}

export interface QuizItem {
    question: string;
    options: string[];
    correct_answer: string;
}

export interface Stage {
    stage_id: string;
    title: string;
    description: string;
    learning_objectives: string[];
    project_idea: string;
    resources?: Resource[];
    quiz?: QuizItem[];
}

export interface Roadmap {
    roadmap_title: string;
    summary: string;
    stages: Stage[];
}
