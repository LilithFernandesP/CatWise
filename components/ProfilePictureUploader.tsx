// components/ProfilePictureUploader.tsx
"use client"

import { useRef, useState } from "react"
import { uploadProfilePicture } from "@/lib/client/uploadProfilePicture"

interface ProfilePictureUploaderProps {
    uid: string
    currentUrl: string
    onPhotoUploaded: (newUrl: string) => void
}

/**
 * Componente que mostra a foto de perfil atual e permite trocar clicando nela.
 * Quando uma nova imagem é escolhida, faz o upload via uploadProfilePicture (client),
 * e depois chama onPhotoUploaded com a URL resultante.
 */
export default function ProfilePictureUploader({
                                                   uid,
                                                   currentUrl,
                                                   onPhotoUploaded,
                                               }: ProfilePictureUploaderProps) {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [preview, setPreview] = useState(currentUrl)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setPreview(URL.createObjectURL(file))

        try {
            const url = await uploadProfilePicture(file, uid)
            onPhotoUploaded(url)
        } catch (err) {
            console.error("Erro no upload da foto:", err)
            // Se quiser, seta preview de volta à currentUrl ao falhar
            setPreview(currentUrl)
        }
    }

    return (
        <div className="relative group w-32 h-32 cursor-pointer">
            <img
                src={preview}
                alt="Foto de perfil"
                className="rounded-full w-full h-full object-cover border-2 border-transparent hover:border-blue-500 transition"
                onClick={() => inputRef.current?.click()}
            />
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={handleFileChange}
            />
            <div className="absolute bottom-0 w-full text-center text-white bg-black bg-opacity-50 text-sm opacity-0 group-hover:opacity-100 transition">
                Trocar foto
            </div>
        </div>
    )
}
