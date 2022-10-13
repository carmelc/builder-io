import fetcher from './fetcher';

export interface ProductOperations {
    getAllProducts: (input?: GetAllProductsOpInput) => Promise<{products: any[]}>
}

export type GetAllProductsOpInput = {
    url?: string
    variables?: any
    preview?: boolean
};

export function productsOperations(wixDomain: string): ProductOperations {

    async function getAllProducts({
         url = 'stores/v1/products/query',
         variables,
         preview
     }: GetAllProductsOpInput = {}) {
        return fetcher({url, wixDomain, ...(variables && {variables: JSON.stringify({query: {paging: {limit: variables.first}}})})})
    }
    return {getAllProducts};
}