import React from 'react'
import {getUsers} from "@/lib/actions/general.action";
import UserCard from "@/components/UserCard";

const Page = async () => {
    const usersList = await getUsers();
    console.log("usersList", usersList);
    return (
        <div className="w-full flex flex-col gap-4">
            <h3 className='p-4'>Neighborhood</h3>
            <hr className="border-textColor" />
            <div className='p-3 flex flex-row flex-wrap gap-8 justify-center'>

            {usersList
                    ? usersList.map((user) => (
                        <div  key={user.id} className="w-[90%] md:w-auto transition-all duration-300 rounded-xl hover:ring-2 hover:ring-secondary hover:ring-offset-2">
                        <UserCard
                            id={user.id}
                            username={user.username}
                            email={user.email}
                            profilePicture={user.profilePictureUrl}
                            name={user.name}
                        />
                        </div>
                    ))
                    : <p>nothing</p>
            }
            </div>

        </div>
    )
}
export default Page
