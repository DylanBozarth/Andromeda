import { SectorInterface, SystemInterface, NCOInterface } from "src/interfaces/sector-and-systems";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type sectorDocument = HydratedDocument<SectorInterface>;
export class sector {
  @Prop()
  systems: Array<SystemInterface>

  @Prop()
  NCO: Array<NCOInterface>

  @Prop()
  sectorName: String

  @Prop()
  fleetsInTransit: []
}

export const sectorSchema = SchemaFactory.createForClass(sector);