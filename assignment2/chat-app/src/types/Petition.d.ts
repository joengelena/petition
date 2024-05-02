type Petition = {
    petitionId: number,
    title: string,
    description: string,
    creationDate: string,
    imageFileName: string,
    ownerId: number,
    ownerFirstName: number,
    ownerLastName: number,
    supportingCost: number
    categoryId: number,
    ownerImage: string
}

type Category = {
    categoryId: number,
    name: string
}