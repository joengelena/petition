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

type CreatePetition = {
    title: string,
    description: string,
    categoryId: number,
    supportTiers: CreateSupportTier[]
}

type EditPetition = {
    title?: string,
    description?: string,
    categoryId?: number
}

type CreateSupportTier = {
    tempId: number,
    title: string,
    description: string,
    cost: number | string
}

type EditSupportTier = {
    tempId?: number,
    title?: string,
    description?: string,
    cost?: number | string
}

type SupportTier = {
    supportTierId: number,
    title: string,
    description: string,
    cost: number | string
}

type Supporter = {
    supportId: number,
    supportTierId: number,
    supporterId: number,
    supporterFirstName: string,
    supporterLastName: string,
    message: string,
    timestamp: string
}

type Category = {
    categoryId: number,
    name: string
}