export interface SpoonacularRecipeResponse {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number;
  cookingMinutes: number;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: ExtendedIngredient[];
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  imageType: string;
  nutrition: Nutrition;
  summary: string;
  cuisines: any[];
  dishTypes: string[];
  diets: string[];
  occasions: any[];
  winePairing: WinePairing;
  instructions: string;
  analyzedInstructions: AnalyzedInstruction[];
  originalId: any;
  spoonacularScore: number;
  spoonacularSourceUrl: string;
}

interface ExtendedIngredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: Measures;
}

interface Measures {
  us: Us;
  metric: Metric;
}

interface Us {
  amount: number;
  unitShort: string;
  unitLong: string;
}

interface Metric {
  amount: number;
  unitShort: string;
  unitLong: string;
}

interface Nutrition {
  nutrients: Nutrient[];
  properties: Property[];
  flavonoids: Flavonoid[];
  ingredients: Ingredient[];
  caloricBreakdown: CaloricBreakdown;
  weightPerServing: WeightPerServing;
}

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface Property {
  name: string;
  amount: number;
  unit: string;
}

interface Flavonoid {
  name: string;
  amount: number;
  unit: string;
}

interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  nutrients: Nutrient2[];
}

interface Nutrient2 {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface CaloricBreakdown {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}

interface WeightPerServing {
  amount: number;
  unit: string;
}

interface WinePairing {
  pairedWines: any[];
  pairingText: string;
  productMatches: any[];
}

interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

interface Step {
  number: number;
  step: string;
  ingredients: Ingredient2[];
  equipment: Equipment[];
  length?: Length;
}

interface Ingredient2 {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

interface Equipment {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

interface Length {
  number: number;
  unit: string;
}
