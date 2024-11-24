// app/page.tsx (General Page)

import RootLayout from "@/app/layout";

export default function Page() {
  return (
    <RootLayout pageType="general">
      {/* Your general page content here */}
      <div>
        <h1>Welcome to the Library</h1>
        <p>Explore our collection of books.</p>
      </div>
    </RootLayout>
  );
}
