import {WIX_ACCESS_TOKEN_COOKIE, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE} from './consts'
// @ts-ignore
import Cookies from 'js-cookie';
import {createClient, session} from "@wix/sdk";
// @ts-ignore
// import { data } from '@wix/data-backend-public-sdk-poc'

const wixClient = createClient({
    data: {},
    // data,
})

export type clientTypes = typeof wixClient

export const buildClient: any = async ({
                                wixDomain,
                            }: any): Promise<clientTypes> => {
    let accessToken = Cookies.get(WIX_ACCESS_TOKEN_COOKIE) ?? ''
    let refreshToken = Cookies.get(WIX_REFRESH_TOKEN_COOKIE) ?? ''
    const wixSession = await session({refreshToken, accessToken}, {domain: wixDomain!});
    Cookies.set(WIX_ACCESS_TOKEN_COOKIE, wixSession.accessToken!, {expires: 0.3})
    Cookies.set(WIX_REFRESH_TOKEN_COOKIE, wixSession.refreshToken!, {expires: WIX_COOKIE_EXPIRE})
    wixClient.setSession(wixSession)
    return wixClient;
}
