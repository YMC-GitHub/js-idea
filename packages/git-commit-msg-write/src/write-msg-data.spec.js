import { writemsgdata as wmd } from './write-msg-data'
test('write msg data class sugar', () => {
    wmd.type('docs')
        .scope('core')
        .subject('update readme')
        .body('update pkg name,version')
        .issue('')
        .foot('generated by ymc@robot')
    expect(wmd.type()).toStrictEqual(`docs`)
    expect(wmd.scope()).toStrictEqual(`core`)
    expect(wmd.subject()).toStrictEqual(`update readme`)
    expect(wmd.body()).toStrictEqual(`update pkg name,version`)
    expect(wmd.issue()).toStrictEqual(``)
    expect(wmd.foot()).toStrictEqual(`generated by ymc@robot`)
})
