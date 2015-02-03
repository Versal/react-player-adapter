# Player adapter component

An adapter component for React apps that makes it easy to integrate with a `VersalPlayerAPI` instance.

## Usage

[See example app](https://github.com/Versal/react-gadget-example/blob/master/components/app/index.jsx)

## How it works

Wrapping your app's root component with a `PlayerAdapter` has the following benefits:

* The wrapped component won't render until `VersalPlayerAPI`'s initial data is ready.

* Gadget learner state, attributes, and `editable` boolean flow into the wrapped component via `props`.

* Several mutators are available to the wrapped component for persisting data. All data persisted to player flows back into the wrapped component via props (yup, uni-directional).

* `PlayerAdapter` takes a prop called `propertySheets` with your app's desired property sheet schema. Data from property sheets will flow back into your app via `props` along with other data.

### State

Four methods are provided for updating state:

#### `attributesSetterFor(key)`
#### `learnerStateSetterFor(key)`

These allow you to create a setter for a specific field for use by the component that's responsible for handling the corresponding input. This is the preferred method when using `PlayerAdapter`.

##### Example

```
onComponentWillMount: function() {
  this.onCardsChanged = this.attributesSetterFor('cards');
  this.onPositionChanged = this.learnerStateSetterFor('position');
}

render: function() {
  return (
    <Cards
      cards={this.props.cards}
      onCardsChange={this.onCardsChanged} />
    <Progress
      position={this.props.position}
      onPositionChange={this.onPositionChanged} />
  );
}
```

#### `setStateAndAttributes(attributes)`
#### `setStateAndLearnerState(learnerState)`

These lower level methods (which are called by `attributesSetterFor` and `learnerStateSetterFor`) call `setState` and `setAttributes`/`setLearnerState`. Since React's state is set via `setState` the data will flow into your app via props and changes will be persisted via the `VersalPlayerApi` instance by calling `this.player.setAttributes/setLearnerState`.

TODO all mutators should take an argument that debounces it or the function that it returns.
