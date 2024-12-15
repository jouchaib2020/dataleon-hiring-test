import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("food_product_footprints")
export class FoodProductFootprint extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({ type: "float", nullable: true })
  totalCarbonFootprintKg: number | null;

  constructor(props: { name: string; ingredients: string }) {
    super();

    this.name = props?.name;
  }
}
