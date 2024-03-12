# React Ghost
![](./assets/reactghostlogo.svg)


[![](https://img.shields.io/npm/l/react-ghost.svg?style=flat)](https://github.com/simprl/react-ghost/blob/main/LICENSE)
[![](https://img.shields.io/npm/v/react-ghost.svg?style=flat)](https://www.npmjs.com/package/react-ghost)

**react-ghost** is a specialized npm library inspired by the anime aesthetic, specifically designed for React application development. It mirrors the concept of "Ghost in the Shell," aiming to incorporate a ghostly essence into the React ecosystem. The library focuses on managing the business logic layer within React applications, offering a structured way to connect UI components with their underlying logic. Through its distinct approach, react-ghost facilitates the separation of the logic layer from the UI layer, enabling developers to maintain cleaner and more organized codebases.

# Features
* **Decoupling Logic from UI:** **react-ghost** utilizes two primary functions, **ghost()** and **ghosts()**, to abstract the business logic from UI components, promoting cleaner code and better separation of concerns.
* **Intuitive Syntax:** It extends React's **createElement** functionality, allowing developers to succinctly bind logic to UI elements without cluttering the visual component structure.
* **Seamless Integration:** Designed for seamless integration with Redux and React, react-ghost fits effortlessly into the existing ecosystem, enhancing the application's structure by clearly differentiating between the model (Redux), UI (React), and business logic (react-ghost).
* **Enhanced Testing Capabilities:** With react-ghost, testing the business logic of applications becomes more straightforward, enabling developers to write more focused and effective tests by leveraging the react-ghost-test package.

# Installation
1. Prerequisites: Ensure React JS is installed in your project.
2. Adding react-ghost: Simply add react-ghost to your project with npm:

```bash
npm i react-ghost
```

# API
* **ghost(Actor, props, children)**: Creates a ghost that acts as a bridge between the business logic and the React component tree.
* **ghosts(Actor1, Actor2, ..., ActorN)**: Facilitates the creation of multiple ghosts, allowing for complex logic compositions and interactions within the application.

# Usage
**react-ghost** integrates smoothly into your React application, allowing you to utilize React's hooks and Redux's capabilities within the framework of react-ghost. By leveraging this library, you can encapsulate business logic within "ghosts" without altering the way you use React hooks in your components. This means all standard **React hooks** (useState, useEffect, useContext, useSelector, useDispatch, etc.) and any custom hooks you've created remain applicable within the context of react-ghost.

Usually we use jsx for UI Components:
```jsx
const Component = () => <div>
    <MenuTop /> /* connect to MenuGhost */
    <Pagination /> /*  connect to ListGhost */
    <List /> /*  connect to ListGhost */
    <ItemHeader /> /*  connect to ItemGhost */
    <ItemContent /> /*  connect to ItemGhost */
    <Pagination /> /*  connect to ListGhost */
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

Its equals to react createElement:
```js
import { createElement, Fragment } from 'react';

const ghost = createElement;
const ghosts = (...children) => createElement(Fragment, null, ...children);

export { ghost, ghosts };
```

That is all content of this library. So you can use all features of React library for code Business logic.

For more information read this article: 
**[Put a Soul into a React-Redux Project](https://dev.to/simprl/adding-a-soul-into-a-react-redux-project-524b)**

## Use Case 1. Connecting Redux, React and Ghost

This architecture leverages:
* **Redux** for managing the application's state (Model),
* **React** for rendering the user interface (UI),
* **React-Ghost** for orchestrating the business logic.

**business logic** (Ghost) <------> **state** (Redux) <------> **UI** (React)

### Interaction Flow:
* **Business Logic** (React-Ghost) interacts with State (Redux) to implement logic, manage state changes, compute or load data, and dispatch actions to update the state.
* **State** (Redux) updates in response to actions, affecting the application's state.
* **UI** (React) displays the state to the user and captures user interactions, dispatching actions to Redux based on those interactions.

### Responsibilities

#### React-Ghost (Ghosts):
* Implements business logic, including monitoring state changes, processing or fetching data, and initiating actions to store new data.
* Dynamically adds or removes reducers within Redux to manage state transitions effectively.

#### Redux:
* Manages the application's state, updating it in response to dispatched actions, thereby serving as the central source of truth.

#### React:
* Retrieves state information for display, ensuring the UI reflects the current application state.
* Renders the user interface, providing a responsive and interactive experience.
* Dispatches actions to Redux based on user interactions, facilitating a reactive application flow.

### You can use React and Redux hooks:
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
