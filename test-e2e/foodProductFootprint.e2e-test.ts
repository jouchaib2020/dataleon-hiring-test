import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { dataSource } from "../config/dataSource";
import { AppModule } from "../src/app.module";
import { CarbonEmissionFactor } from "../src/carbonEmissionFactor/carbonEmissionFactor.entity";
import { getTestEmissionFactor } from "../src/seed-dev-data";

beforeAll(async () => {
  await dataSource.initialize();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("FoodProductFootprintController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    await dataSource
      .getRepository(CarbonEmissionFactor)
      .save([
        getTestEmissionFactor("ham"),
        getTestEmissionFactor("cheese"),
        getTestEmissionFactor("tomato"),
        getTestEmissionFactor("flour"),
        getTestEmissionFactor("oliveOil"),
      ]);
  });

  it("POST /food-product-footprint/calculate - success scenario", async () => {
    const payload = {
      productName: "hamCheesePizza",
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
        { name: "flour", quantity: 0.7, unit: "kg" },
        { name: "oliveOil", quantity: 0.3, unit: "kg" },
      ],
    };

    const response = await request(app.getHttpServer())
      .post("/food-product-footprint/calculate")
      .send(payload)
      .expect(201);

    expect(response.body.productName).toBe("hamCheesePizza");
    expect(response.body.totalCarbonFootprintKg).not.toBeNull();
    expect(response.body.id).toBeDefined();
  });

  it("POST /food-product-footprint/calculate - missing factor scenario", async () => {
    // Remove one factor to simulate missing factor
    await dataSource
      .getRepository(CarbonEmissionFactor)
      .delete({ name: "tomato" });

    const payload = {
      productName: "pizzaWithoutTomatoFactor",
      ingredients: [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
        { name: "tomato", quantity: 0.4, unit: "kg" },
      ],
    };

    const response = await request(app.getHttpServer())
      .post("/food-product-footprint/calculate")
      .send(payload)
      .expect(201);

    expect(response.body.productName).toBe("pizzaWithoutTomatoFactor");
    expect(response.body.totalCarbonFootprintKg).toBeNull();
  });

  it("GET /food-product-footprint", async () => {
    await request(app.getHttpServer())
      .post("/food-product-footprint/calculate")
      .send({
        productName: "simpleProduct",
        ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
      });

    const response = await request(app.getHttpServer())
      .get("/food-product-footprint")
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].productName).toBe("simpleProduct");
  });

  it("GET /food-product-footprint/:productName", async () => {
    await request(app.getHttpServer())
      .post("/food-product-footprint/calculate")
      .send({
        productName: "uniqueProduct",
        ingredients: [{ name: "ham", quantity: 0.1, unit: "kg" }],
      });

    const response = await request(app.getHttpServer())
      .get("/food-product-footprint/uniqueProduct")
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].productName).toBe("uniqueProduct");
  });
});
