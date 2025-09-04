export class S3Helper {

    private upload: any;
    private readonly client: any;

    private bucket = 'carebridge-assets';
    private region = 'ca-central-1';


    constructor(client: any, upload: any) {
        this.client = client;
        this.upload = upload;
    }

    /**
     * Upload a file to S3
     * @param {File | Blob} file - File object from input
     * @param {string} key - S3 key/path to upload file
     * @param {function} [onProgress] - Optional progress callback
     * @returns {Promise<string>} - Public URL of uploaded file
     */
    async uploadFile(file, key, onProgress) {
        try {
            const upload = new this.upload({
                client: this.client, params: {
                    Bucket: this.bucket, Key: key, Body: file, ContentType: file.type,
                }, queueSize: 1, partSize: 5 * 1024 * 1024, // 5MB
                leavePartsOnError: false,
            });

            if (onProgress) {
                upload.on('httpUploadProgress', onProgress);
            }

            await upload.done();

            return `https://${this.bucket}.s3.${this.client.config.region}.amazonaws.com/${key}`;
        } catch (err) {
            console.error('S3 upload error:', err);
            throw err;
        }
    }
}
