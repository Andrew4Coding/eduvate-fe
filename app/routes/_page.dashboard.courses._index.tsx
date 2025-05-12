import CoursesModule from "~/modules/CourseModule";
import coursesLoader from "~/modules/CourseModule/loader";

export {coursesLoader as loader}

export default function Index() {
    return <CoursesModule />
}