import { dataSource } from "../config/dataSource";
import { CarbonEmissionFactor } from "./carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProductFootprint } from "./foodProductFootprint/foodProductFootprint.entity";

export const TEST_CARBON_EMISSION_FACTORS = [
  {
    name: "ham",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.11,
    source: "Agrybalise",
  },
  {
    name: "cheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.12,
    source: "Agrybalise",
  },
  {
    name: "tomato",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.13,
    source: "Agrybalise",
  },
  {
    name: "flour",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "blueCheese",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.34,
    source: "Agrybalise",
  },
  {
    name: "vinegar",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.14,
    source: "Agrybalise",
  },
  {
    name: "beef",
    unit: "kg",
    emissionCO2eInKgPerUnit: 14,
    source: "Agrybalise",
  },
  {
    name: "oliveOil",
    unit: "kg",
    emissionCO2eInKgPerUnit: 0.15,
    source: "Agrybalise",
  },
].map((args) => {
  return new CarbonEmissionFactor({
    name: args.name,
    unit: args.unit,
    emissionCO2eInKgPerUnit: args.emissionCO2eInKgPerUnit,
    source: args.source,
  });
});

export const getTestEmissionFactor = (name: string) => {
  const emissionFactor = TEST_CARBON_EMISSION_FACTORS.find(
    (ef) => ef.name === name
  );
  if (!emissionFactor) {
    throw new Error(
      `test emission factor with name ${name} could not be found`
    );
  }
  return emissionFactor;
};

const TEST_PRODUCTS = [
  {
    name: "hamCheesePizza",
    ingredients: [
      { name: "ham", quantity: 0.1, unit: "kg" },
      { name: "cheese", quantity: 0.15, unit: "kg" },
      { name: "tomato", quantity: 0.4, unit: "kg" },
      { name: "flour", quantity: 0.7, unit: "kg" },
      { name: "oliveOil", quantity: 0.3, unit: "kg" },
    ],
  },
  {
    name: "blueCheeseSalad",
    ingredients: [
      { name: "blueCheese", quantity: 0.2, unit: "kg" },
      { name: "vinegar", quantity: 0.05, unit: "kg" },
      { name: "tomato", quantity: 0.3, unit: "kg" },
    ],
  },
  {
    name: "beefSteak",
    ingredients: [
      { name: "beef", quantity: 0.25, unit: "kg" },
      { name: "oliveOil", quantity: 0.1, unit: "kg" },
      { name: "tomato", quantity: 0.1, unit: "kg" },
    ],
  },
];

export const seedTestCarbonEmissionFactors = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const carbonEmissionFactorsRepo =
    dataSource.getRepository(CarbonEmissionFactor);
  await carbonEmissionFactorsRepo.save(TEST_CARBON_EMISSION_FACTORS);

  const foodProductFootprintRepo =
    dataSource.getRepository(FoodProductFootprint);

  for (const product of TEST_PRODUCTS) {
    let totalCarbonFootprint: number | null = 0;
    for (const ingredient of product.ingredients) {
      const factor = await carbonEmissionFactorsRepo.findOne({
        where: { name: ingredient.name, unit: ingredient.unit },
      });
      if (!factor) {
        totalCarbonFootprint = null;
        break;
      }
      if (totalCarbonFootprint !== null) {
        totalCarbonFootprint +=
          ingredient.quantity * factor.emissionCO2eInKgPerUnit;
      }
    }

    const footprint = foodProductFootprintRepo.create({
      name: product.name,
      totalCarbonFootprintKg: totalCarbonFootprint,
    });
    await foodProductFootprintRepo.save(footprint);
  }
};

if (require.main === module) {
  seedTestCarbonEmissionFactors().catch((e) => console.error(e));
}
