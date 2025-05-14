import { useLoaderData } from "react-router";
import DashboardTeacherModule from "~/modules/DashboardTeacherModule";
import { dashboardTeacherLoader } from "~/modules/DashboardTeacherModule/loader";

export const loader = dashboardTeacherLoader;

export default function Index() {
    const loaderData = useLoaderData<typeof dashboardTeacherLoader>();
    
    return <DashboardTeacherModule
        
    />
}