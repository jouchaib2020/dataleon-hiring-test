import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { FoodProductFootprintController } from "./foodProductFootprint.controller";
import { FoodProductFootprint } from "./foodProductFootprint.entity";
import { FoodProductFootprintService } from "./foodProductFootprint.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodProductFootprint, CarbonEmissionFactor]),
  ],
  providers: [FoodProductFootprintService],
  controllers: [FoodProductFootprintController],
})
export class FoodProductFootprintModule {}
