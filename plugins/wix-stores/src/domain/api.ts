// import fetcher from './fetcher';
//
// export interface ProductOperations {
//     getAllProducts: (input?: GetAllProductsOpInput) => Promise<{products: any[]}>
//     getAllCollections: (input?: GetAllProductsOpInput) => Promise<{collections: any[]}>
// }
//
// export type GetAllProductsOpInput = {
//     url?: string
//     variables?: any
//     preview?: boolean
// };
//
// export function productsOperations(wixDomain: string): ProductOperations {
//
//     async function getAllProducts({
//          url = 'stores/v1/products/query',
//          variables,
//          preview
//      }: GetAllProductsOpInput = {}) {
//         return fetcher({url, wixDomain, ...(variables && {variables: JSON.stringify({query: {paging: {limit: variables.first}}})})})
//     }
//
//     async function getAllCollections({
//                                       url = 'stores/v1/collections/query',
//                                       variables,
//                                       preview
//                                   }: GetAllProductsOpInput = {}) {
//         return fetcher({url, wixDomain, ...(variables && {variables: JSON.stringify({query: {paging: {limit: variables.first}}})})})
//     }
//     return {getAllProducts, getAllCollections};
// }

import { buildClient } from './client-builder';

export interface ProductOperations {
    getAllProducts: (input?: GetAllProductsOpInput) => Promise<{products: any[]}>
    getAllCollections: (input?: GetAllProductsOpInput) => Promise<{collections: any[]}>
}

export type GetAllProductsOpInput = {
    url?: string
    variables?: any
    preview?: boolean
};

export function productsOperations(wixDomain: string): ProductOperations {

    async function getAllProducts() {
        const client = await buildClient(wixDomain);
        return client.data.query({
            collectionName: "Stores/Products",
            includeReferencedItems: ["author"],
            dataQuery: {
                paging: {limit: 500}
            }
        })
    }

    async function getAllCollections() {
        const client = await buildClient(wixDomain);
        return client.data.query({
            collectionName: "Stores/Collections",
            includeReferencedItems: ["author"],
            dataQuery: {
                paging: {limit: 500}
            }
        })
    }
    return {getAllProducts, getAllCollections};
}
