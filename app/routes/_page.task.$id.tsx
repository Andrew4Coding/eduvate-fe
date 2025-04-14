import { useParams } from "react-router";
import TaskModule from "~/modules/TaskModule";
import submissionLoader from "~/modules/TaskModule/loader";

export { submissionLoader as loader };

export default function Index() {
    const params = useParams<{ id: string }>();
    return <TaskModule/>
}