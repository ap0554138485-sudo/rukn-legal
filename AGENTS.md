# Rukn Legal project instructions

This repository contains the Rukn Legal website. Preserve the Arabic-first experience and the existing English page.

## Source and production

- GitHub repository: `https://github.com/ap0554138485-sudo/rukn-legal`
- Production branch: `main`
- Production URL: `https://rukn-legal-vwptio.cranl.net/`
- Cranl project: `Rukn Legal`
- Cranl project ID: `dad57738-b3e5-492b-8580-379a2fff9f82`
- Cranl application: `rukn-legal`
- Cranl application ID: `f3d8bfeb-3712-4ca1-ab4c-72317e96d297`

## Deployment

1. Verify the worktree and test the changed pages.
2. Commit and push changes to `origin/main`.
3. Run `powershell -ExecutionPolicy Bypass -File .\scripts\deploy-cranl.ps1`.
4. Confirm the script reports a completed deployment and verify the production URL.

For a read-only deployment check, run:

`powershell -ExecutionPolicy Bypass -File .\scripts\deploy-cranl.ps1 -CheckOnly`

## Credentials

Never add API keys, passwords, tokens, or the contents of the Cranl configuration file to this repository. On the configured Windows machine, the Cranl API key is already stored by the official CLI at `%USERPROFILE%\.cranl\config.json`. The deployment script reads that credential in memory and never prints it.

See `DEPLOYMENT.md` for the full operational guide.

## Generated Riyadh service pages

The second-wave Riyadh service pages are generated from `scripts/generate-riyadh-wave2.js`. Edit the data and shared template there, then run `npm run generate:riyadh`. Commit both the generator and the resulting HTML files. Do not hand-edit generated Riyadh service pages without updating the generator, or the next regeneration will overwrite the change.
