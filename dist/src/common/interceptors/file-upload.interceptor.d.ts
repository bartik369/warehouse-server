interface IFileUploadOptions {
    allowedTypes?: string[];
    maxSize: number;
}
export declare const FileUploadInterceptor: (options: IFileUploadOptions) => <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
export {};
