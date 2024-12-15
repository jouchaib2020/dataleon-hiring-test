import { Repository } from "typeorm";
import { dataSource, GreenlyDataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { getTestEmissionFactor } from "../seed-dev-data";
import { CalculateFoodProductDto } from "./dto/calculate-foodProduct";
import { FoodProductFootprint } from "./foodProductFootprint.entity";
import { FoodProductFootprintService } from "./foodProductFootprint.service";

let foodProductFootprintService: FoodProductFootprintService;
let carbonEmissionFactorRepository: Repository<CarbonEmissionFactor>;
let foodProductFootprintRepository: Repository<FoodProductFootprint>;

beforeAll(async () => {
  await dataSource.initialize();
  carbonEmissionFactorRepository =
    dataSource.getRepository(CarbonEmissionFactor);
  foodProductFootprintRepository =
    dataSource.getRepository(FoodProductFootprint);
  foodProductFootprintService = new FoodProductFootprintService(
    foodProductFootprintRepository,
    carbonEmissionFactorRepository
  );
});

beforeEach(async () => {
  await GreenlyDataSource.cleanDatabase();
  await carbonEmissionFactorRepository.save([
    getTestEmissionFactor("ham"),
    getTestEmissionFactor("cheese"),
    getTestEmissionFactor("tomato"),
    getTestEmissionFactor("flour"),
    getTestEmissionFactor("oliveOil"),
  ]);
});

describe("FoodProductFootprintService", () => {
  it("should calculate and save footprint when all factors are available", async () => {
    const dto: CalculateFoodProductDto = {
      productName: "hamCheesePizza",
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
      ],
    };

    const result =
      await foodProductFootprintService.calculateAndSaveFootprint(dto);
    expect(result.name).toBe("hamCheesePizza");
    expect(result.totalCarbonFootprintKg).toBeGreaterThan(0);
  });

  it("should return null when one factor is missing", async () => {
    await carbonEmissionFactorRepository.delete({ name: "tomato" }); // Remove tomato to trigger null
    const dto: CalculateFoodProductDto = {
      productName: "incompletePizza",
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" }, // missing factor
      ],
    };

    const result =
      await foodProductFootprintService.calculateAndSaveFootprint(dto);
    expect(result.name).toBe("incompletePizza");
    expect(result.totalCarbonFootprintKg).toBeNull();
  });

  it("should retrieve all footprints", async () => {
    const dto: CalculateFoodProductDto = {
      productName: "someProduct",
      ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
    };
    await foodProductFootprintService.calculateAndSaveFootprint(dto);
    const all = await foodProductFootprintService.findAll();
    expect(all.length).toBe(1);
  });

  it("should retrieve footprints by name", async () => {
    const dto: CalculateFoodProductDto = {
      productName: "specialPizza",
      ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
    };
    await foodProductFootprintService.calculateAndSaveFootprint(dto);
    const byName = await foodProductFootprintService.findByName("specialPizza");
    expect(byName.length).toBe(1);
    expect(byName[0].name).toBe("specialPizza");
  });
});

afterAll(async () => {
  await dataSource.destroy();
});
