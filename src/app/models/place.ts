export class Place {
    xStart: number = 0;
    yStart: number = 0;
    xEnd: number = 0;
    yEnd: number = 0;

    key: string = '';
    name: string = '';
    picture: string = '';
    description: string = '';

    get x(): number {
        return (this.xStart + this.xEnd) / 2;
    }

    get y(): number {
        return (this.yStart + this.yEnd) / 2;
    }
}