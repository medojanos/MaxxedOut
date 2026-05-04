import Constants from "expo-constants";
import { useCallback, useContext } from "react";
import { Context } from "./Provider";
import { getData } from "./Storage";

export default function useApiFetch() {
    const { Logout, setRefreshToken, setAccessToken } = useContext(Context);

    const apiFetch = async (endpoint, options = {}) => {
        const accessToken = await getData("access_token");
        const response = await fetch(
            Constants.expoConfig.extra.API_URL + endpoint,
            {
                ...options,
                headers: {
                    ...(options.headers),
                    Authorization: accessToken,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status !== 401) return response;

        const refreshToken = await getData("refresh_token");
        const refresh_response = await fetch(
            Constants.expoConfig.extra.API_URL + "/auth/refresh",
            {
                method: "POST",
                headers: {
                    Authorization: refreshToken,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!refresh_response.ok) {
            Logout();
        }

        const refresh_data = await refresh_response.json();

        setRefreshToken(refresh_data.data.refresh_token);
        setAccessToken(refresh_data.data.access_token);

        return fetch(
            Constants.expoConfig.extra.API_URL + endpoint,
            {
                ...options,
                headers: {
                    ...(options.headers),
                    Authorization: refresh_data.data.access_token,
                    "Content-Type": "application/json",
                },
            }
        );
    };

    return apiFetch;
}