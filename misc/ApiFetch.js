import Constants from "expo-constants";
import { useContext } from "react";
import { Context } from "./Provider";
import { getData, setData } from "./Storage";

let refreshPromise = null;

export default function useApiFetch() {
    const { Logout, setRefreshToken, setAccessToken } = useContext(Context);

    const apiFetch = async (endpoint, options = {}) => {
        const accessToken = await getData("access_token");
        const apiUrl = Constants.expoConfig.extra.API_URL;
        const makeRequest = token => fetch(apiUrl + endpoint, {
                ...options,
                headers: {
                    ...(options.headers),
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });
        const response = await makeRequest(accessToken);

        if (response.status !== 401) return response;

        const latestAccessToken = await getData("access_token");
        if (latestAccessToken && latestAccessToken !== accessToken) {
            return makeRequest(latestAccessToken);
        }

        if (!refreshPromise) {
            refreshPromise = (async () => {
                const refreshToken = await getData("refresh_token");
                if (!refreshToken) {
                    Logout();
                    return null;
                }

                const refreshResponse = await fetch(apiUrl + "/auth/refresh", {
                    method: "POST",
                    headers: {
                        Authorization: refreshToken,
                        "Content-Type": "application/json",
                    },
                });

                if (!refreshResponse.ok) {
                    Logout();
                    return null;
                }

                const refreshData = await refreshResponse.json();
                const tokens = refreshData?.data;
                if (
                    typeof tokens?.refresh_token !== "string" ||
                    typeof tokens?.access_token !== "string"
                ) {
                    throw new Error("Token refresh response did not contain valid tokens");
                }

                await Promise.all([
                    setData("refresh_token", tokens.refresh_token),
                    setData("access_token", tokens.access_token),
                ]);
                setRefreshToken(tokens.refresh_token);
                setAccessToken(tokens.access_token);

                return tokens.access_token;
            })();
        }

        const currentRefreshPromise = refreshPromise;
        let newAccessToken;
        try {
            newAccessToken = await currentRefreshPromise;
        } finally {
            if (refreshPromise === currentRefreshPromise) refreshPromise = null;
        }
        if (!newAccessToken) return;

        return makeRequest(newAccessToken);
    };

    return apiFetch;
}