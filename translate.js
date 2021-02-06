const fs = require('fs')
const startLine = 4305 // The line at which the actual story content starts
const scriptLines = fs.readFileSync('0.utf.jp', 'utf-8').split('\n').map(x => x.trim())
const header = scriptLines.slice(0, startLine)
const script = scriptLines.slice(startLine - 1)
const dump = fs.readFileSync('textdump.txt', 'utf-8').split('\n').filter(x => x.trim()).map(x => `^${x.trim()} ^`)
const jpre = /[一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤、…「」！？]+/ug // This *should*, hopefully, cover all Japanese chars
let dumpCount = 0
let done = false
let output = header.join('\n')
for (let line of script) {
  if (!done) {
    if (line.includes(';')) continue // Blindly skip lines that might contain comments -- text lines never do
    const matches = [...line.matchAll(jpre)]
    if (matches) {
      for (const match of matches) {
        if (dumpCount === dump.length) { // Don't try to "translate" more than possible
          done = true
          break
        }
        line = line.replace(match, dump[dumpCount])
        dumpCount++
      }
    }
  }
  output += `${line}\n`
}
fs.writeFileSync('0.utf', output, 'utf-8')
