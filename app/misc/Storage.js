import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setData(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.log(e)
    }
};

export async function getData(key) {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {
        console.log(e)
    }
};