import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Menandai notifikasi sebagai "read", atau membuat jika belum ada
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notificationId = parseInt(params.id);

    if (isNaN(notificationId)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 }
      );
    }

    // Cek apakah notifikasi ada
    let notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      // Jika notifikasi belum ada, tambahkan notifikasi default
      notification = await prisma.notification.create({
        data: {
          id: notificationId,
          message: `New Notification ${notificationId}`, // Default message
          date: new Date(),
          isRead: true,
        },
      });
    } else {
      // Jika notifikasi sudah ada, update status isRead
      notification = await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true, updatedAt: new Date() },
      });
    }

    return NextResponse.json({
      message: "Notification marked as read successfully",
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);

    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
