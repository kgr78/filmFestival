type UserRegister = {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

type UserLogin = {
    email: string,
    password: string
}

type UserReturnWithEmail = {
    firstName: string,
    lastName: string,
    email:string
}

type userReturn = {
    firstName: string,
    lastName: string
}

type userPatch = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    currentPassword: string
}

type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    imageFilename: string,
    authToken: string
}