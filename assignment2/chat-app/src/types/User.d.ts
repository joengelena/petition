type User = {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    imageFilename: string,
    authToken: string
}

type LoginUser = {
    userId: number,
    token: string
}