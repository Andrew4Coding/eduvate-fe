import CourseDetailModule from "~/modules/CourseDetailModule";
import courseDetailLoader from "~/modules/CourseDetailModule/loader";

export { courseDetailLoader as loader };

export default function Index() {
    return <CourseDetailModule />
}