# react-ghost

I hope you like anime :)

This library like "Ghost in the Shell" but "Ghost in the React Application" - business layer of the React application.

[![](https://img.shields.io/npm/l/react-ghost.svg?style=flat)](https://github.com/simprl/react-ghost/blob/main/LICENSE)
[![](https://img.shields.io/npm/v/react-ghost.svg?style=flat)](https://www.npmjs.com/package/react-ghost)

Usually we use jsx for UI Components:
```jsx
const Component = () => <div>
    <MenuTop /> /* connect to MenuGhost */
    <Pagination> /*  connect to ListGhost */
    <List> /*  connect to ListGhost */
    <ItemHeader> /*  connect to ItemGhost */
    <ItemContent> /*  connect to ItemGhost */
    <Pagination> /*  connect to ListGhost */
    <MenuBottom /> /*  connect to MenuGhost */
</div>
```

But for separate logic layer from UI layer we need some other namings.

So I came up with two functions: **ghost()** and **ghosts()**

```js
import { ghosts, ghost } from 'react-ghost';

const PageGhost = ({ param1, param2, id }) => ghosts(
    ghost(MenuGhost, { param1 }),
    ghost(ListGhost, { param2 }),
    id && ghost(ItemGhost, { id }),
)
```

They equals to react createElement:
```js
import { createElement, Fragment } from 'react';

const ghost = createElement;
const ghosts = (...children) => createElement(Fragment, null, ...children);

export { ghost, ghosts };
```

That is all content of this library. So you can use all features of React library for code Business logic.

## Use Case 1. Connecting redux, react and ghost

I propose using:
- Redux for Model
- React for UI
- React-Ghost for Business logic

**business logic** (ghost) <------> **state** (redux) <------> **UI** (react)

#### Ghosts:
  - implement business logic - check for the state changes, compute/load data and dispatch actions for save new data;
  - add/remove reducers in the redux;

#### Redux:
  - change state when receive actions;
    
#### React:
  - get state;
  - render UI;
  - dispatch redux actions on user interactions;

## Install
1. Install [React JS](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) 
2. Add module react-ghost into project:

### You can use react and redux hooks:
```js
import {useSelector, useMemo } from 'react';
import { useDispatch } from 'react-redux'
import { ghosts, ghost } from 'react-ghost';

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
import { waitForState, checkDispatch } from 'react-ghost-test'
import { ghost } from 'react-ghost';

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
After business logic implemented, you can add thin layer of UI using react components.
 
## Requirements
Support all react versions from 16 and later
