export = status

declare const status: Status

interface Status {
    (code_msg: number | string): number | string

    codes: number[]
    code: { [msg: string]: number | undefined }
    empty: { [code: number]: boolean | undefined }
    message: { [code: number]: string | undefined }
    redirect: { [code: number]: boolean | undefined }
    retry: { [code: number]: boolean | undefined }
}
