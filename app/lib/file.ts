export default async function uploadFileClient(
    file: File,
    fileName: string,
    fileType: string,
): Promise<{ success: boolean; url?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('fileType', fileType);

    const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    }

    );
    if (!uploadResponse.ok) {
        throw new Error('File upload failed');
    }

    const uploadData = await uploadResponse.json();
    return uploadData;
}