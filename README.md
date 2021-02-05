The `dump.js` script dumps all voiced lines (and lists corresponding voice files) from the Umineko Saku `main.snr` script.
It was created due to all known actual decompilers being broken on the newer script format.

The `gen_voices.js` script eats a ponscripter `0.utf` file and the output of `dump.js`, and produces an automated voice-only patch for an Umineko game, consisting of an altered script and a `needvoices.sh` file, which can be placed in the `voices/` directory of the Entergram rom dump to extract the voices needed for the specific arc.

The `translate.js` script eats the output of `gen_voices.js` (or just a plain Japanese script), and tries to translate it into English using a "text dump" (we have these in the legacy Tsubasa/Hane/Saku repos, but they must be concatenated first).

The usefulness of this project is dubious and temporary, but it can help with getting a lot of the job done.
