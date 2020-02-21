import { useMemo, memo, useState, useEffect } from 'react';
import { observable, observe, unobserve, isObservable, raw } from '@nx-js/observer-util';

const store = (initialData) => {
	return observable(initialData);
};

const COMPONENT = Symbol('owner component');

const view = (Comp) => {
	const isStatelessComp = !(Comp.prototype && Comp.prototype.isReactComponent)
	console.log("Is stateless: " + isStatelessComp);

	let ReactiveComp;

	if(isStatelessComp) {
		ReactiveComp = memo((props) => {
			const [ , setState ] = useState();

			const render = useMemo(
				() => observe(Comp, {
					scheduler: () => setState({})
				}),
				[ Comp ]
			);

			useEffect(() => {
				return () => unobserve(render)
			}, []);

			return render(props);
		});

	} else {
		class ReactiveClassComp extends Comp {
			constructor (props, context) {
				super(props, context);

				this.state = this.state || {};
				this.state[COMPONENT] = this;

				// create a reactive render for the component
				this.render = observe(this.render, {
					scheduler: () => this.setState({})
				});
			}

			shouldComponentUpdate (nextProps, nextState) {
				const { props, state } = this;

				// respect the case when the user defines a shouldComponentUpdate
				if (super.shouldComponentUpdate) {
					return super.shouldComponentUpdate(nextProps, nextState)
				}

				// return true if it is a reactive render or state changes
				if (state !== nextState) {
					return true
				}

				// the component should update if any of its props shallowly changed value
				const keys = Object.keys(props);
				const nextKeys = Object.keys(nextProps);
				return (
					nextKeys.length !== keys.length ||
					nextKeys.some(key => props[key] !== nextProps[key])
				)
			}

			// add a custom deriveStoresFromProps lifecyle method
			static getDerivedStateFromProps (props, state) {
				if (super.deriveStoresFromProps) {
					// inject all local stores and let the user mutate them directly
					const stores = mapStateToStores(state)
					super.deriveStoresFromProps(props, ...stores)
				}

				// respect user defined getDerivedStateFromProps
				if (super.getDerivedStateFromProps) {
					return super.getDerivedStateFromProps(props, state)
				}

				return null;
			}

			componentWillUnmount () {
				// call user defined componentWillUnmount
				if (super.componentWillUnmount) {
					super.componentWillUnmount()
				}
				// clean up memory used by Easy State
				unobserve(this.render)
			}

			render () {
				return super.render();
			}
		}

		ReactiveComp = ReactiveClassComp;
	}

	ReactiveComp.displayName = Comp.displayName ? "Reactive" + Comp.displayName : Comp.name;

	for (let key of Object.keys(Comp)) {
		ReactiveComp[key] = Comp[key];
	}

	return ReactiveComp;
};

function mapStateToStores (state) {
	// find store properties and map them to their none observable raw value
	// to do not trigger none static this.setState calls
	// from the static getDerivedStateFromProps lifecycle method
	const component = state[COMPONENT]
	return Object.keys(component)
		.map(key => component[key])
		.filter(isObservable)
		.map(raw)
}

export { store, view };