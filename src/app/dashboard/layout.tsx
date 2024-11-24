// app/dashboard/layout.tsx
import Slider from "../components/Slider-dashboard";
import RootLayout from "../layout"; // Import the general layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayout pageType="dashboard">
      <div className="flex">
        {/* Sidebar */}
        <Slider />
        <div className='flex-1 md:ml-64'>
          <div className='p-5'>
            {/* Render the page content based on route */}
            {children}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
