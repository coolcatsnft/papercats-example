# Its All About Context
We now have a working wallet connection and are successfully storing our wallet address, balance and library in our apps state. Looking forward we are going to need these variables accessible by the whole of our app which means we need to implement a mechanism which is capable of doing this.

### Housekeeping
Before we start this chapter, I will point out that the code example has changed slightly from [chapter 4](../chapter-4).  All components will be moved into a `src/components` folder and any new hooks or contexts that we add will be created in their respective folders as well.  Your folder structure should look something like this now:
```
public
 -> index.html
 ...
src
-> components
  -> App.js
  -> Web3Button.js
-> hooks
  -> Web3.js
-> context
package.json
package-lock.json
```
### TLDR
If you want to look at the example we're going to create first, here is our [finished site and code](https://codesandbox.io/s/papercats-chapter-5-all-about-context-khx4rc).

## Making our web3 data available to our app
In order to make our data accesible to our components, we have a few options in the React world:

### Prop Drilling
We can use prop drilling to manually pass our variables from component to child component, for example:
```js
function Component() {
  const foo = 'bar';
  return (
    <ChildComponent foo={foo} />
  );
}
```
Here we are passing our variable `foo` as a prop into our child component.  This is fine for very simple applications but will soon become unwieldy once we have more than a handful of components.  Its worth mentioning before we dismiss this method, [component composition is very important](https://reactjs.org/docs/composition-vs-inheritance.html) and should always be considered before implementing other methods.

### State Manager
We could also look at using a _[state manager](https://www.javascriptstuff.com/state-managers/)_ like [Redux](https://redux.js.org/) to control our application data.  This could immediately solve our prop drilling problem and provide us with a nice framework for the future.

### Context API
Lastly we have the [Context Api](https://reactjs.org/docs/context.html). To quote the official docs:

> Context provides a way to pass data through the component tree without having to pass props down manually at every level.

Sounds ideal!  For this project we are going to be using the Context Api, not because Redux is unsuitable but because we are not going to be manipulating state very often so a system which promotes making variables accessible to all components is exactly what we're after.

Before we jump in the deepend with Context it's worth noting that the api was intended to solve issues such as _prop drilling_, however it can easily be used as a state manager.  Doing this can quickly lead to performance issues because the more complex a state you have, the more possibilities there are for uncessary rerenders.

Some examples of good context uses would be:

- Share the authentication state across your app
- Share a theme across your app
- Share a value that is used by a lot of components in a part of your app (like our wallet address!)

## Getting started with Context
In the functional component world the Context Api has three main methods that are used.  createContext which is used for bootstrapping the context, Context.Provider which is responsible for supplying the context to components and useContext which is responsible for consuming the context data.

Let's have a look at simple example:
```js
import React, { createContext, useContext } from 'react';
const MyContext = createContext();

function SimpleComponent() {
 const value = useContext(MyContext);
 return <span>{value}</span>;
}

function App() {
 const value = 'My Context Value';
 return (
   <MyContext.Provider value={value}>
     <SimpleComponent />
   </MyContext.Provider>
 );
}

export default App;
```
What we're doing here is adding a simple context using createContext and then using Provider to make our string value accessible to all child components.  Any child components which consume the context via useContext will automatically receive changes to our string.  So, looking at our current app, what we can do is create a context which provides our wallet address, balance and library to any child components that want to subscribe!

## Implementing Context
Before implementing any code, let's review what we are trying to do:
- Implement a new Context for our web3 data
- Provide our web3 data to any consuming components
- Make sure our implementation reacts to any changes in web3 data and pass it onto connected components.
Let's create a new folder and file `context/Web3.js` in our project directory.  Similar to the example above, let's create the boilerplate for our context:
```js
import { createContext } from "react";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  return (
    <Web3Context.Provider value={null}>
      { children }
    </Web3Context.Provider>
  )
}

export default Web3Provider;
```
In the example above, we have copied our context code and created a new provider component which will allow the contents of `value` to be consumed by any component that consumes it.  Currently the value is `null` but `value` can be a scalar or object so we have full flexibility over what our context can make available in our app.

So lets expand our context further.  Move our event listener code from `src/components/App.js` into our context.
```js
import { createContext, useEffect, useState } from "react";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [library, setLibrary] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const handleWidgetEvent = (e) => {
      setAddress(e?.detail?.address || '');
      setBalance(e?.detail?.balance || '');
      setLibrary(e?.detail?.web3 || null);
    };

    document.addEventListener('web3-widget-event', handleWidgetEvent);
  }, []);

  return (
    <Web3Context.Provider value={{
      address,
      library,
      balance
    }}>
      { children }
    </Web3Context.Provider>
  )
}

export default Web3Provider;
```
As you can see we have copied the logic from `src/App.js` into our context.  The state variables (`address`, `balance` and `library`) are then passed in as the value of the context.  As a final clean up, remove the logic from the `src/components/App.js` code as well.  We don't want multiple components listening to the web3 event.  Your `src/components/App.js` should look something like this again
```js
import Web3Widget from './Web3Widget';

function App() {
  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Widget />

    </div>
  );
}

export default App;
```
Now we need to add this provider to our app so that it can be consumed.  Open up our `index.js` and import the `Web3Provider`:
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { Web3Provider } from './context/Web3';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
);
```
You can see we are wrapping our `App` component with our `Web3Provider`.  As Providers make their variables available to any children, this means any of its child components (including `<App />`) can make use of its value.

We now need to make use of the `useContext` hook to consume our new `Web3Provider`!  It's good practice to make a custom hook for this so that we avoid writing the same boilerplate more than once.  So create a new folder and file, `src/hooks/useWeb3.js` and paste in the following code:
```js
import { useContext } from "react";
import { Web3Context } from "../context/Web3";

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Context')
  }

  return context;
}

export default useWeb3;
```
Here we are creating a custom hook that implements useContext to connect to the Web3Context api.  Any component which uses this hook will now have access to the address, balance and library variables!  As an aside, we are also checking to see if the context exists and throwing an error if not.  It doesn’t necessarily apply in this example, but it's good practice to include this check for any custom hook that uses the Context Api.

Finally! Let's integrate this new hook into our `src/components/App.js` component.
```js
import { useWeb3 } from '../hooks/useWeb3';
import Web3Widget from './Web3Widget';

function App() {
  const { address, balance } = useWeb3();

  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Widget />

      {address && <p>Wallet: {address}</p>}
      {balance && <p>Balance: {balance}</p>}
    </div>
  );
}

export default App;
```
You can see we are attempting to recreate the same output as in the previous chapter but this time instead of using the event listener logic, we are using our new custom hook.

Reloading the page should give us the same result, let's take a look!

![image](https://user-images.githubusercontent.com/92721591/173873813-e9eb927d-149a-4c61-8bae-e953b6c07a18.png)

Great job!  We have now built a framework that can provide our web3 data to all of our components (including contexts and hooks).

## Summary
In this example we've briefly covered some of the methods which are used to pass data around a React application.  We've also created a new Web3 context and custom hook which our application can now use to consume our web3 data!  Feel free to browse the [code repo](https://codesandbox.io/s/papercats-chapter-5-all-about-context-khx4rc) to see our finished version.

## Whats next?
In the [next chapter](../chapter-6/) we will look at finally connecting to the paper cats contract.  See you there!
