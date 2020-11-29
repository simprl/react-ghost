# Ghost in React
Business layer of react application.
React-Ghosts it is like actors or workers in react.

If you want implement MVC application using react then you have:
  
- Redux for Model
  
- React for View
  
- React-Ghost for Controller

## Usage
### Install
NPM:
```shell script
npm i react-ghost
```
Yarn:
```shell script
yarn add react-ghost
```

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

    // you should explicitly point that this ghost hasn't child ghosts
    return null 
}
```
## API
`ghost(Actor, props, children)` - create and return ghost/actor/worker

`ghost(Actor1, Actor2, .... ActorN)` - crate and return many ghosts/actors/workers

## Testing
### Now you can write tests for application business logic separately from UI logic 
Use jest and helper functions from [react-ghost-test](https://www.npmjs.com/package/react-ghost-test) for write tests
For example:
```js
describe('init', () => {
  test('create app actor', async () => {
    // Create redux context provider
    //   and insert into this provider Application actor.
    // After that verify store contains 'main' reducer.
    await waitForState(
      () => create(ghost(
        Provider,
        { store },
        ghost(AppActor),
      )),
      [
        (state) => expect(state).toHaveProperty('main'),
      ],
    );
  });
  
  // Dispatch action 'boot'.
  // AppActor should subscribe to this action and do some
  //    work for boot/reboot application.
  // At first we wait while booting flag set to true.
  // After booting ('booing' flag equals to false) we verify
  //    state in the store 
  // And theard - verify that we redirect to home page 
  test('boot', async () => {
    await checkDispatch(
      mainActions.boot('main'),
      [
        (state) => state.toHaveProperty('main.booting', true),
        (state) => state.toMatchObject({
          main: {
            booted: true,
            booting: false,
          },
          history: {
            location: { pathname: '/' },
          },
        }),
        (state) => state.toMatchObject({
          homePage: {
            title: 'Home Page',
          },
        }),
      ],
    );
  });


  // Redirect to books page
  // History Actor should check histor.toUrl variable.
  // If it changed then History actor should navigate to this page.
  // So we asssert history.loacation variable
  // Pages Actor should subscribe to history.loacation and
  //   attach specific actor for this location - BoocksActor
  // We verify this by check 'booksPage' reducer in the store 
  // Also we save current state in temporary variable for restore
  //   in another test 
  test('open books page', async () => {
    await checkDispatch(
      historyActions.push('history', '/books'),
      [
        (state) => state.toMatchObject({ history: {
             toUrl: '/books',
             action: 'push'
        } }),
        (state) => state.toMatchObject({
          history: {
            location: { pathname: '/books' },
          },
        }),
        (state) => {
          state.not.toHaveProperty('homePage');
          state.toMatchObject({
            booksPage: {
              list: [],
            },
          });

          // save state for restore in another test
          savedStates.booksPage = store.getState();
        },
      ],
    );
  });
});

```

So we tested logic of application.
After business logic implemented you can add thin layer of UI using react components.
 
## Requirements
Support all react versions from 16 and later
