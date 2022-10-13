import React from "react";
import { registerCommercePlugin } from '@builder.io/commerce-plugin-tools';
import { createClient, session } from '@wix/sdk';
import { WIX_ACCESS_TOKEN_COOKIE, WIX_DOMAIN, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE } from './consts';
// @ts-ignore
import Cookies from 'js-cookie';
// @ts-ignore
import { data } from '@wix/data-backend-public-sdk-poc';

const wixClient = createClient({ data });
export type clientTypes = typeof wixClient;

const fetcher = async (wixDomain: string): Promise<typeof wixClient> => {
  let accessToken = Cookies.get(WIX_ACCESS_TOKEN_COOKIE) ?? ''
  let refreshToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE) ?? ''
  const wixSession = await session({ refreshToken, accessToken }, { domain: wixDomain!} );
  Cookies.set(WIX_ACCESS_TOKEN_COOKIE, wixSession.accessToken!, { expires: 0.3 })
  Cookies.set(WIX_REFRESH_TOKEN_COOKIE, wixSession.refreshToken!, { expires: WIX_COOKIE_EXPIRE })
  wixClient.setSession(wixSession)

  return wixClient
}

class WixStoreService {
  private readonly fetcherPromise: Promise<clientTypes>;

  constructor(domain: string) {
    this.fetcherPromise = fetcher(domain);
  }

  async findProductById(productId: string) {
    const fetcher = await this.fetcherPromise;
    const dataResult = fetcher.data.query({
      collectionName: 'Stores/Products'
    });
    console.log(dataResult);
    return {
      id: 'test-id',
      title: 'Test 1'
    };
  }


  async findProductByCollection(collectionId: string) {
    const fetcher = await this.fetcherPromise;
    const dataResult =  fetcher.data.query({
      collectionName: 'Stores/Products'
    });
    console.log(dataResult);
    return {
      id: 'test-id',
      title: 'Test 1 - find collection'
    }
  }

  async searchProducts(searchText: string) {
    const fetcher = await this.fetcherPromise;
    const dataResult =  fetcher.data.query({
      collectionName: 'Stores/Products'
    });
    console.log(dataResult);
    return [{
      id: 'test-id',
      title: 'Test 1 - search'
    }, {
      id: 'test-id-2',
      title: 'Test 2 - search'
    }]
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
    ctaText: `Connect your swell.is store`,
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
          return service.findProductByCollection(handle);
        },
        async search(search: string) {
          return service.searchProducts(search);
        },

        getRequestObject(id: string) {
          return {
            '@type': '@builder.io/core:Request' as const,
            request: {
              url: `https://${publicKey}@${storeDomain}.swell.store/api/products/${id}`,
            },
            options: {
              product: id,
            },
          };
        },
      },
      category: {
        async findById(id: string) {
          return service.findProductById(id);
        },
        async findByHandle(handle: string) {
          return service.findProductByCollection(handle);
        },
        async search(search: string) {
          return service.searchProducts(search);
        },

        getRequestObject(id: string) {
          return {
            '@type': '@builder.io/core:Request' as const,
            request: {
              // https://{public_key}@{client_id}.swell.store/api/categories/5e31e67be53f9a59d89600f1.
              url: `https://${publicKey}@${storeDomain}.swell.store/api/categories/${id}`,
            },
            options: {
              category: id,
            },
          };
        },
      },
    };
  }
);
