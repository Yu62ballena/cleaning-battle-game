export type ToyType = 'small' | 'large';

export interface ToyData {
    id: string;
    type: ToyType;
    capacity: number;
    score: number;
    weight: number;
}

export interface GameState {
    timeLeft: number;
    parentScore: number;
    childScore: number;
    baseHp: number;
    baseOpen: boolean;
    parentInventory: ToyData[];
    parentCapacity: number;
    childHasKit: boolean;
    isFinished: boolean;
}
