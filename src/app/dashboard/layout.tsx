
import Slider from "../components/Slider-dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <>
      <div className="md:flex">
        {/* Sidebar */}
        <Slider />
        <div className='flex-1 md:ml-64'>
          <div className='p-5'>
            {/* Render the page content based on route */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
