const editMaterial = async (courseCode: string) => {
    console.log(`Enrolling in course with code: ${courseCode}`)
    const response = await fetch("/api/course/enroll", {
        method: "POST",
        body: JSON.stringify({ courseCode })
    })

    const responseData = await response.json()

    return {
        success: responseData.data.error !== true,
        message: responseData.data.message
    }
}