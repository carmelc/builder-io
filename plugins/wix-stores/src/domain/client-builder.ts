import {API_URL, WIX_ACCESS_TOKEN_COOKIE, WIX_REFRESH_TOKEN_COOKIE, WIX_COOKIE_EXPIRE} from './consts'
// @ts-ignore
import Cookies from 'js-cookie';
import {createClient, session} from "@wix/sdk";
// @ts-ignore
import { data } from '@wix/data-backend-public-sdk-poc'

export function getError(errors: any[] | null, status: number) {
    errors = errors ?? [{ message: 'Failed to fetch Wix API' }]
    return new Error(`errors: ${errors}, status: ${status}`)
}

export async function getAsyncError(res: Response) {
    const data = await res.json()
    return getError(data.errors, res.status)
}

const handleFetchResponse = async (res: Response) => {
    if (res.ok) {
        return res.json();
    }

    throw await getAsyncError(res)
}

const wixClient = createClient({
    data,
})

export type clientTypes = typeof wixClient

const fetcher: any = async ({
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

export default fetcher
