import React from 'react'
import Image from "next/image";
import Link from "next/link";

const UserCard = ({id, username, name, email, profilePicture}) => {
    return (
        <div className='card-border w-full'>
            <div className=''>
                <Link href={`/users/${username}`} className='flex md:flex-col gap-4 justify-start md:justify-center items-center p-7 card-gradient rounded-2xl min-h-full flex-row md:min-w-[250px] md:min-h-[250px] w-90%'>
                <div className='rounded-2xl '>
                    <Image className='rounded-full w-[50px] h-[50px] md:w-[150px] md:h-[150px]'
                           src={profilePicture ? profilePicture : "profile.svg"} alt={profilePicture} width={150}
                           height={150}/>
                </div>
                <div>
                    <h3 className='md:text-lg text-xl' >{username? username : name}</h3>
                </div>
                </Link>
            </div>
        </div>
    )
}
export default UserCard
