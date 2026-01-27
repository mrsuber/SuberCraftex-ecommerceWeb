import { Metadata } from "next";
import { NotificationsClient } from "./NotificationsClient";

export const metadata: Metadata = {
  title: "Notifications | Dashboard",
  description: "View all admin notifications",
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
