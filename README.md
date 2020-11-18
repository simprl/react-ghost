# react-ghost
Business layer of react application.
React-Ghosts it is like actors or workers in react.

If you want implement MVC application using react then you have:
  
- Redux for Model
  
- React for View
  
- React-Ghost for Controller

## Usage

### Attach to application:
```jsx
<App>
 {ghost(AppGhost, { param1, param2 })}
 <Component1 />
 <Component2 />
</App>
```

### Implement application ghost:
```js
const AppGhost = ({ param1, param2 }) => ghosts(
   ghost(MenuGhost, { param1 }),
   ghost(PagesGhost, { param2 }),
)
```

### You can use react and redux hooks:
```js
const PagesGhost = () => {
    const url = useSelector(({ history }) => history.url)
    const pageGhost = useMemo(() => getPageGhostByUrl(url), [url])
    return ghost(pageGhost)
}

const HomePageGhost = () => {
    const dispatch = useDispatch()
    useEffect(() => {
      const interval = setInterval(() => {
          dispatch({type: 'COUNTER_PLUS'})
      }, 1000)
      return () => clearInterval(interval)
    })
    return null // you should explicitly point that this ghost hasn't child ghosts
}
```

## Requirements
Support all react versions from 16 and later
