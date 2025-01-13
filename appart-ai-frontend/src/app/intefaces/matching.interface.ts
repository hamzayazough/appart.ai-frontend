export interface UserAccommodationMatching {
    id: string;
    cons: string[];
    pros: string[];
    score: Score;
    paths: Path[];
}

export interface Leg {
    mode: string;
    polyline: string;
}

export interface Score {
    budget: number;
    distance: number;
    pricePerRoom: number;
    total: number;
}

export interface Path {
    distance: number;
    duration: number;
    legs: Leg[];
    to: Coords;
    from: Coords;
}

export interface Coords {
    latitude: number;
    longitude: number;
}
