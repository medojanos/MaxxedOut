import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setData(key, value) {
    try {
        const json = JSON.stringify(value);
        await AsyncStorage.setItem(key, json);
    } catch (e) {
        console.log(e)
    }
};

export async function getData(key) {
    try {
        const json = await AsyncStorage.getItem(key);
        return json != null ? JSON.parse(json) : null;
    } catch (e) {
        console.log(e)
    }
};