import admin from "firebase-admin";
import path from "path";
import {
    createRequire
} from "module";
const require = createRequire(
    import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://appstudyonline-ea97f-default-rtdb.firebaseio.com" // Thay bằng project ID của bạn
    });
}

const db = admin.database();

export default db;