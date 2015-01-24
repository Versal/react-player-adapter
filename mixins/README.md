# Mixins

Generally you'll use the `PlayerAdapter` component but if you're building your own similar component you might want these.

## `PlayerState(playerAPI)`

Syncs the player's state to the component automatically.

## `PlayerStateReady(playerAPI)`

Maintains a boolean value indicating the initial readiness of player data called `this.state.playerStateReady`.

## `PlayerStateRenderer`

Exports a renderer function that renders the player's state as props on a single child element.
