import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class HomeResponseDto {
  id: number;
  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bathrooms;
  }
  number_of_bathrooms: number;
  city: string;
  listed_date: Date;
  price: number;
  land_size: number;
  propertyType: PropertyType;
  realtor_id: number;
  created_at: Date;
  updated_at: Date;
}
