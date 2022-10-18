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

import {buildClient} from './client-builder';
import {media} from '@wix/sdk';


export type WixMedia = {
    src: string,
    type: string,
}

export const wixMediaToImage = (wixMedia?: WixMedia) => (wixMedia?.src && wixMedia?.type === 'Image') ?
    {
        width: 100,
        height: 100,
        src: media.getScaleToFitImageURL(wixMedia.src, 100, 100, {})
    }
    : undefined;

export type WixStoresProduct = {
    _id: string;
    description: string;
    price: { formatted: { price: string } };
    mainMedia?: WixMedia;
    collections: WixStoresCollection[]
    slug: string;
    name: string;
};

export type WixStoresCollection = {
    _id: string;
    name: string;
    mainMedia: WixMedia;
};

export interface ProductOperations {
    queryProducts: (query?: WixStoresProductsQuery) => Promise<{ products: WixStoresProduct[] }>
    queryCollections: (query?: WixStoresCollectionQuery) => Promise<{ collections: WixStoresCollection[] }>
}

export type WixStoresProductsQuery = {
    searchString?: string;
    limit?: number;
    collectionId?: string;
    id?: string;
    slug?: string;
}

export type WixStoresCollectionQuery = {
    searchString?: string;
    limit?: number;
    id?: string;
    slug?: string;
}

export function productsOperations(wixDomain: string): ProductOperations {


    async function queryProducts({
                                     searchString = '',
                                     limit = 100,
                                     collectionId = '',
                                     id = '',
                                     slug = '',
                                 }: WixStoresProductsQuery = {}) {
        const {wixClient} = await buildClient(wixDomain)

        return {
            products: (await wixClient.data.query({
                collectionName: 'Stores/Products',
                omitTotalCount: true,
                include: ['collections'],
                dataQuery: {
                    filter: {
                        ...(searchString ? {
                            name: {$contains: searchString},
                        } : {}),
                        ...(collectionId ? {
                            collections: {$hasSome: [collectionId]},
                        } : {}),
                        ...(slug ? {slug} : {}),
                        ...(id ? {_id: id} : {}),
                    },
                    paging: {
                        limit,
                    }
                }
            })).items as WixStoresProduct[]
        };
    }

    async function queryCollections({
                                        searchString = '',
                                        limit = 100,
                                        id = '',
                                        slug = '',
                                    }: WixStoresCollectionQuery = {}) {
        const {wixClient} = await buildClient(wixDomain)
        const idToSearch = id || slug;

        return {
            collections: (await wixClient.data.query({
                collectionName: 'Stores/Collections',
                omitTotalCount: true,
                dataQuery: {
                    filter: {
                        ...(searchString ? {
                            name: {$contains: searchString},
                        } : {}),
                        ...(idToSearch ? {_id: idToSearch} : {}),
                    },
                    paging: {
                        limit,
                    }
                }
            })).items as WixStoresCollection[]
        };
    }

    return {queryCollections, queryProducts};
}
