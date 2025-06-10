import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {app} from "firebase-admin";
import {storage} from "@/Firebase/client";


/**
 * Faz upload da imagem para Storage em `profilePictures/{uid}/{filename}`
 * e retorna a URL pública.
 */
export async function uploadProfilePicture(file: File, uid: string): Promise<string> {
    if (!file) return "";

    // Cria referência em Storage
    const storageRef = ref(storage, `profilePictures/${uid}/${file.name}`);
    await uploadBytes(storageRef, file);

    // Retorna a URL pública
    return await getDownloadURL(storageRef);

}