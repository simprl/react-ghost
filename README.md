# react-ghost
Business layer of react application.
React-Ghosts it is like actors or workers in react.

If you want implement MVC application using react then you have:
  
- Redux for Model
  
- React for View
  
- React-Ghost for Controller

## Usage
```jsx
<App>
 {ghost(AppGhost, { param1, param2 })}
 <Component1 />
 <Component2 />
</App>
```

```jsx
const AppGhost = ({ param1, param2 }) => ghosts(
   ghost(MenuGhost, { param1 }),
   ghost(PagesGhost, { param2 }),
)
```

## Requirements
Support all react versions from 16 and later

