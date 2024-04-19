export class PolityStarData {
    polityKey!: string;
    starKey!: string;

    polityName!: string;
    polityBlocName!: string;
    territoryCount: number = 0;
    entanglementCount: number = 0;
    quagmireCount: number = 0;
}

export class NpcStarData {
    npcKey!: string;
    starKey!: string;

    npcName!: string;
    npcBlocName!: string;
    location!: string;
    players: string[] = [];
    notes!: string;
}