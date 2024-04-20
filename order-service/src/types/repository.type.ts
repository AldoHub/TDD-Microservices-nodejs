type Create = (input:unknown) => Promise<{}>
type Find = (input:unknown) => Promise<{}>
type Update = (input:unknown) => Promise<{}>
type Delete = (input:unknown) => Promise<{}>

export type CartRepositoryType = {
    create: Create,
    find: Find,
    update: Update,
    delete: Delete
};