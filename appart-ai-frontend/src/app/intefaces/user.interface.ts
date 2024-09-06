// interfaces related to user

export interface AppUser {
    id?: string,
    auth0Id: string,
    email: string,
    phone?: string,
    username: string,
    firstName: string,
    lastName: string,
}

export interface UserInfo {
    phone: string,
    username: string,
    fistName: string,
    lastName: string
}
