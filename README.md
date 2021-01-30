The `dump.js` script dumps all voiced lines (and lists corresponding voice files) from an Entergram `main.snr` script.
It was created due to all known actual decompilers being broken on the newer script formats (e.g. Umineko Saku).

The `gen_voices.js` script eats a ponscripter `0.utf` file and the output of `dump.js`, and produces an automated voice-only patch for an Umineko game, consisting of an altered script and a `needvoices.sh` file, which can be placed in the `voices/` directory of the Entergram rom dump to extract the voices needed for the specific arc.

The usefulness of this project is dubious and temporary, but it can help with getting the most important part of the script out when nothing else will.
