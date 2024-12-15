import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { CalculateFoodProductDto } from "./dto/calculate-foodProduct";
import { FoodProductFootprint } from "./foodProductFootprint.entity";
import { FoodProductFootprintService } from "./foodProductFootprint.service";

@Controller("food-product-footprint")
export class FoodProductFootprintController {
  constructor(private readonly footPrintService: FoodProductFootprintService) {}

  @Get()
  getAgrybaliseCarbonFootprints(): Promise<FoodProductFootprint[]> {
    Logger.log(
      `[agrybalise-carbon-foot-print] [GET] AgrybaliseCarbonFootPrint: getting all AgrybaliseCarbonFootPrints`
    );
    return this.footPrintService.findAll();
  }

  @Get(":name")
  getByName(@Param("name") name: string): Promise<FoodProductFootprint[]> {
    Logger.log(
      `[agrybalise-carbon-foot-print] [GET] AgrybaliseCarbonFootPrint: getting AgrybaliseCarbonFootPrint by name: ${name}`
    );
    return this.footPrintService.findByName(name);
  }

  @Post("calculate")
  calculateFootPrint(
    @Body() dto: CalculateFoodProductDto
  ): Promise<FoodProductFootprint> {
    Logger.log(
      `[agrybalise-carbon-foot-print] [POST] calculate footprint for product: ${dto.productName} created`
    );
    return this.footPrintService.calculateAndSaveFootprint(dto);
  }
}
