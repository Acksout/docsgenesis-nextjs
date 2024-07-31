'use client';

import {getClerkUsers, getDocumentUsers} from '@/lib/actions/user.actions';
import {useUser} from '@clerk/nextjs';
import {ClientSideSuspense, LiveblocksProvider} from '@liveblocks/react/suspense';
import {ReactNode} from 'react';
import {trefoil} from 'ldrs'

trefoil.register()

const Provider = ({children}: { children: ReactNode }) => {
    const {user: clerkUser} = useUser();

    return (
        <LiveblocksProvider
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={async ({userIds}) => {
                const users = await getClerkUsers({userIds});

                return users;
            }}
            resolveMentionSuggestions={async ({text, roomId}) => {
                const roomUsers = await getDocumentUsers({
                    roomId,
                    currentUser: clerkUser?.emailAddresses[0].emailAddress!,
                    text,
                })

                return roomUsers;
            }}
        >
            <ClientSideSuspense fallback={<div className="flex justify-center items-center h-screen">
                <l-trefoil
                    size="40"
                    stroke="4"
                    stroke-length="0.15"
                    bg-opacity="0.1"
                    speed="1.4"
                    color="white"
                />
            </div>}>
                {children}
            </ClientSideSuspense>
        </LiveblocksProvider>
    )
}

export default Provider