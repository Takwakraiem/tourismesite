import webpush from "web-push"

webpush.setVapidDetails(
  "mailto:contact@polyglotte-tourism.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function sendPushNotification(subscription: any, payload: any) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
  } catch (error) {
    console.error("Error sending push notification:", error)
  }
}

export async function notifyNewProgram(programTitle: string) {
  // Get all user subscriptions from database
  // Send push notification to all subscribed users
  const payload = {
    title: "Nouveau programme disponible !",
    body: `Découvrez notre nouveau programme : ${programTitle}`,
    icon: "/logo.jpeg",
    badge: "/logo.jpeg",
    data: {
      url: "/programs",
    },
  }

  // Implementation depends on how you store push subscriptions
}
