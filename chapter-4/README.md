# Adding the Web3 Widget

Before we can start connecting to the Paper Cats contract and minting some Paper Cats, we need to be able to connect to a web3 wallet to perform the transactions.

Normally in a javascript environment a developer would install a package like [Web3](https://www.npmjs.com/package/web3) or [Ethers](https://www.npmjs.com/package/ethers) or even a helper library like [Web3Modal](https://github.com/Web3Modal/web3modal) or [Wagmi](https://wagmi.sh/).  These are fantastic libraries, however here at Cool Cats we have a slightly different approach.

We have created a [javascript widget](https://github.com/coolcatsnft/web3-widget) that developers can drop into a html page to quickly and easily add a web3 connect button to their site.  This behaves in a similar way to how a twitter or facebook widget would work.  On a html page a developer could copy and paste the button script, refresh and expect to see the button on their page, however in a react site we need to do a little more work.  React manages the DOM on the page so any html inserted in the application root will be removed at runtime and any html outside of it will be outside of the react scope, so what’s needed to embed the widget?  

The answer is using two of React’s built-in tools, the `createElement` method and useEffect hook.  Looking at the project README.md, there is an [example react component](https://github.com/coolcatsnft/web3-widget#embedding-in-react) documented, so lets copy that into a new file and call it Web3Widget.js.  

<img src="../assets/chapter-4-web3-widget.png" alt="Web3 widget" width="300" />

There is a lot going on in this file if you are new to React so let's break it down line by line. 

- Line 1 is our React library import statement.  It's declaring that we intend to use the createElement function, memo and useEffect hooks from the React library.  We will cover why we are going to use these methods as we move through the rest of the document.
  - If you are used to older versions of react or have used class based components, the hook system may seem strange, however many hooks are replacements for the lifecycle methods like componentDidMount.
- Line 3 we define the name of our new component, calling it Web3Button.  This should be unique but you can name your component anything, although if you are new to react or programming in general, it might be best to copy what’s in this document.  The export keyword at the start means that we want to make our function available outside the scope of the file.  By exporting a function (or indeed a variable) we can therefore call import { myFunction, myVariable } from ‘./relative/path/to/file’; in another file in this project.
- Line 4 we will need to combine with line Line 27 as this is our first React hook.  useEffect lets you perform side effects in a react component either once on mount or potentially more than once depending on the parameters you pass to the method.  By using this hook, you tell react to do something after the component renders.  Line 27 has the closing brace of the react effect method followed by a pair of square brackets.  This is the dependency array of the hook and tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run.  This is how we want this component to behave as the objective is to add the widget to the page once and not trigger any subsequent effects.



There are many ways to use this hook but one takeaway is that unless you tell the hook otherwise, the method you pass to the hook will run on first render and every render after that, so be careful how you use this hook!


Line 5 and 6 we start to construct the web3 widget code.  This will be the id of our dom element which we’ll use to check its existence in the dom.
Line 7 to 22 is our web3 widget code.  We create a script element and set the attributes and content of the script before attaching it to the DOM.  The innerHTML property is where the widget code is set being set:

 









The last line of the component is where the createElement function returns a react component with a type web3-button which is required by the library to insert its web3 connect button.

Ok so now we have been through the code, lets try to add it to our App.js!
Before we can use our component, we need to import it:


	
Using this will import our default export from the specified file.  We now have our component available, so let's add it into our source:



Save your App.js file and run `npm start`.

If everything has been copied correctly we should have the following displaying in the browser window:



We now have a functioning connection widget on our page, clicking the button should show the metamask widget and prompt you to login.  

Great! Having a functioning widget is a fantastic start, however, connecting to web3 is only half the puzzle.  We need to be able to use the wallet address and library that's injected into the page!  So to do that, let's create our event listener.

The documentation for the widget says that we should listen for the web3-widget-event event.  Back in our App.js component, let's create another single use useEffect function to subscribe to our event:



Again we are using useEffect to perform an action on rendering our App.  This time we are using document.addEventListener to pass the event to a function handleWidgetEvent.  Reloading our page, and connecting to our wallet we should see something in the console.



If you’re wondering why there are two console logs in this image, that’s a good spot.  By default, create-react-app wraps our App component in Strict Mode tags.  Strict mode causes a double render of any components in its scope in order to detect any problems with the code and report them.  In this instance, it hasn’t reported them however has uncovered a potential flaw that our event listener method is being attached twice to the event.  How do we overcome this?  The answer is unsubscribing from our event when the component is unmounted.



By returning a callback in our useEffect hook, it tells React to run this specific function when the component is unmounted.  In this instance, the handleWidgetEvent method will be removed from the event listener.

Reloading the page should now give us just one console log statement:



Now we are logging our event data, we now need to do something with it.  We are going to use a new hook useState to create a variable to save the address, balance and library.  A state variable is something that can be changed or is mutable as opposed to prop values that are immutable.  When using this hook, an array is returned with the first entry being the variable and the second being the setter that will mutate its value.  For example:

	const [value, setValue] = useState(0);

The square brackets notation is a bit of javascript syntax called array destructuring. This isn’t strictly necessary but makes the code much more readable once you understand what it’s doing.

If we call setValue(1), value will now be 1 and so on.  What’s interesting is that we can also combine a useEffect with a dependency of value to react to value being changed!  If all of this is a bit confusing, I’d recommend working through the official documentation on useState which will explain what it does in much more detail.



A lot of code has just been added! Just underneath our App() declaration we have created three variables using useState.  In our handler, we are now mapping the address, balance and library properties from our event detail to our state values.  If any of these are undefined or the status is disconnected, then the state is reset to its original values.

Now that we have our address and balance in the state of the component, lets try displaying them on screen:



We’ve added our address and balance variables between square brackets and have done a quick logical test which will then show the <p> component if either of these variables are truthy.

So refreshing our screen, we should get something like this:



Disconnecting from our app, the wallet and balance lines should be removed.  If your app is working in the same way, amazing! We’ve successfully connected to your wallet and displayed its balance and address on screen.  Great job :+1:
