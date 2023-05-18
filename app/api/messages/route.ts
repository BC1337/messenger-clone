import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from "@/app/libs/prismadb"

export async function POST(
    request: Request,
) {
    try {
        const currentUser = await getCurrentUser()
        const body = await request.json()
        const {
            message,
            image,
            conversationId
        } = body

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const newMessage = await prisma.message.create({
            data: {
                body: message as string,
                image: image as string,
                conversation: {
                    connect: {
                        id: conversationId as string
                    }
                }
            }
        })

    } catch (error: any) {
        console.error(error, 'Error_MESSAGES')
        return new NextResponse('Internal Error', { status: 500 })
  }
}