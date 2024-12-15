export class IngredientDto {
  name: string;
  quantity: number;
  unit: string;
}

export class CalculateFoodProductDto {
  productName: string;
  ingredients: IngredientDto[];
}
