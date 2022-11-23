import React from "react";
import { registerCommercePlugin } from '@builder.io/commerce-plugin-tools';
// @ts-ignore
import Cookies from 'js-cookie';
import {ProductOperations, productsOperations} from './domain/api';
import type {Resource} from "@builder.io/commerce-plugin-tools/dist/types/interfaces/resource";

const getResourceImage = (entity: any): Resource['image'] => entity.media?.mainMedia?.image ? {
    width: entity.media?.mainMedia?.image.width,
    height: entity.media?.mainMedia?.image.height,
    src: entity.media?.mainMedia?.image.url,
  } : undefined;

const productToResource = (product: any): Resource => ({
  id: product.id,
  title: product.name,
  handle: product.slug,
  image: getResourceImage(product),
});

const collectionToResource = (collection: any): Resource => ({
  id: collection.id,
  title: collection.name,
  handle: collection.id,
  image: getResourceImage(collection),
});


class WixStoreService {
  private client: ProductOperations;

  constructor(domain: string) {
    this.client = productsOperations(domain);
  }

  async findProductById(productId: string) {
    const product = (await this.client.getAllProducts()).products.find(({id}) => productId === id);
    return productToResource(product!);
  }


  async findProductBySlug(slugToFind: string) {
    const product = (await this.client.getAllProducts()).products.find(({slug}) => slugToFind === slug);
    return productToResource(product!);
  }

  async searchProducts(searchText: string) {
    const searchTextLowered = searchText.toLowerCase();
    return (await this.client.getAllProducts()).products
        .map(productToResource)
        .filter(({title}) => title.toLowerCase().indexOf(searchTextLowered) > -1);
  }

  async findCollectionById(collectionId: string) {
    const collection = (await this.client.getAllCollections()).collections.find(({id}) => collectionId === id);
    return collectionToResource(collection!);
  }

  async findCollectionBySlug(slugToFind: string) {
    const collection = (await this.client.getAllCollections()).collections.find(({id}) => slugToFind === id);
    console.log('*** collection ', collection);
    return collectionToResource(collection!);
  }

  async searchCollections(searchText: string) {
    const searchTextLowered = searchText?.toLowerCase();
    return (await this.client.getAllCollections()).collections
        .map(collectionToResource)
        .filter(({title}) => !searchTextLowered || title.toLowerCase().indexOf(searchTextLowered) > -1);
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
              // Symbols and User targeting is not supported :(
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
              // Symbols and User targeting is not supported :(
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
