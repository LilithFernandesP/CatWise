"use client"

import {useState, useRef} from "react"
import Image from "next/image"
import {uploadProfilePicture} from "@/lib/client/uploadProfilePicture"
import {updateUserProfile} from "@/lib/actions/general.action"
import {toast} from "sonner";
import LogoutButton from "@/components/LogoutButton";

interface MyProfileFormProps {
    user: User & { id: string } // ou `{ id: string, username: string, bio?: string, profilePictureUrl?: string }`
}

export default function MyProfileForm({user}: MyProfileFormProps) {
    // Estado local para bio
    const [bio, setBio] = useState(user.bio || "")
    // Estado local para o arquivo escolhido (File), mas ainda não enviado
    const [file, setFile] = useState<File | null>(null)
    // Estado local para URL de preview da imagem (inicial ou selecionada)
    const [previewUrl, setPreviewUrl] = useState(user.profilePictureUrl || "/default-avatar.png")

    const [name, setName] = useState(user.name);
    // Controle para indicar carregamento
    const [isSaving, setIsSaving] = useState(false)


    // Referência ao input file para disparar clique
    const inputRef = useRef<HTMLInputElement | null>(null)

    // Quando o usuário escolhe um novo arquivo, atualizamos `file` e `previewUrl`
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (!selected) return
        setFile(selected)
        // Cria URL temporária para preview
        setPreviewUrl(URL.createObjectURL(selected))
    }

    // Função de "Salvar alterações"
    const handleSaveChanges = async () => {
        // Confirmar a ação
        const confirm = window.confirm("Tem certeza que deseja salvar as alterações?")
        if (!confirm) return

        setIsSaving(true)

        try {
            let photoUrl = user.profilePictureUrl || ""

            // 1) Se selecionou um arquivo novo, faz upload no Storage e obtém a URL
            if (file) {
                photoUrl = await uploadProfilePicture(file, user.id)
            }

            // 2) Chama a Server Action para atualizar Firestore (bio e profilePictureUrl)
            await updateUserProfile({
                uid: user.id,
                bio,
                photoUrl: photoUrl,
            })

            toast("Perfil atualizado com sucesso!")
            location.reload()
        } catch (err) {
            console.error("Erro ao salvar perfil:", err)
            alert("Falha ao salvar. Tente novamente.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="w-full flex flex-col gap-4">
            <h3 className='text-textColor text-4xl p-4'>{user.username}</h3>
            <hr className="border-textColor" />
            <div className='flex flex-wrap md:flex-nowrap gap-10 w-full'>
                <div className="flex flex-row gap-20 items-center content-center ">
                    <div
                        className="relative justify-center  overflow- items-center content-center group cursor-pointer"
                        onClick={() => inputRef.current?.click()}
                    >
                        <img
                            src={previewUrl}
                            alt="Foto de perfil"
                            className="w-[180px] h-[180px] rounded-full object-cover border-2 border-transparent group-hover:border-accent transition"
                        />
                        <div
                            className="absolute bottom-0 w-full text-center text-textColor bg-background bg-opacity-50 text-sm opacity-0 group-hover:opacity-100 transition">
                            Trocar foto
                        </div>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <div className="w-[90%] md:w-[80%] flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <label className="text-textColor text-2xl font-medium">Biografia</label>
                        <textarea
                            className="w-full p-4 textArea h-32 p-2 text-textColor focus:outline-none focus:ring-0 max-h-40 overflow-auto resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Escreva sua bio"
                        />
                    </div>
                </div>
            </div>
            <div className='flex self-end gap-8'>
                <div>
                    <LogoutButton />
                </div>
                <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className={`self-end btn ${
                        isSaving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isSaving ? "Salvando..." : "Salvar alterações"}
                </button>
            </div>
        </div>
    )
}
