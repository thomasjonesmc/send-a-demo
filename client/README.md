# Changelog/Recommendations for Refactor

1. `Demo.js` kept state in useState that looked like the below

```js
const [appState, setAppState] = useState({
    loading: true,
    demo: null,
});
```

I think its simpler to have a separate `useState` for loading and demo. I extracted these into a separate `useDemo.js` file. This is a custom hook. Custom hooks are a great option when you need to fetch some data in a specific way. It lets you hide the implementation of how the data is fetched, and just lets you use the data.

2. When we fetch demos, we fetch from the route `/demos/get-demo-by-id` then pass in a query parameter for the demo id. An easier way to handle this is to simply make the id a route parameter on the backend. This way we can simply make a GET request to `/demos/:id`. I changes the frontend route to `/demos` plural for consistency.