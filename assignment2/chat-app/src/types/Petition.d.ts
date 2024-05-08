type Petition = {
    petitionId: number,
    title: string,
    description: string,
    creationDate: string,
    imageFileName: string,
    ownerId: number,
    ownerFirstName: string,
    ownerLastName: string,
    supportingCost: number,
    categoryId: number,
    ownerImage: string,
    numberOfSupporters: number,
    moneyRaised: number,
    supportTiers: SupportTier[]
}

type SupportTier = {
    supportTierId: number,
    title: string,
    description: string,
    cost: number
}

type Category = {
    categoryId: number,
    name: string
}