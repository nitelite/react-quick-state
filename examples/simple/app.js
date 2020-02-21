import React from 'react';
import { render } from 'react-dom';
import { store, view } from 'react-quick-state';

const mainStore = store({
	a: 1,
	b: 1,
	c: 1,
	text: ""
});

const ShowA = view(() => {
	console.log("Rendering Component A");
	return (<p>A: {mainStore.a}</p>);
});

const ShowB = view(() => {
	console.log("Rendering Component B");
	return (<p>B: {mainStore.b}</p>);
});

@view
class ShowC extends React.Component {
	render() {
		console.log("Rendering Component C");
		return (<p>C: {mainStore.c}</p>);
	}
}

const App = view(() => (
	<div>
		<ShowA/>
		<ShowB/>
		<ShowC/>
		<button onClick={() => mainStore.a++}>inc a</button>
		<button onClick={() => mainStore.b++}>inc b</button>
		<button onClick={() => mainStore.c++}>inc c</button>
		<input type="text" value={mainStore.text} onChange={e => mainStore.text = e.target.value} />
		<p>Value is {mainStore.text}</p>
	</div>
));

const mountingPoint = document.getElementById("root");
render(<App/>, mountingPoint);
