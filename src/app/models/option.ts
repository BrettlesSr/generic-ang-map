import { OptionType } from "../enums/optionType";

export interface Option {
    label: string;
    fullSearchText: string;
    key: string;
    type: OptionType
    order: number;
}
