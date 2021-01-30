const fs = require('fs')
const borders = [91467, 92223] // Performance: set to first and last line number in voice_order.txt that's relevant to the current arc
const voiceLines = fs.readFileSync('voice_order.txt', 'utf-8').split('\n').filter(x => x.trim()).map(x => {
  const s = x.split('|')
  return { file: s[0].trim(), line: s[1].trim() }
}).slice(borders[0] - 10, borders[1] + 10)
const processedLines = []
let script = fs.readFileSync('0.utf.bak', 'utf-8') // Read from a backup of the original 0.utf file
for (const v of voiceLines) {
  if (script.includes(v.line)) {
    script = script.replace(v.line, `:dwave 0, "voice\\${v.file.replace('/', '\\')}.ogg":${v.line}`)
      .replace(/　:dwave/g, ':dwave') // eslint-disable-line
    processedLines.push(v.file)
  }
}
fs.writeFileSync('0.utf', script, 'utf-8')
fs.writeFileSync('needvoices.sh', processedLines.map(x => {
  const dirname = x.split('/')[0]
  const origFname = `${x.toLowerCase()}.opus`
  const destFname = `voice/${x}.ogg`
  return `mkdir voice/${dirname}; ffmpeg -i ${origFname} ${destFname}`
}).join('\n'), 'utf-8')
