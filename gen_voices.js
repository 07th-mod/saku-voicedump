const fs = require('fs')
const borders = [91467, 92223] // Performance: set to first and last line number in voice_order.txt that's relevant to the current arc
const voiceLines = fs.readFileSync('voice_order.txt', 'utf-8').split('\n').filter(x => x.trim()).map(x => {
  const s = x.split('|')
  return { file: s[0].trim(), line: s[1].trim() }
}).slice(borders[0] - 10, borders[1] + 10)
const processedLines = []
let script = fs.readFileSync('0.utf.bak', 'utf-8') // Read from a backup of the original 0.utf file
script = script.replace(/。/g, '') // A lot of Entergram lines don't include periods... just get rid of them...
for (const v of voiceLines) {
  const vline = v.line.replace(/。/g, '')
  if (script.includes(vline)) {
    script = script.replace(vline, `:dwave 0, "voice\\${v.file.replace('/', '\\')}.ogg":${vline}`)
      .replace(/　:dwave/g, ':dwave') // eslint-disable-line
    processedLines.push(v.file)
  }
}
// The following calculates "voice ranges":
// it is essentially assumed that the arc will include all the voice lines
// for each character from their first to their last detected line.
// Even if some lines were not successfully processed, we'll want to add them to the voice pack *anyway*, so that we can insert them into the script manually later.
// This is bound to fail on older arcs (as they don't label voices per-character),
// but fuck it.
const processedChars = processedLines.map(x => x.split('_'))
const charValues = {}
for (const char of processedChars) {
  const charName = char[0]
  const charVoice = char[1]
  if (!charValues[charName]) {
    charValues[charName] = { min: charVoice, max: charVoice }
  }
  if (Number(charVoice) > Number(charValues[charName].max)) {
    charValues[charName].max = charVoice
  }
  if (Number(charVoice) < Number(charValues[charName].min)) {
    charValues[charName].min = charVoice
  }
}
let out = 'mkdir voice\n'
for (const char of Object.keys(charValues)) {
  out += `mkdir voice/${char.split('/')[0]};`
  out += `for i in {${charValues[char].min}..${charValues[char].max}};`
  out += `do ffmpeg -i ${char.toLowerCase()}_$i.opus voice/${char}_$i.ogg;done\n`
}
fs.writeFileSync('needvoices.sh', out, 'utf-8')
// Uncomment this to generate the actual script:
// fs.writeFileSync('0.utf', script, 'utf-8')
