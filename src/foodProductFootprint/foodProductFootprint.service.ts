import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CalculateFoodProductDto } from "./dto/calculate-foodProduct";
import { FoodProductFootprint } from "./foodProductFootprint.entity";

@Injectable()
export class FoodProductFootprintService {
  constructor(
    @InjectRepository(FoodProductFootprint)
    private foodProductFootprintRepo: Repository<FoodProductFootprint>,
    @InjectRepository(CarbonEmissionFactor)
    private carbonEmissionFactorsRepo: Repository<CarbonEmissionFactor>
  ) {}

  findAll(): Promise<FoodProductFootprint[]> {
    return this.foodProductFootprintRepo.find();
  }

  findByName(name: string): Promise<FoodProductFootprint[]> {
    return this.foodProductFootprintRepo.find({
      where: { name: name },
    });
  }

  async calculateAndSaveFootprint(
    dto: CalculateFoodProductDto
  ): Promise<FoodProductFootprint> {
    const { productName, ingredients } = dto;

    let totalCarbonFootprint = 0;
    for (const ingredient of ingredients) {
      const factor = await this.carbonEmissionFactorsRepo.findOne({
        where: { name: ingredient.name, unit: ingredient.unit },
      });

      if (!factor) {
        // If any ingredient factor is missing, result is null
        const footprint = this.foodProductFootprintRepo.create({
          name: productName,
          totalCarbonFootprintKg: null,
        });
        return await this.foodProductFootprintRepo.save(footprint);
      }

      totalCarbonFootprint +=
        ingredient.quantity * factor.emissionCO2eInKgPerUnit;
    }

    const footprint = this.foodProductFootprintRepo.create({
      name: productName,
      totalCarbonFootprintKg: totalCarbonFootprint,
    });
    return await this.foodProductFootprintRepo.save(footprint);
  }
}
