import { NpcStarData, PolityStarData } from "./polityStarData";

export class StarInfo {
    starKey!: string;
    starName!: string;
    planetMap!: string;
    polityStarData: PolityStarData[] = [];
    npcStarData: NpcStarData[] = [];
}