export async function uploadImage(file: File) {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'hangoutWMe');
    data.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');
    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: data,
        });
        const uploadImageURL = await res.json();
        return uploadImageURL.url;
    } catch (e) {
        console.error('Error uploading image:', e);
        throw e;
    }
}
