// tout ce qui est relié aux hobbies

export interface Hobby {
    id: string,
    type: string,
    hobbyName: string,
    frequency: Frequency
}

export interface NewHobby {
    type: string,
    hobbyName: string,
    frequency: Frequency
}




export enum Frequency {
    ReallyHigh = "ReallyHigh",
    High = "High",
    AboveMedium = "AboveMedium",
    Medium = "Medium",
    Low = "Low",
    ReallyLow = "ReallyLow"
}