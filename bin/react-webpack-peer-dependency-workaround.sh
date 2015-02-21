#!/bin/sh

# So, there's some problem with react as a peer dependency in a webpack'd
# application. Specifically if a module, like this one, has react as a peer
# dependency and the application it is used in is bundled via webpack AND the
# module is symlinked (or npm linked, same thing really) the application will
# fail entirely. So, this script works around this by copying the interesting
# module files into an `npm install`'ed version of this module. It's hacky and
# terrible yes but without a better approach this allows work to get done. This
# is only needed while developing this module against a dependent application
# (as is often done using npm link) and it's currently hardcoded to update the
# `react-gadget-example` application. This script should be run whenever the
# source code changes, e.g.

# `wr bin/react-webpack-peer-dependency-workaround.sh *.jsx`

# The above can be started with

# `npm run dev-workaround`

set -e
set -o verbose

cp -r *.jsx ../react-gadget-example/node_modules/react-player-adapter/
