export interface IUploadService {
    uploadFileService: (file: File) => Promise<{
        prediction: string;
    }>;
}