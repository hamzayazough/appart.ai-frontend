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

export interface Contact {
    id: string, // id du contact
    userName: string, // le username du contact (ou)
    firstName: string,
    lastName: string,
    contactDate: Date,
    relationType: string
}
