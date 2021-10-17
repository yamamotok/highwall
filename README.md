HighWall - A React Component
===============================

Since version 0.4.0, this is an ES module (bundled with [Rollup](https://rollupjs.org/)),
which should work fine with [Vite](https://vitejs.dev/) and others.

## Summary

CSS `height: 100vh` is useful when trying to implement native-app-like mobile web application.
However, on mobile Safari for example, it does not work as expected.

This "HighWall" is a React component which realizes `height: 100vh` by measuring viewport's height
every window size change.

## React version

Since this component uses `hook` internally, React version has to be greater than `16.8.0`.

## How to use

Green will fill up the viewport. 
Of course, you can set your own class like `<HighWall className="myClass">`.

```typescript jsx
import {HighWall} from 'HighWall';

const Page: React.FC = () => {
  return (
    <HighWall style={{backgroundColor: 'green'}}>
      <div>Child component</div>
    </HighWall>  
  );
};
```

These settings will show debug information on head-up display.

```typescript jsx
<HighWall debug={true}> // show in default position, leftBottom.
<HighWall debug={{ position: HudPosition.rightTop }}>
```

## Advanced

Maybe sometimes you want to set viewport's height to `min-height` or other properties.
This can be realized by setting `Fitter` function in props.

This sample will set the height to `min-height` instead of `height`.

```typescript jsx
import {HighWall, Fitter} from 'HighWall';

const fitter: Fitter = viewportHeight => ({minHeight: viewportHeight});
<HighWall fitter={fitter}>
</HighWall>
```


## Thanks

This component is inspired by great repos and articles, especially:
- [react-div-100vh](https://github.com/mvasin/react-div-100vh)
- [Addressing the iOS Address Bar in 100vh Layouts](https://medium.com/@susiekim9/how-to-compensate-for-the-ios-viewport-unit-bug-46e78d54af0d)

