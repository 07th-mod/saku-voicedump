const fs = require('fs')
const iconv = require('iconv-lite')
const snr = fs.readFileSync('main.snr')

function replaceAll (str, from, to) { // Node <15 compat
  while (str.includes(from)) {
    str = str.replace(from, to)
  }
  return str
}

function replaceHalfWidth (str) { // Entergram uses half-width katakana instead of hiragana for some stupid reason
  const hwk = '｢｣ｧｨｩｪｫｬｭｮｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｰｯ､ﾟﾞ･?｡'.split('')
  const hir = '「」ぁぃぅぇぉゃゅょあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんーっ、？！…　。'.split('')
  for (let i = 0; i < hwk.length; i++) {
    str = replaceAll(str, hwk[i], hir[i])
  }
  return str
}

let i = 0
let output = ''
while (i < snr.length) {
  if (snr[i] === 0x40 && snr[i + 1] === 0x76) { // Start of voiced line
    i += 2
    const o = []
    while (snr[i] !== 0) { // End of text
      o.push(snr[i])
      i++
    }
    if (o) {
      output += replaceHalfWidth(iconv.decode(Buffer.from(o), 'Shift_JIS')) // Convert from Entergram's encoding to UTF-8
        .split('@v') // Split into separate voice lines
        .map(x => x.replace('.', '|')) // Replace the voice/text separator with something more usable
        .join('\n') // Join so that it's one line per actual voice line
        .replace(/@./g, '') // Get rid of control characters
        .replace(/�/g, '') // Get rid of characters that couldn't be recognised (pretty much always also control garbage)
      output += '\n'
    }
    i--
  }
  i++
}
fs.writeFileSync('voice_order.txt', output, 'utf-8')
