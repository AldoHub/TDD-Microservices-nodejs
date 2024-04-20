import { CartRepositoryType } from "../types/repository.type";

export const CreateCart = async(input: unknown, repo: CartRepositoryType) => {
    const data = repo.create(input);
    return data;
} 

export const GetCart = async(input: unknown, repo: CartRepositoryType) => {
    const data = repo.find(input);
    return data;
} 

export const EditCart = async(input: unknown, repo: CartRepositoryType) => {
    const data = repo.update(input);
    return data;
} 

export const DeleteCart = async(input: unknown, repo: CartRepositoryType) => {
    const data = repo.delete(input);
    return data;
} 