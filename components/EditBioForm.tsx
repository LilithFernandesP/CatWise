"use client"

import {useState} from "react"

export default function EditBioForm({currentBio, onSave}: { currentBio: string, onSave: (bio: string) => void }) {
    const [bio, setBio] = useState(currentBio)

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                const confirm = window.confirm("Tem certeza que deseja atualizar sua bio?");
                if (confirm) {
                    onSave(bio);
                }
            }}
            className="flex flex-col gap-2 md:w-[90%]"
        >
              <textarea
                  className="p-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-0 max-h-40 overflow-auto resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escreva sua bio"
              />
            <button type="submit" className="w-[30%] self-end bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Atualizar Bio
            </button>
        </form>
    )
}
