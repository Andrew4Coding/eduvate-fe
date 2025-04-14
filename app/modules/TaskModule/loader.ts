import type { LoaderFunctionArgs } from "react-router";

export default async function submissionLoader(args: LoaderFunctionArgs) {
    const { params } = args;

    if (!params.id) {
        throw new Error("Submission ID is required");
    }

    return null;
}