import { toast } from "react-toastify";

export async function importFiles(data: any) {
    const formData = new FormData();

    // Add the token to the form data
    formData.append("token", data.token);

    // Add each file to the form data under the key "files"
    data.files.forEach((file: File) => {
        formData.append("files", file);  // "files" is the expected key for files on the backend
    });

    const response = await fetch('http://localhost:8080/api/file/executeScript', {
            method: 'POST',
            body: formData,  // The body of the request will be the FormData object
        });

        if (response.ok) {
            const res = await response.json();
            if (res.faultyCount === 0) {
                toast.success("Files imported successfully!");
            } else if (res.faultyCount === data.files.length) {
                toast.error("All files imported with errors!");
            } else {
                toast.warning("Files imported, errors: " + res.faultyCount);
            }
            return res;
        } else if (response.status === 403) {
            toast.warning("User is unauthorized! Redirecting...");
            throw new Error("User is unauthorized! Redirecting...");
        } else {
            toast.error("Failed to import files");
            throw new Error("Failed to import files");
        }
}
