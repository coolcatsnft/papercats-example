# Adding the Web3 Widget

Before we can start connecting to the Paper Cats contract and minting some Paper Cats, we need to be able to connect to a web3 wallet to perform the transactions.

## TLDR
If you just want to see a working example for this chapter, feel free to browse the [code repo](https://codesandbox.io/s/papercats-chapter-4-web3-button-0hdxjv).

## Connecting to Web3
Normally in a javascript environment a developer would install a package like [Web3](https://www.npmjs.com/package/web3) or [Ethers](https://www.npmjs.com/package/ethers) or even a helper library like [Web3Modal](https://github.com/Web3Modal/web3modal) or [Wagmi](https://wagmi.sh/).  These are fantastic libraries, however here at Cool Cats we have a slightly different approach.

We have created a [javascript widget](https://github.com/coolcatsnft/web3-widget) that developers can drop into a html page to quickly and easily add a web3 connect button to their site.  This behaves in a similar way to how a twitter or facebook widget would work.  On a html page a developer could copy and paste the button script, refresh and expect to see the button on their page, however in a react site we need to do a little more work.  React manages the DOM on the page so any html inserted in the application root will be removed at runtime and any html outside of it will be outside of the react scope, so what’s needed to embed the widget?  

The answer is using two of React’s built-in tools, the `createElement` method and useEffect hook.  Looking at the project README.md, there is an [example react component](https://github.com/coolcatsnft/web3-widget#embedding-in-react) documented, so lets copy that into a new file and call it Web3Widget.js.  

```
import { createElement, useEffect } from "react";

export function Web3Button() {
  useEffect(() => {
    const id = 'web3-button-script';
    if (!document.getElementById(id)) {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.id = id;
      s.innerHTML = `(function(w, d, s, o, f, js, fjs) {
        w['web3-widget'] = o;
        w[o] = w[o] || function() {
          (w[o].q = w[o].q || []).push(arguments);
        };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o;
        js.src = f;
        js.async = 1;
        fjs.parentNode.insertBefore(js, fjs);
      }(window, document, 'script', 'config', 'https://coolcatsnft.github.io/web3-widget/main.js'));
      config('NETWORK_ID', 4);`;
      document.body.appendChild(s);
    }
  }, []);
  
  return createElement('web3-button', { }, null);
}

export default Web3Button;
```

There is a lot going on in this file if you are new to React so let's break it down line by line. 

## Using libraries
Line 1 is our React library import statement.  It's declaring that we intend to use the createElement function, memo and useEffect hooks from the React library.  We will cover why we are going to use these methods as we move through the rest of the document.

### What are hooks?
If you are used to older versions of react or have used class based components, the hook system may seem strange, however many hooks are replacements for the lifecycle methods like componentDidMount.  In the past, if a developer wanted to share logic between components, they may have used a prop to pass in a specific function or wrote a [HOC](https://reactjs.org/docs/higher-order-components.html) for some more complex share.  This still works today but with hooks, it makes the process far simpler. To quote the docs

> Hooks allow you to reuse stateful logic without changing your component hierarchy. This makes it easy to share Hooks among many components or with the community.

## Defining our Component
Line 3 we define the name of our new component, calling it `Web3Button`.  This should be unique but you can name your component anything, although if you are new to react or programming in general, it might be best to copy what’s in this document.  

## The useEffect hook
In line 4 we will need to combine with line Line 27 as this is our first React hook.  [useEffect](https://reactjs.org/docs/hooks-effect.html) lets you perform side effects in a react component either once on mount or potentially more than once depending on the parameters you pass to the method.  By using this hook, you tell react to do something after the component renders.  Line 27 has the closing brace of the react effect method followed by a pair of square brackets.  This is the dependency array of the hook and tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run.  This is how we want this component to behave as the objective is to add the widget to the page once and not trigger any subsequent effects.
  - There are many ways to use this hook but one takeaway is that unless you tell the hook otherwise, the method you pass to the hook will run on first render and every render after that, so be careful how you use this hook!

## Delving deeper into code
Line 5 and 6 we start to construct the web3 widget code.  This will be the id of our dom element which we’ll use to check its existence in the dom.
Line 7 to 22 is our web3 widget code.  We create a script element and set the attributes and content of the script before attaching it to the DOM.  The innerHTML property is where the widget code is set being set:

<img width="400" alt="image" src="https://user-images.githubusercontent.com/92721591/173501210-68f21acb-fe67-47f2-8a29-ff967c24470c.png">

Note the back ticks on line 11 after `s.innerHTML = `.  These are important as we're setting code to the `innerHTML` property and need to escape any characters like single or double quotes.

### Setting the Network ID
On the last line of the `innerHTML` code, there is a `config('NETWORK_ID', 4)` statement.  This is adding a configuration option to tell our widget connect to the Rinkeby testnet.  By default, the widget will connect to the Etheruem mainnet.

Following on from the widget code, we have our final line of code before closing the conditional `if` statement defined on line 6.  We are using `document.body.appendChild` to add our new script component to the document body.  Due to useEffect only running once (because its dependency array is an empty `[]`) and that we are checking to see if a script element with this id already exists, we are confident that this script tag will only be inerted once!  

The last line of the component is where the [createElement](https://reactjs.org/docs/react-api.html#createelement) function returns a react component with a type web3-button which is required by the library to insert its web3 connect button.

## Exporting our Component
Finally, in order to use our component, we need to `export` it so that we can `import` it within other files.  On the last line of the `Web3Button` file we write the following code, `export default Web3Button;`.  You don't necessarily need to use a `default` keyword, however this is sometimes useful as it allows developers to use a different variable name when importing it into a new file.  For example:

```
import Web3Button from './Web3Button';
import AnotherWeb3Button from './Web3Button';
```
In this instance, `Web3Button` and `AnotherWeb3Button` will be the same component, however accessing the named component will produce a compiler error:

```
import { Web3Button } from './Web3Button';
import { AnotherWeb3Button } from './Web3Button';
```
## Importing the new component
Ok so now we have been through the code, lets try to add it to our App.js!  As demonstrated about, we need to import our component before being able to use it:
```src/App.js
import Web3Button from './Web3Button';

function App() {
```
Using this will import our default export from the specified file.  We now have our component available, so let's add it into our source:
```
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
Save your App.js file and run `npm start`.

If everything has been copied correctly we should have the following displaying in the browser window:

<img width="348" alt="image" src="https://user-images.githubusercontent.com/92721591/173505539-82f0b374-823c-48e8-9b54-c2b1799e47fa.png">

We now have a functioning connection widget on our page, clicking the button should show the metamask widget and prompt you to login.  

Great! Having a functioning widget is a fantastic start, however, connecting to web3 is only half the puzzle.  We need to be able to use the wallet address and library that's injected into the page!  So to do that, let's create our event listener.

## Listening for the widget event
The [documentation for the widget](https://github.com/coolcatsnft/web3-widget/blob/main/README.md#listening-for-events) says that we should listen for the `web3-widget-event` event.  Back in our App.js component, let's create another single use useEffect function to subscribe to our event:

```
import { useEffect } from 'react';
import Web3Widget from './Web3Widget';

function App() {
  useEffect(() => {
    const handleWidgetEvent = (e) => {
      console.log(e);
    };
    
    document.addEventListener('web3-widget-event', handleWidgetEvent);
  }, []);
  
  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Widget />
    </div>
  );
}

export default App;
```
Again we are using useEffect to perform an action on rendering our App.  This time we are using document.addEventListener to pass the event to a function `handleWidgetEvent`.  Reloading our page, and connecting to our wallet we should see something in the console.

<img width="600" alt="image" src="https://user-images.githubusercontent.com/92721591/173508300-82c8a915-1af3-4621-bedc-3dd1026ba687.png">

If you’re wondering why there are two console logs in this image, that’s a good spot.  By default, create-react-app wraps our App component in a [Strict Mode](https://reactjs.org/docs/strict-mode.html) tag.  Strict mode causes a double render of any components in its scope in order to detect any problems with the code and report them.  In this instance, it hasn’t reported any errors however has uncovered a potential flaw that our event listener method is being attached twice to the event.  How do we overcome this?  The answer is unsubscribing from our event when the component is unmounted.
```
import { useEffect } from 'react';
import Web3Widget from './Web3Widget';

function App() {
  useEffect(() => {
    const handleWidgetEvent = (e) => {
      console.log(e);
    };
    
    document.addEventListener('web3-widget-event', handleWidgetEvent);
    
    return () => {
      document.removeEventListener('web3-widget-event', handleWidgetEvent);
    };
  }, []);
  
  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Widget />
    </div>
  );
}

export default App;
```
By returning a callback in our useEffect hook, it tells React to run this specific function when the component is unmounted.  In this instance, the handleWidgetEvent method will be removed from the event listener.

Reloading the page should now give us just one console log statement:

<img width="600" alt="image" src="https://user-images.githubusercontent.com/92721591/173508719-079531f3-399e-476f-bad6-2bc49556c5db.png">

## Responding to the Web3 event
Now we are logging our event data, we now need to do something with it!  We know from the widget documentation that the event contains the connection sttaus, wallet address, balance and web3 library so in order to make these avalable to our app, we are going to use a new hook [useState](https://reactjs.org/docs/hooks-state.html) to create a state variables to save the address, balance and web3 library.  

> A state variable is something that can be changed or is mutable as opposed to prop values that are immutable.  

## useState hook
When using `useState`, an array is returned with the first entry being the variable and the second being the setter that will mutate its value.  For example:

```
const [value, setValue] = useState(0);
```

The square brackets notation is a bit of javascript syntax called _array destructuring_. This isn’t strictly necessary as we could do something like this:

```
const valueState = useState(0);
const value = valueState[0];
const setValue = valueState[1];
```
As you can see, _array destructuring_ makes the code much more readable and considerably shorter once you understand what it’s doing.

Now that we have our state variable and setter, if we call `setValue(1)`, value will now be 1 and so on.  What’s interesting is that we can also combine a `useEffect` with a dependency of `value` to react to value being changed!  

```
const [value, setValue] = useState(0);
useEffect(console.log, [value]);
```
In the code above, you would see a console log on mount of zero and then another subsequent console log if the `value` variable ever changes.

If all of this is a bit confusing, I’d recommend working through the [official documentation on useState](https://reactjs.org/docs/hooks-state.html) which will explain what it does in much more detail.

## Adding state
Lets define out three state variables and start using their setter methods in our `useEffect` hook which is listening for the `web3-widget-event`.

```
import { useEffect, useState } from 'react';
import Web3Widget from './Web3Widget';

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    const handleWidgetEvent = (e) => {
      setAddress(e?.detail?.address || '');
      setBalance(e?.detail?.balance || '');
      setLibrary(e?.detail?.web3 || null);
    };

    document.addEventListener('web3-widget-event', handleWidgetEvent);

    return () => {
      document.removeEventListener('web3-widget-event', handleWidgetEvent);
    }
  }, []);
```

A lot of code has just been added! Just underneath our App() declaration we have created three variables using useState.  In our handler, we are now mapping the address, balance and library properties from our event detail to our state values.  We are using [operator chaining](https://www.joshwcomeau.com/operator-lookup?match=optional-chaining) on the event object thats returned to double check the existence of these properties in the event and if missing, provide the default value instead.

Now that we have our address and balance in the state of the component, lets try displaying them on screen:

```
  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Widget />

      {address && <p>Wallet: {address}</p>}
      {balance && <p>Balance: {balance}</p>}
    </div>
  );
```

We’ve added our address and balance variables between square brackets and have done a quick logical test which will then show the `<p>` component if either of these variables are truthy.

So refreshing our screen, we should get something like this:

<img width="400" alt="image" src="https://user-images.githubusercontent.com/92721591/173512463-78c48f5a-00bf-4b40-a983-599f27a2c055.png">

Disconnecting from our app, the wallet and balance lines should be removed.  If your app is working in the same way, amazing! We've successfully connected to your wallet and displayed its balance and address on screen.  Great job! 👍 🥳

## Summary
In this chapter we created a new Web3Widget component, have covered what the react hooks `useEffect` and `useState` do and have successfully used our new button to connect to a users wallet and show their wallet address and balance on screen!  Feel free to browse our [code repo](https://codesandbox.io/s/papercats-chapter-4-web3-button-0hdxjv) to see the finished version!

## Whats next?
In the [next chapter](../chapter-5/) we're going to looking at using React's Context Api, custom hooks and making our wallet address, balance and library state variables accessible to other components in our app.  See you there!
