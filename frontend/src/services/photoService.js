import $api from "../http";

export class PhotoService {
    static async addPhoto(photo){
        const res = await $api.post("/addphoto", photo, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    static async removePhoto(id) {
        const res = await $api.post("/removephoto", {id});
        return res;
    }
}