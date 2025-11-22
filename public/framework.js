// ---------- Query Selector Utilities ----------

/**
 * Shorthand for document.querySelector - returns the first element that matches the CSS selector
 * @param {string} selector - CSS selector string to match elements
 * @returns {Element|null} The first matching element or null if no match found
 * @example
 * // Select element by ID
 * const header = $('#header');
 *
 * // Select element by class
 * const button = $('.submit-btn');
 *
 * // Select by complex selector
 * const input = $('form input[type="email"]');
 */
function $(selector) {
	return document.querySelector(selector);
}

/**
 * Shorthand for document.querySelectorAll - returns all elements that match the CSS selector
 * @param {string} selector - CSS selector string to match elements
 * @returns {NodeList} A NodeList containing all matching elements
 * @example
 * // Select all elements with a class
 * const buttons = $$('.btn');
 *
 * // Select all list items
 * const items = $$('li');
 *
 * // Convert to array and use array methods
 * const itemsArray = Array.from($$('.item'));
 */
function $$(selector) {
	return document.querySelectorAll(selector);
}

/**
 * Extends HTMLElement prototype with $ property for scoped querySelector
 * Allows any HTMLElement to use the $ method to query within itself
 * @memberof HTMLElement.prototype
 * @type {function}
 * @param {string} selector - CSS selector string to match child elements
 * @returns {Element|null} The first matching child element or null
 * @example
 * const container = $('#container');
 * const childButton = container.$('.child-button');
 */
Object.defineProperty(HTMLElement.prototype, '$', {
	get() {
		return this.querySelector.bind(this);
	}
});

/**
 * Extends HTMLElement prototype with $$ property for scoped querySelectorAll
 * Allows any HTMLElement to use the $$ method to query all matching children
 * @memberof HTMLElement.prototype
 * @type {function}
 * @param {string} selector - CSS selector string to match child elements
 * @returns {NodeList} A NodeList containing all matching child elements
 * @example
 * const form = $('#myForm');
 * const inputs = form.$$('input');
 */
Object.defineProperty(HTMLElement.prototype, '$$', {
	get() {
		return this.querySelectorAll.bind(this);
	}
});

// ---------- Template String Tags ----------
/**
 * Default tag function for constructing raw strings from template literals
 * @param {TemplateStringsArray} strings - Template strings array
 * @param  {...any} values - Values to interpolate into the template
 * @returns {string} The final HTML string
 */
function raw(strings, ...values) {
	return strings.reduce((result, str, i) => result + str + (i < values.length ? values[i] : ''), '');
}

/**
 * Extends HTMLElement prototype with render property for rendering HTML templates as innerHTML
 * @memberof HTMLElement.prototype
 * @type {function}
 * @param {TemplateStringsArray} strings - Template strings array
 * @param  {...any} values - Values to interpolate into the template
 * @example
 * const container = document.createElement('div');
 * container.render`
 *     <h1>Hello, ${username}!</h1>
 *     <p>Welcome to our site.</p>
 * `;
 */
Object.defineProperty(HTMLElement.prototype, 'render', {
	get() {
		return (strings, ...values) => {
			// Handle self closing custom elements (ignore native self closing elements)
			this.innerHTML = raw(strings, ...values).replaceAll(/<(\w+-[\w-]+)[^>]*\/>/gm, (match, tag) => match.replace('/>', `></${tag}>`));
		};
	}
});

/**
 * Template tag function to render HTML as new element
 * @param {TemplateStringsArray} strings - Template strings array
 * @param  {...any} values - Values to interpolate into the template
 * @returns {HTMLElement} The newly created HTML element
 */
function create(strings, ...values) {
	const div = document.createElement('div');
	div.render(strings, ...values);
	const content = div.firstElementChild;
	content.remove();
	return content;
}

/**
 * Extends HTMLElement prototype with appendr property for appending rendered HTML templates
 * @memberof HTMLElement.prototype
 * @type {function}
 * @param {TemplateStringsArray} strings - Template strings array
 * @param  {...any} values - Values to interpolate into the template
 * @example
 * const container = document.createElement('div');
 * container.appendr`
 *     <h2>New Section</h2>
 *     <p>This section was appended.</p>
 * `;
 */
Object.defineProperty(HTMLElement.prototype, 'appendr', {
	get() {
		return (strings, ...values) => {
			const content = create(strings, ...values);
			this.appendChild(content);
		};
	}
});

/**
 * Extends HTMLElement prototype with prependr property for prepending rendered HTML templates
 * @memberof HTMLElement.prototype
 * @type {function}
 * @param {TemplateStringsArray} strings - Template strings array
 * @param  {...any} values - Values to interpolate into the template
 * @example
 * const container = document.createElement('div');
 * container.prependr`
 *     <h2>New Section</h2>
 *     <p>This section was prepended.</p>
 * `;
 */
Object.defineProperty(HTMLElement.prototype, 'prependr', {
	get() {
		return (strings, ...values) => {
			const content = create(strings, ...values);
			if (this.firstChild) this.insertBefore(content, this.firstChild);
			else this.appendChild(content);
		};
	}
});

/**
 * Extends HTMLElement prototype with styler property for advanded CSS styling
 * @memberof HTMLElement.prototype
 * @type {object}
 * @property {function} global - Tag function for adding global styles
 * @property {function} attr - Tag function for adding element-specific styles via style attribute
 * @property {function} var - Function for setting CSS variable values
 * @example
 * const box = create`<div class="box"></div>`;
 * box.styler.global`
 *     .box {
 * 		   background-color: var(--box-color);
 *     }
 * `;
 *
 * box.styler.attr`
 *    width: 100px;
 * `;
 *
 * box.style.var('--box-color', 'blue');
 */
Object.defineProperty(HTMLElement.prototype, 'styler', {
	get() {
		return {
			global: (strings, ...values) => {
				const style_id = this.tagName.toLowerCase() + '-global-styles';
				if ($(`#${style_id}`)) return;
				const style_el = create`<style id="${style_id}"></style>`;
				style_el.innerText = raw(strings, ...values);
				document.head.appendChild(style_el);
			},
			attr: (strings, ...values) => {
				this.setAttribute('style', raw(strings, ...values));
			},
			var: (var_name, var_value) => {
				this.style.setProperty(var_name, var_value);
			}
		};
	}
});
