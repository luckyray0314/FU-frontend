type StorageKeys = "token";

export const getStorageValue = (keyName: StorageKeys) => {
  try {
    const value = window.localStorage.getItem(keyName);
    if (value) {
      return JSON.parse(value);
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
};

export const setStorageValue = (keyName: StorageKeys, newValue: any) => {
  try {
    window.localStorage.setItem(keyName, JSON.stringify(newValue));
  } catch (err) { }
}