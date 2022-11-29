export = encode

declare const encode: TextHash
declare const decode: function
interface TextHash {
    (option: Option): string
    encode: (option: Option) => string | Buffer
    decode: (option: Option) => string
}
interface Option {
    method: string
    encoding: string
    data: string
}
