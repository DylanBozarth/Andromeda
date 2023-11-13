import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SectorsService } from './sectors.service';
import { sectorSchema } from '../schema/sectorSchema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Sector', schema: sectorSchema }])],
  providers: [SectorsService],
  exports: [SectorsService, MongooseModule] // <<< Export the service and the MongooseModule here
})
export class SectorModule {}