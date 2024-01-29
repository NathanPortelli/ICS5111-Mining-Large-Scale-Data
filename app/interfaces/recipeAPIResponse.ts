export interface RecipeAPIResponse {
    id: number | string,
    title: string,
    image: string,
    instructions: {
        full: string,
        split: string[],
    },
    ingredients: string[],
    calories: number,
}