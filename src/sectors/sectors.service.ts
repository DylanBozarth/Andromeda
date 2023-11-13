import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SectorInterface } from 'src/interfaces/sector-and-systems';

@Injectable()
export class SectorsService {
  constructor(@InjectModel('Sector') private sectorModel: Model<SectorInterface>) {}

  async findAll(): Promise<SectorInterface[]> {
    return this.sectorModel.find().exec();
  }
}
