import prisma from "@/app/libs/prismadb"
import getCurrentUser from "./getCurrentUser"
// delete this and promise if this breaks
import { FullConversationType } from "../types"

const getConversations = async (): Promise<FullConversationType[]> => {
    const currentUser = await getCurrentUser()

    if (!currentUser?.id) {
        return []
    }


    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc"
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
        })

        return conversations as FullConversationType[]
    } catch (error: any) {
        return []
    }
}

export default getConversations