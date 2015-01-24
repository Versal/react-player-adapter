# Player adapter component

An adapter component for React apps that makes it easy to integrate with a `VersalPlayerAPI` instance.

## Usage

[See example app](https://github.com/Versal/react-gadget-example/blob/master/components/app/index.jsx)

## How it works

Wrapping your app's root component with a `PlayerAdapter` has the following benefits:

* The wrapped component won't render until `VersalPlayerAPI`'s initial data is ready.

* Gadget learner state, attributes, and `editable` boolean flow into the wrapped component via `props`.

* `this.props.saveAttributes`, and `this.props.saveLearnerState` are available to the wrapped component for persisting data. All data persisted to player flows back into the wrapped component.

* `PlayerAdapter` takes a prop called `propertySheets` with your app's desired property sheet schema. Data from property sheets will flow back into your app via `props` along with other `attributes`.

* Polyfills `Promise` globally. It's needed internally so we patch globally to prevent gadgets from having to. TODO investigate other ways of polyfilling
