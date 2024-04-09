import { TerritoryType } from "../enums/territoryType";

export class Territory {
    key!: string;

    name!: string;

    ownerPolityKey!: string;
    hostStarKey!: string
    type!: TerritoryType
}
