import Slider from "@/app/components/Slider-dashboard";
import RootLayout from "@/app/layout";


export default function DashboardPage() {
  return (
    <RootLayout pageType="dashboard">
        <Slider></Slider>
      {/* Your dashboard page content here */}
      <div>
        <h1>Dashboard</h1>
        <p>Manage your account, users, and more.</p>
      </div>
    </RootLayout>
  );
}
