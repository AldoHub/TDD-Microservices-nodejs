import { CartRepositoryType } from "../types/repository.type";
import * as Repository from "../repository/cart.repository";
import { CreateCart } from "../service/cart.service";


describe("cartService", () => {

    let repo: CartRepositoryType

    beforeEach(() => {
        repo = Repository.CartRepository;
    });

    afterEach(() => {
        repo = {} as CartRepositoryType;
    });


    it("should return correct data while creating the cart", async() => {

        const mockCart = {
            title: "smartphone",
            amount: 1200
        }

        //mock the request to avoid adding data to the db (when set)
        jest.spyOn(Repository.CartRepository, "create")
        .mockImplementationOnce(() => Promise.resolve({
            message: "fake reponse from cart repository",
            input: mockCart
        }));

        const res = await CreateCart(mockCart, repo);
        expect(res).toEqual({
            message: "fake reponse from cart repository",
            input: mockCart
        });

    });


});