import { Controller, Get, Req } from '@nestjs/common';
import { SectorInterface } from 'src/interfaces/sector-and-systems';
import { SectorsService } from './sectors.service';

@Controller('sectors')
export class SectorsController {
    constructor(private readonly sectorService: SectorsService) {}
    @Get()
    async findAll(): Promise<any> {
        return this.sectorService.findAll();
      }
}
