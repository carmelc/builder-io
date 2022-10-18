import React from "react";
import { registerCommercePlugin } from '@builder.io/commerce-plugin-tools';
import {
  ProductOperations,
  productsOperations,
  wixMediaToImage,
  WixStoresCollection,
  WixStoresProduct
} from './domain/api';

const productToResource = (product: WixStoresProduct) => ({
  id: product._id,
  title: product.name,
  handle: product.slug,
  image: wixMediaToImage(product.mainMedia),

});

const collectionToResource = (collection: WixStoresCollection) => ({
  id: collection._id,
  title: collection.name,
  handle: collection._id,
  image: wixMediaToImage(collection.mainMedia),
});


class WixStoreService {
  private client: ProductOperations;

  constructor(domain: string) {
    this.client = productsOperations(domain);
  }

  async findProductById(productId: string) {
    const product = (await this.client.queryProducts({id: productId}))?.products?.[0];
    if (!product) {
      throw new Error('No product was found for id: ' + productId);
    }
    return productToResource(product!);
  }


  async findProductBySlug(slugToFind: string) {
    const product = (await this.client.queryProducts({ slug: slugToFind }))?.products?.[0];
    if (!product) {
      throw new Error('No product was found for slug: ' + slugToFind);
    }
    return productToResource(product!);
  }

  async searchProducts(searchString: string) {
    return (await this.client.queryProducts({ searchString })).products
        .map(productToResource);
  }

  async findCollectionById(collectionId: string) {
    const collection = (await this.client.queryCollections({id: collectionId}))?.collections?.[0];
    if (!collection) {
      throw new Error('No collection was found for id: ' + collectionId);
    }
    return collectionToResource(collection!);
  }

  async findCollectionBySlug(slugToFind: string) {
    const collection = (await this.client.queryCollections({slug: slugToFind}))?.collections?.[0];
    if (!collection) {
      throw new Error('No collection was found for slug: ' + slugToFind);
    }
    return collectionToResource(collection!);
  }

  async searchCollections(searchString: string) {
    return (await this.client.queryCollections({searchString})).collections?.map(collectionToResource);
  }
}

registerCommercePlugin(
  {
    name: 'WixStores',
    // should always match package.json package name
    id: '@builder.io/plugin-wix-stores',
    settings: [
      {
        name: 'storeDomain',
        type: 'string',
        required: true,
        helperText:
          'your public site url',
      },
      {
        name: 'publicKey',
        type: 'string',
        required: true,
        helperText:
          'Get Wix Public Key when Kfir will create it',
      },
    ],
    ctaText: `Connect your Wix Store`,
  },
  async settings => {
    const storeDomain = settings.get('storeDomain')?.trim();
    const publicKey = settings.get('publicKey')?.trim();
    const service = new WixStoreService(storeDomain);

    return {
      product: {
        async findById(id: string) {
          return service.findProductById(id);
        },
        async findByHandle(handle: string) {
          return service.findProductBySlug(handle);
        },
        async search(search: string) {
          return service.searchProducts(search);
        },

        getRequestObject(id: string) {
          return {
            '@type': '@builder.io/core:Request' as const,
            request: {
              url: `not in use`,
            },
            options: {
              product: id,
            },
          };
        },
      },
      collection: {
        async findById(id: string) {
          return service.findCollectionById(id);
        },
        async findByHandle(handle: string) {
          return service.findCollectionBySlug(handle);
        },
        async search(search: string) {
          return service.searchCollections(search);
        },

        getRequestObject(id: string) {
          return {
            '@type': '@builder.io/core:Request' as const,
            request: {
              url: `not in use`,
            },
            options: {
              collection: id,
            },
          };
        },
      },
    };
  }
);
