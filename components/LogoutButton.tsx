"use client";

import React from "react";
import {logout} from "@/lib/actions/auth.action";

export default function LogoutButton() {
    async function handleLogout() {
        const confirm = window.confirm("Tem certeza que deseja sair?")
        if (!confirm) return

        await logout();

    }

    return <button className='btn' onClick={handleLogout}>Logout</button>;
}
