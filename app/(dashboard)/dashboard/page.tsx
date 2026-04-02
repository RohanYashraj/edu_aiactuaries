import { DashboardContent } from "./_components/dashboard-content";

export const metadata = {
  title: "Dashboard — Sri Sathya Sai Institute of Actuaries",
  openGraph: {
    images: [
      {
        url: "/sssia.png",
        width: 1200,
        height: 630,
        alt: "Sri Sathya Sai Institute of Actuaries",
      },
    ],
  },
  twitter: {
    images: ["/sssia.png"],
  },
};

export default function DashboardPage() {
  return <DashboardContent />;
}
