export interface Stage {
    stage_id: string;
    title: string;
    description: string;
    learning_objectives: string[];
    project_idea: string;
}

export interface Roadmap {
    roadmap_title: string;
    summary: string;
    stages: Stage[];
}
