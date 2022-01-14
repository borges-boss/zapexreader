import {PermissionsAndroid} from "react-native";

const PermissionUtils = {
    hasAndroidWriteStoragePermission: async () => {
        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === "granted";
    },
    hasAndroidReadStoragePermission: async () => {
        const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === "granted";
    },
    hasAndroidCameraPermission: async () => {
        const permission = PermissionsAndroid.PERMISSIONS.CAMERA;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === "granted";
    },

};

export default PermissionUtils;
