export type Robot = {
    id: string;
    name: string;
    speed: number;
    strength: number;
    creationDate: string;
};

export type ProtoRobot = {
    name?: string;
    speed?: number;
    strength?: number;
    creationDate?: string;
};
