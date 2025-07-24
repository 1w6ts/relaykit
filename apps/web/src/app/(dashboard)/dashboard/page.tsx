import CreateOrganization from "@/components/dashboard/organization/create";
import OrganizationButton from "@/components/shared/organization-button";

export default function DashboardPage() {
  return (
    <div className="h-screen flex justify-center items-center">
      <OrganizationButton />
      <CreateOrganization />
    </div>
  );
}
