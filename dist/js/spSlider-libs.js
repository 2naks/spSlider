/*!
 spSlider Build version 0.0.1, 11-15-2013, 3:03:45 PM
*/
/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
;/*
 * Swiper 2.3 - Mobile Touch Slider
 * http://www.idangero.us/sliders/swiper/
 *
 * Copyright 2012-2013, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under GPL & MIT
 *
 * Updated on: November 2, 2013
*/
var Swiper = function (selector, params) {
    /*=========================
      A little bit dirty but required part for IE8 and old FF support
      ===========================*/
    if (document.body.__defineGetter__) {
        if (HTMLElement) {
            var element = HTMLElement.prototype;
            if (element.__defineGetter__) {
                element.__defineGetter__("outerHTML", function () { return new XMLSerializer().serializeToString(this); } );
            }
        }
    }

    if (!window.getComputedStyle) {
        window.getComputedStyle = function (el, pseudo) {
            this.el = el;
            this.getPropertyValue = function (prop) {
                var re = /(\-([a-z]){1})/g;
                if (prop === 'float') prop = 'styleFloat';
                if (re.test(prop)) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            }
            return this;
        }
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        }
    }
    if (!document.querySelectorAll) {
        if (!window.jQuery) return;
    }
    function $$(selector, context) {
        if (document.querySelectorAll)
            return (context || document).querySelectorAll(selector);
        else
            return jQuery(selector, context);
    }

    /*=========================
      Check for correct selector
      ===========================*/
    if(typeof selector === 'undefined') return;

    if(!(selector.nodeType)){
        if ($$(selector).length === 0) return;
    }

     /*=========================
      _this
      ===========================*/
    var _this = this;

     /*=========================
      Default Flags and vars
      ===========================*/
    _this.touches = {
        start:0,
        startX:0,
        startY:0,
        current:0,
        currentX:0,
        currentY:0,
        diff:0,
        abs:0
    };
    _this.positions = {
        start:0,
        abs:0,
        diff:0,
        current:0
    };
    _this.times = {
        start:0,
        end:0
    };

    _this.id = (new Date()).getTime();
    _this.container = (selector.nodeType) ? selector : $$(selector)[0];
    _this.isTouched = false;
    _this.isMoved = false;
    _this.activeIndex = 0;
    _this.centerIndex = 0;
    _this.activeLoaderIndex = 0;
    _this.activeLoopIndex = 0;
    _this.previousIndex = null;
    _this.velocity = 0;
    _this.snapGrid = [];
    _this.slidesGrid = [];
    _this.imagesToLoad = [];
    _this.imagesLoaded = 0;
    _this.wrapperLeft=0;
    _this.wrapperRight=0;
    _this.wrapperTop=0;
    _this.wrapperBottom=0;
    var wrapper, slideSize, wrapperSize, direction, isScrolling, containerSize;

    /*=========================
      Default Parameters
      ===========================*/
    var defaults = {
        mode : 'horizontal', // or 'vertical'
        touchRatio : 1,
        speed : 300,
        freeMode : false,
        freeModeFluid : false,
        momentumRatio: 1,
        momentumBounce: true,
        momentumBounceRatio: 1,
        slidesPerView : 1,
        slidesPerGroup : 1,
        simulateTouch : true,
        followFinger : true,
        shortSwipes : true,
        moveStartThreshold:false,
        autoplay: false,
        onlyExternal : false,
        createPagination : true,
        pagination : false,
        paginationElement: 'span',
        paginationClickable: false,
        paginationAsRange: true,
        resistance : true, // or false or 100%
        scrollContainer : false,
        preventLinks : true,
        noSwiping : false, // or class
        noSwipingClass : 'swiper-no-swiping', //:)
        initialSlide: 0,
        keyboardControl: false,
        mousewheelControl : false,
        mousewheelDebounce: 600,
        useCSS3Transforms : true,
        // Autoplay
        autoplay: false,
        autoplayDisableOnInteraction: false,
        //Loop mode
        loop:false,
        loopAdditionalSlides:0,
        //Auto Height
        calculateHeight: false,
        //Images Preloader
        updateOnImagesReady : true,
        //Form elements
        releaseFormElements : true,
        //Watch for active slide, useful when use effects on different slide states
        watchActiveIndex: false,
        //Slides Visibility Fit
        visibilityFullFit : false,
        //Slides Offset
        offsetPxBefore : 0,
        offsetPxAfter : 0,
        offsetSlidesBefore : 0,
        offsetSlidesAfter : 0,
        centeredSlides: false,
        //Queue callbacks
        queueStartCallbacks : false,
        queueEndCallbacks : false,
        //Auto Resize
        autoResize : true,
        resizeReInit : false,
        //DOMAnimation
        DOMAnimation : true,
        //Slides Loader
        loader: {
            slides:[], //array with slides
            slidesHTMLType:'inner', // or 'outer'
            surroundGroups: 1, //keep preloaded slides groups around view
            logic: 'reload', //or 'change'
            loadAllSlides: false
        },
        //Namespace
        slideElement : 'div',
        slideClass : 'swiper-slide',
        slideActiveClass : 'swiper-slide-active',
        slideVisibleClass : 'swiper-slide-visible',
        wrapperClass : 'swiper-wrapper',
        paginationElementClass: 'swiper-pagination-switch',
        paginationActiveClass : 'swiper-active-switch',
        paginationVisibleClass : 'swiper-visible-switch'
    }
    params = params || {};
    for (var prop in defaults) {
        if (prop in params && typeof params[prop]==='object') {
            for (var subProp in defaults[prop]) {
                if (! (subProp in params[prop])) {
                    params[prop][subProp] = defaults[prop][subProp];
                }
            }
        }
        else if (! (prop in params)) {
            params[prop] = defaults[prop]
        }
    }
    _this.params = params;
    if (params.scrollContainer) {
        params.freeMode = true;
        params.freeModeFluid = true;
    }
    if (params.loop) {
        params.resistance = '100%';
    }
    var isH = params.mode==='horizontal';

    /*=========================
      Define Touch Events
      ===========================*/

    _this.touchEvents = {
        touchStart : _this.support.touch || !params.simulateTouch  ? 'touchstart' : (_this.browser.ie10 ? 'MSPointerDown' : 'mousedown'),
        touchMove : _this.support.touch || !params.simulateTouch ? 'touchmove' : (_this.browser.ie10 ? 'MSPointerMove' : 'mousemove'),
        touchEnd : _this.support.touch || !params.simulateTouch ? 'touchend' : (_this.browser.ie10 ? 'MSPointerUp' : 'mouseup')
    };

    /*=========================
      Wrapper
      ===========================*/
    for (var i = _this.container.childNodes.length - 1; i >= 0; i--) {
        if (_this.container.childNodes[i].className) {
            var _wrapperClasses = _this.container.childNodes[i].className.split(' ')
            for (var j = 0; j < _wrapperClasses.length; j++) {
                if (_wrapperClasses[j]===params.wrapperClass) {
                    wrapper = _this.container.childNodes[i];
                }
            };
        }
    };

    _this.wrapper = wrapper;
    /*=========================
      Slide API
      ===========================*/
    _this._extendSwiperSlide = function  (el) {
        el.append = function () {
            if (params.loop) {
                el.insertAfter(_this.slides.length-_this.loopedSlides);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                _this.wrapper.appendChild(el);
            }

            _this.reInit();
            return el;
        }
        el.prepend = function () {
            if (params.loop) {
                _this.wrapper.insertBefore(el, _this.slides[_this.loopedSlides]);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                _this.wrapper.insertBefore(el, _this.wrapper.firstChild);
            }
            _this.reInit();
            return el;
        }
        el.insertAfter = function (index) {
            if(typeof index === 'undefined') return false;
            var beforeSlide;

            if (params.loop) {
                beforeSlide = _this.slides[index + 1 + _this.loopedSlides];
                _this.wrapper.insertBefore(el, beforeSlide);
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else {
                beforeSlide = _this.slides[index + 1];
                _this.wrapper.insertBefore(el, beforeSlide)
            }
            _this.reInit();
            return el;
        }
        el.clone = function () {
            return _this._extendSwiperSlide(el.cloneNode(true))
        }
        el.remove = function () {
            _this.wrapper.removeChild(el);
            _this.reInit();
        }
        el.html = function (html) {
            if (typeof html === 'undefined') {
                return el.innerHTML;
            }
            else {
                el.innerHTML = html;
                return el;
            }
        }
        el.index = function () {
            var index;
            for (var i = _this.slides.length - 1; i >= 0; i--) {
                if(el === _this.slides[i]) index = i;
            }
            return index;
        }
        el.isActive = function () {
            if (el.index() === _this.activeIndex) return true;
            else return false;
        }
        if (!el.swiperSlideDataStorage) el.swiperSlideDataStorage={};
        el.getData = function (name) {
            return el.swiperSlideDataStorage[name];
        }
        el.setData = function (name, value) {
            el.swiperSlideDataStorage[name] = value;
            return el;
        }
        el.data = function (name, value) {
            if (!value) {
                return el.getAttribute('data-'+name);
            }
            else {
                el.setAttribute('data-'+name,value);
                return el;
            }
        }
        el.getWidth = function (outer) {
            return _this.h.getWidth(el, outer);
        }
        el.getHeight = function (outer) {
            return _this.h.getHeight(el, outer);
        }
        el.getOffset = function() {
            return _this.h.getOffset(el);
        }
        return el;
    }

    //Calculate information about number of slides
    _this.calcSlides = function (forceCalcSlides) {
        var oldNumber = _this.slides ? _this.slides.length : false;
        _this.slides = [];
        _this.displaySlides = [];
        for (var i = 0; i < _this.wrapper.childNodes.length; i++) {
            if (_this.wrapper.childNodes[i].className) {
                var _className = _this.wrapper.childNodes[i].className;
                var _slideClasses = _className.split(' ');
                for (var j = 0; j < _slideClasses.length; j++) {
                    if(_slideClasses[j]===params.slideClass) {
                        _this.slides.push(_this.wrapper.childNodes[i]);
                    }
                }
            }
        }
        for (i = _this.slides.length - 1; i >= 0; i--) {
            _this._extendSwiperSlide(_this.slides[i]);
        }
        if (oldNumber===false) return;
        if(oldNumber!==_this.slides.length || forceCalcSlides) {
            // Number of slides has been changed
            removeSlideEvents();
            addSlideEvents();
            _this.updateActiveSlide();
            if (_this.params.pagination) _this.createPagination();
            _this.callPlugins('numberOfSlidesChanged');
        }
    }

    //Create Slide
    _this.createSlide = function (html, slideClassList, el) {
        var slideClassList = slideClassList || _this.params.slideClass;
        var el = el||params.slideElement;
        var newSlide = document.createElement(el);
        newSlide.innerHTML = html||'';
        newSlide.className = slideClassList;
        return _this._extendSwiperSlide(newSlide);
    }

    //Append Slide
    _this.appendSlide = function (html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).append()
        }
        else {
            return _this.createSlide(html, slideClassList, el).append()
        }
    }
    _this.prependSlide = function (html, slideClassList, el) {
        if (!html) return;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).prepend()
        }
        else {
            return _this.createSlide(html, slideClassList, el).prepend()
        }
    }
    _this.insertSlideAfter = function (index, html, slideClassList, el) {
        if (typeof index === 'undefined') return false;
        if (html.nodeType) {
            return _this._extendSwiperSlide(html).insertAfter(index);
        }
        else {
            return _this.createSlide(html, slideClassList, el).insertAfter(index);
        }
    }
    _this.removeSlide = function (index) {
        if (_this.slides[index]) {
            if (params.loop) {
                if (!_this.slides[index+_this.loopedSlides]) return false;
                _this.slides[index+_this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else _this.slides[index].remove();
            return true;
        }
        else return false;
    }
    _this.removeLastSlide = function () {
        if (_this.slides.length>0) {
            if (params.loop) {
                _this.slides[_this.slides.length - 1 - _this.loopedSlides].remove();
                _this.removeLoopedSlides();
                _this.calcSlides();
                _this.createLoop();
            }
            else _this.slides[ (_this.slides.length-1) ].remove();
            return true;
        }
        else {
            return false;
        }
    }
    _this.removeAllSlides = function () {
        for (var i = _this.slides.length - 1; i >= 0; i--) {
            _this.slides[i].remove()
        }
    }
    _this.getSlide = function (index) {
        return _this.slides[index]
    }
    _this.getLastSlide = function () {
        return _this.slides[ _this.slides.length-1 ]
    }
    _this.getFirstSlide = function () {
        return _this.slides[0]
    }

    //Currently Active Slide
    _this.activeSlide = function () {
        return _this.slides[_this.activeIndex]
    }

    /*=========================
      Plugins API
      ===========================*/
    var _plugins = [];
    for (var plugin in _this.plugins) {
        if (params[plugin]) {
            var p = _this.plugins[plugin](_this, params[plugin]);
            if (p) _plugins.push( p );
        }
    }
    _this.callPlugins = function(method, args) {
        if (!args) args = {}
        for (var i=0; i<_plugins.length; i++) {
            if (method in _plugins[i]) {
                _plugins[i][method](args);
            }
        }
    }

    /*=========================
      WP8 Fix
      ===========================*/
    if (_this.browser.ie10 && !params.onlyExternal) {
        _this.wrapper.classList.add('swiper-wp8-' + (isH ? 'horizontal' : 'vertical'));
    }

    /*=========================
      Free Mode Class
      ===========================*/
    if (params.freeMode) {
        _this.container.className+=' swiper-free-mode';
    }

    /*==================================================
        Init/Re-init/Resize Fix
    ====================================================*/
    _this.initialized = false;
    _this.init = function(force, forceCalcSlides) {
        var _width = _this.h.getWidth(_this.container);
        var _height = _this.h.getHeight(_this.container);
        if (_width===_this.width && _height===_this.height && !force) return;
        _this.width = _width;
        _this.height = _height;

        containerSize = isH ? _width : _height;
        var wrapper = _this.wrapper;

        if (force) {
            _this.calcSlides(forceCalcSlides);
        }

        if (params.slidesPerView==='auto') {
            //Auto mode
            var slidesWidth = 0;
            var slidesHeight = 0;

            //Unset Styles
            if (params.slidesOffset>0) {
                wrapper.style.paddingLeft = '';
                wrapper.style.paddingRight = '';
                wrapper.style.paddingTop = '';
                wrapper.style.paddingBottom = '';
            }
            wrapper.style.width = '';
            wrapper.style.height = '';
            if (params.offsetPxBefore>0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore;
                else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter>0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter;
                else _this.wrapperBottom = params.offsetPxAfter;
            }

            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - this.slides[0].getWidth(true) )/2;
                    _this.wrapperRight = (containerSize - _this.slides[ _this.slides.length-1 ].getWidth(true))/2;
                }
                else {
                    _this.wrapperTop = (containerSize - _this.slides[0].getHeight(true))/2;
                    _this.wrapperBottom = (containerSize - _this.slides[ _this.slides.length-1 ].getHeight(true))/2;
                }
            }

            if (isH) {
                if (_this.wrapperLeft>=0) wrapper.style.paddingLeft = _this.wrapperLeft+'px';
                if (_this.wrapperRight>=0) wrapper.style.paddingRight = _this.wrapperRight+'px';
            }
            else {
                if (_this.wrapperTop>=0) wrapper.style.paddingTop = _this.wrapperTop+'px';
                if (_this.wrapperBottom>=0) wrapper.style.paddingBottom = _this.wrapperBottom+'px';
            }
            var slideLeft = 0;
            var centeredSlideLeft=0;
            _this.snapGrid = [];
            _this.slidesGrid = [];

            var slideMaxHeight = 0;
            for(var i = 0; i<_this.slides.length; i++) {
                var slideWidth = _this.slides[i].getWidth(true);
                var slideHeight = _this.slides[i].getHeight(true);
                if (params.calculateHeight) {
                    slideMaxHeight = Math.max(slideMaxHeight, slideHeight)
                }
                var _slideSize = isH ? slideWidth : slideHeight;
                if (params.centeredSlides) {
                    var nextSlideWidth = i === _this.slides.length-1 ? 0 : _this.slides[i+1].getWidth(true);
                    var nextSlideHeight = i === _this.slides.length-1 ? 0 : _this.slides[i+1].getHeight(true);
                    var nextSlideSize = isH ? nextSlideWidth : nextSlideHeight;
                    if (_slideSize>containerSize) {
                        for (var j=0; j<=Math.floor(_slideSize/(containerSize+_this.wrapperLeft)); j++) {
                            if (j === 0) _this.snapGrid.push(slideLeft+_this.wrapperLeft);
                            else _this.snapGrid.push(slideLeft+_this.wrapperLeft+containerSize*j);
                        }
                        _this.slidesGrid.push(slideLeft+_this.wrapperLeft);
                    }
                    else {
                        _this.snapGrid.push(centeredSlideLeft);
                        _this.slidesGrid.push(centeredSlideLeft);
                    }

                    centeredSlideLeft += _slideSize/2 + nextSlideSize/2;

                }
                else {
                    if (_slideSize>containerSize) {
                        for (var j=0; j<=Math.floor(_slideSize/containerSize); j++) {
                            _this.snapGrid.push(slideLeft+containerSize*j);
                        }
                    }
                    else {
                        _this.snapGrid.push(slideLeft);
                    }
                    _this.slidesGrid.push(slideLeft);
                }

                slideLeft += _slideSize;

                slidesWidth += slideWidth;
                slidesHeight += slideHeight;
            }
            if (params.calculateHeight) _this.height = slideMaxHeight;
            if(isH) {
                wrapperSize = slidesWidth + _this.wrapperRight + _this.wrapperLeft;
                wrapper.style.width = (slidesWidth)+'px';
                wrapper.style.height = (_this.height)+'px';
            }
            else {
                wrapperSize = slidesHeight + _this.wrapperTop + _this.wrapperBottom;
                wrapper.style.width = (_this.width)+'px';
                wrapper.style.height = (slidesHeight)+'px';
            }

        }
        else if (params.scrollContainer) {
            //Scroll Container
            wrapper.style.width = '';
            wrapper.style.height = '';
            var wrapperWidth = _this.slides[0].getWidth(true);
            var wrapperHeight = _this.slides[0].getHeight(true);
            wrapperSize = isH ? wrapperWidth : wrapperHeight;
            wrapper.style.width = wrapperWidth+'px';
            wrapper.style.height = wrapperHeight+'px';
            slideSize = isH ? wrapperWidth : wrapperHeight;

        }
        else {
            //For usual slides
            if (params.calculateHeight) {
                var slideMaxHeight = 0;
                var wrapperHeight = 0;
                //ResetWrapperSize
                if (!isH) _this.container.style.height= '';
                wrapper.style.height='';

                for (var i=0; i<_this.slides.length; i++) {
                    //ResetSlideSize
                    _this.slides[i].style.height='';
                    slideMaxHeight = Math.max( _this.slides[i].getHeight(true), slideMaxHeight );
                    if (!isH) wrapperHeight+=_this.slides[i].getHeight(true);
                }
                var slideHeight = slideMaxHeight;
                _this.height = slideHeight;

                if (isH) wrapperHeight = slideHeight;
                else containerSize = slideHeight, _this.container.style.height= containerSize+'px';
            }
            else {
                var slideHeight = isH ? _this.height : _this.height/params.slidesPerView;
                var wrapperHeight = isH ? _this.height : _this.slides.length*slideHeight;
            }
            var slideWidth = isH ? _this.width/params.slidesPerView : _this.width;
            var wrapperWidth = isH ? _this.slides.length*slideWidth : _this.width;
            slideSize = isH ? slideWidth : slideHeight;

            if (params.offsetSlidesBefore>0) {
                if (isH) _this.wrapperLeft = slideSize*params.offsetSlidesBefore;
                else _this.wrapperTop = slideSize*params.offsetSlidesBefore;
            }
            if (params.offsetSlidesAfter>0) {
                if (isH) _this.wrapperRight = slideSize*params.offsetSlidesAfter;
                else _this.wrapperBottom = slideSize*params.offsetSlidesAfter;
            }
            if (params.offsetPxBefore>0) {
                if (isH) _this.wrapperLeft = params.offsetPxBefore;
                else _this.wrapperTop = params.offsetPxBefore;
            }
            if (params.offsetPxAfter>0) {
                if (isH) _this.wrapperRight = params.offsetPxAfter;
                else _this.wrapperBottom = params.offsetPxAfter;
            }
            if (params.centeredSlides) {
                if (isH) {
                    _this.wrapperLeft = (containerSize - slideSize)/2;
                    _this.wrapperRight = (containerSize - slideSize)/2;
                }
                else {
                    _this.wrapperTop = (containerSize - slideSize)/2;
                    _this.wrapperBottom = (containerSize - slideSize)/2;
                }
            }
            if (isH) {
                if (_this.wrapperLeft>0) wrapper.style.paddingLeft = _this.wrapperLeft+'px';
                if (_this.wrapperRight>0) wrapper.style.paddingRight = _this.wrapperRight+'px';
            }
            else {
                if (_this.wrapperTop>0) wrapper.style.paddingTop = _this.wrapperTop+'px';
                if (_this.wrapperBottom>0) wrapper.style.paddingBottom = _this.wrapperBottom+'px';
            }

            wrapperSize = isH ? wrapperWidth + _this.wrapperRight + _this.wrapperLeft : wrapperHeight + _this.wrapperTop + _this.wrapperBottom;
            wrapper.style.width = wrapperWidth+'px';
            wrapper.style.height = wrapperHeight+'px';
            var slideLeft = 0;
            _this.snapGrid = [];
            _this.slidesGrid = [];
            for (var i=0; i<_this.slides.length; i++) {
                _this.snapGrid.push(slideLeft);
                _this.slidesGrid.push(slideLeft);
                slideLeft+=slideSize;
                _this.slides[i].style.width = slideWidth+'px';
                _this.slides[i].style.height = slideHeight+'px';
            }

        }

        if (!_this.initialized) {
            _this.callPlugins('onFirstInit');
            if (params.onFirstInit) params.onFirstInit(_this);
        }
        else {
            _this.callPlugins('onInit');
            if (params.onInit) params.onInit(_this);
        }
        _this.initialized = true;
    }
    
    _this.reInit = function (forceCalcSlides) {
        _this.init(true, forceCalcSlides);
    }
    
    _this.resizeFix = function (reInit) {
        _this.callPlugins('beforeResizeFix');
        
        _this.init(params.resizeReInit || reInit);
        
        // swipe to active slide in fixed mode
        if (!params.freeMode) {
            _this.swipeTo((params.loop ? _this.activeLoopIndex : _this.activeIndex), 0, false);
        }
        
        // move wrapper to the beginning in free mode
        else if (_this.getWrapperTranslate() < -maxWrapperPosition()) {
            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(-maxWrapperPosition());
        }
        
        _this.callPlugins('afterResizeFix');
    }

    /*==========================================
        Max and Min Positions
    ============================================*/
    function maxWrapperPosition() {
        var a = (wrapperSize - containerSize);
        if (params.freeMode) {
            a = wrapperSize - containerSize;
        }
        // if (params.loop) a -= containerSize;
        if (params.slidesPerView > _this.slides.length) a = 0;
        if (a<0) a = 0;
        return a;
    }
    function minWrapperPosition() {
        var a = 0;
        // if (params.loop) a = containerSize;
        return a;
    }

    /*==========================================
        Event Listeners
    ============================================*/
    function initEvents() {
        var bind = _this.h.addEventListener;
        
        //Touch Events
        if (!_this.browser.ie10) {
            if (_this.support.touch) {
                bind(_this.wrapper, 'touchstart', onTouchStart);
                bind(_this.wrapper, 'touchmove', onTouchMove);
                bind(_this.wrapper, 'touchend', onTouchEnd);
            }
            if (params.simulateTouch) {
                bind(_this.wrapper, 'mousedown', onTouchStart);
                bind(document, 'mousemove', onTouchMove);
                bind(document, 'mouseup', onTouchEnd);
            }
        }
        else {
            bind(_this.wrapper, _this.touchEvents.touchStart, onTouchStart);
            bind(document, _this.touchEvents.touchMove, onTouchMove);
            bind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }

        //Resize Event
        if (params.autoResize) {
            bind(window, 'resize', _this.resizeFix);
        }
        //Slide Events
        addSlideEvents();
        //Mousewheel
        _this._wheelEvent = false;
        if (params.mousewheelControl) {
            if ( document.onmousewheel !== undefined ) {
                _this._wheelEvent = "mousewheel";
            }
            try {
                WheelEvent("wheel");
                _this._wheelEvent = "wheel";
            } catch (e) {}
            if ( !_this._wheelEvent ) {
                _this._wheelEvent = "DOMMouseScroll";
            }

            if (_this._wheelEvent) {
                bind(_this.container, _this._wheelEvent, handleMousewheel);
            }
        }

        //Keyboard
        if (params.keyboardControl) {
            bind(document, 'keydown', handleKeyboardKeys);
        }
        if (params.updateOnImagesReady) {
            _this.imagesToLoad = $$('img', _this.container);

            for (var i=0; i<_this.imagesToLoad.length; i++) {
                _loadImage(_this.imagesToLoad[i].getAttribute('src'))
            }
        }
        function _loadImage(src) {
            var image = new Image();
            image.onload = function(){
                _this.imagesLoaded++;
                if (_this.imagesLoaded==_this.imagesToLoad.length) {
                    _this.reInit();
                    if (params.onImagesReady) params.onImagesReady(_this);
                }
            }
            image.src = src;
        }
    }

    //Remove Event Listeners
    _this.destroy = function(removeResizeFix){
        var unbind = _this.h.removeEventListener;
        
        //Touch Events
        if (!_this.browser.ie10) {
            if (_this.support.touch) {
                unbind(_this.wrapper, 'touchstart', onTouchStart);
                unbind(_this.wrapper, 'touchmove', onTouchMove);
                unbind(_this.wrapper, 'touchend', onTouchEnd);
            }
            if (params.simulateTouch) {
                unbind(_this.wrapper, 'mousedown', onTouchStart);
                unbind(document, 'mousemove', onTouchMove);
                unbind(document, 'mouseup', onTouchEnd);
            }
        }
        else {
            unbind(_this.wrapper, _this.touchEvents.touchStart, onTouchStart);
            unbind(document, _this.touchEvents.touchMove, onTouchMove);
            unbind(document, _this.touchEvents.touchEnd, onTouchEnd);
        }

        //Resize Event
        if (params.autoResize) {
            unbind(window, 'resize', _this.resizeFix);
        }
        
        //Init Slide Events
        removeSlideEvents();

        //Pagination
        if (params.paginationClickable) {
            removePaginationEvents();
        }

        //Mousewheel
        if (params.mousewheelControl && _this._wheelEvent) {
           unbind(_this.container, _this._wheelEvent, handleMousewheel);
        }

        //Keyboard
        if (params.keyboardControl) {
            unbind(document, 'keydown', handleKeyboardKeys);
        }

        //Stop autoplay
        if (params.autoplay) {
            _this.stopAutoplay();
        }
        _this.callPlugins('onDestroy');

        //Destroy variable
        _this = null;
    }
    function addSlideEvents() {
        var bind = _this.h.addEventListener,
            i;

        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$('a', _this.container);
            for (i=0; i<links.length; i++) {
                bind(links[i], 'click', preventClick);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$('input, textarea, select', _this.container);
            for (i=0; i<formElements.length; i++) {
                bind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
            }
        }

        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i=0; i<_this.slides.length; i++) {
                bind(_this.slides[i], 'click', slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i=0; i<_this.slides.length; i++) {
                bind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
    }
    function removeSlideEvents() {
        var unbind = _this.h.removeEventListener,
            i;

        //Slide Clicks & Touches
        if (params.onSlideClick) {
            for (i=0; i<_this.slides.length; i++) {
                unbind(_this.slides[i], 'click', slideClick);
            }
        }
        if (params.onSlideTouch) {
            for (i=0; i<_this.slides.length; i++) {
                unbind(_this.slides[i], _this.touchEvents.touchStart, slideTouch);
            }
        }
        //Release Form Elements
        if (params.releaseFormElements) {
            var formElements = $$('input, textarea, select', _this.container);
            for (i=0; i<formElements.length; i++) {
                unbind(formElements[i], _this.touchEvents.touchStart, releaseForms, true);
            }
        }
        //Prevent Links Events
        if (params.preventLinks) {
            var links = $$('a', _this.container);
            for (i=0; i<links.length; i++) {
                unbind(links[i], 'click', preventClick);
            }
        }
    }
    /*==========================================
        Keyboard Control
    ============================================*/
    function handleKeyboardKeys (e) {
        var kc = e.keyCode || e.charCode;
        if (kc==37 || kc==39 || kc==38 || kc==40) {
            var inView = false;
            //Check that swiper should be inside of visible area of window
            var swiperOffset = _this.h.getOffset( _this.container );
            var scrollLeft = _this.h.windowScroll().left;
            var scrollTop = _this.h.windowScroll().top;
            var windowWidth = _this.h.windowWidth();
            var windowHeight = _this.h.windowHeight();
            var swiperCoord = [
                [swiperOffset.left, swiperOffset.top],
                [swiperOffset.left + _this.width, swiperOffset.top],
                [swiperOffset.left, swiperOffset.top + _this.height],
                [swiperOffset.left + _this.width, swiperOffset.top + _this.height]
            ]
            for (var i=0; i<swiperCoord.length; i++) {
                var point = swiperCoord[i];
                if (
                    point[0]>=scrollLeft && point[0]<=scrollLeft+windowWidth &&
                    point[1]>=scrollTop && point[1]<=scrollTop+windowHeight
                ) {
                    inView = true;
                }

            }
            if (!inView) return;
        }
        if (isH) {
            if (kc==37 || kc==39) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
            if (kc == 39) _this.swipeNext();
            if (kc == 37) _this.swipePrev();
        }
        else {
            if (kc==38 || kc==40) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
            }
            if (kc == 40) _this.swipeNext();
            if (kc == 38) _this.swipePrev();
        }
    }

    /*==========================================
        Mousewheel Control
    ============================================*/
    var allowScrollChange = true;
    function handleMousewheel (e) {
        var we = _this._wheelEvent;
        var delta;
        //Opera & IE
        if (e.detail) delta = -e.detail;
        //WebKits
        else if (we == 'mousewheel') delta = e.wheelDelta;
        //Old FireFox
        else if (we == 'DOMMouseScroll') delta = -e.detail;
        //New FireFox
        else if (we == 'wheel') {
            delta = Math.abs(e.deltaX)>Math.abs(e.deltaY) ? - e.deltaX : - e.deltaY;
        }
        if (!params.freeMode) {
            if(delta<0) _this.swipeNext();
            else _this.swipePrev();
        }
        else {
            //Freemode or scrollContainer:
            var position = _this.getWrapperTranslate() + delta;
            
            if (position > 0) position = 0;
            if (position < -maxWrapperPosition()) position = -maxWrapperPosition();
            
            _this.setWrapperTransition(0);
            _this.setWrapperTranslate(position);
            _this.updateActiveSlide(position);
        }
        if (params.autoplay) _this.stopAutoplay(true);

        if(e.preventDefault) e.preventDefault();
        else e.returnValue = false;
        return false;
    }

    /*=========================
      Grab Cursor
      ===========================*/
    if (params.grabCursor) {
        var containerStyle = _this.container.style;
        containerStyle.cursor = 'move';
        containerStyle.cursor = 'grab';
        containerStyle.cursor = '-moz-grab';
        containerStyle.cursor = '-webkit-grab';
    }

    /*=========================
      Slides Events Handlers
      ===========================*/
    
    _this.allowSlideClick = true;
    function slideClick(event) {
        if (_this.allowSlideClick) {
            setClickedSlide(event);
            params.onSlideClick(_this, event);
        }
    }
    
    function slideTouch(event) {
        setClickedSlide(event);
        params.onSlideTouch(_this, event);
    }
    
    function setClickedSlide(event) {
        
        // IE 6-8 support
        if (!event.currentTarget) {
            var element = event.srcElement;
            do {
                if (element.className.indexOf(params.slideClass) > -1) {
                    break;
                }
            }
            while (element = element.parentNode);
            _this.clickedSlide = element;
        }
        else {
            _this.clickedSlide = event.currentTarget;
        }
        
        _this.clickedSlideIndex     = _this.slides.indexOf(_this.clickedSlide);
        _this.clickedSlideLoopIndex = _this.clickedSlideIndex - (_this.loopedSlides || 0);
    }
    
    _this.allowLinks = true;
    function preventClick(e) {
        if (!_this.allowLinks) {
            if(e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return false;
        }
    }
    function releaseForms(e) {
        if (e.stopPropagation) e.stopPropagation();
        else e.returnValue = false;
        return false;
        
    }

    /*==================================================
        Event Handlers
    ====================================================*/
    var isTouchEvent = false;
    var allowThresholdMove;
    var allowMomentumBounce = true;
    function onTouchStart(event) {
        if (params.preventLinks) _this.allowLinks = true;
        //Exit if slider is already was touched
        if (_this.isTouched || params.onlyExternal) {
            return false;
        }

        if (params.noSwiping && (event.target || event.srcElement) && noSwipingSlide(event.target || event.srcElement)) return false;
        allowMomentumBounce = false;

        //Check For Nested Swipers
        _this.isTouched = true;
        isTouchEvent = event.type=='touchstart';

        if (!isTouchEvent || event.targetTouches.length == 1 ) {
            _this.callPlugins('onTouchStartBegin');

            if(!isTouchEvent) {
                if(event.preventDefault) event.preventDefault();
                else event.returnValue = false;
            }
            
            var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
            var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

            //Start Touches to check the scrolling
            _this.touches.startX = _this.touches.currentX = pageX;
            _this.touches.startY = _this.touches.currentY = pageY;

            _this.touches.start = _this.touches.current = isH ? pageX : pageY;

            //Set Transition Time to 0
            _this.setWrapperTransition(0);

            //Get Start Translate Position
            _this.positions.start = _this.positions.current = _this.getWrapperTranslate();

            //Set Transform
            _this.setWrapperTranslate(_this.positions.start);

            //TouchStartTime
            _this.times.start = (new Date()).getTime();

            //Unset Scrolling
            isScrolling = undefined;

            //Set Treshold
            if (params.moveStartThreshold>0) allowThresholdMove = false;

            //CallBack
            if (params.onTouchStart) params.onTouchStart(_this);
            _this.callPlugins('onTouchStartEnd');

        }
    }
    var velocityPrevPosition, velocityPrevTime;
    function onTouchMove(event) {
        // If slider is not touched - exit
        if (!_this.isTouched || params.onlyExternal) return;
        if (isTouchEvent && event.type=='mousemove') return;

        var pageX = isTouchEvent ? event.targetTouches[0].pageX : (event.pageX || event.clientX);
        var pageY = isTouchEvent ? event.targetTouches[0].pageY : (event.pageY || event.clientY);

        //check for scrolling
        if ( typeof isScrolling === 'undefined' && isH) {
          isScrolling = !!( isScrolling || Math.abs(pageY - _this.touches.startY) > Math.abs( pageX - _this.touches.startX ) );
        }
        if ( typeof isScrolling === 'undefined' && !isH) {
          isScrolling = !!( isScrolling || Math.abs(pageY - _this.touches.startY) < Math.abs( pageX - _this.touches.startX ) );
        }
        if (isScrolling ) {
            _this.isTouched = false;
            return;
        }

        //Check For Nested Swipers
        if (event.assignedToSwiper) {
            _this.isTouched = false;
            return;
        }
        event.assignedToSwiper = true;

        //Block inner links
        if (params.preventLinks) {
            _this.allowLinks = false;
        }
        if (params.onSlideClick) {
            _this.allowSlideClick = false;
        }

        //Stop AutoPlay if exist
        if (params.autoplay) {
            _this.stopAutoplay(true);
        }
        if (!isTouchEvent || event.touches.length == 1) {

            //Moved Flag
            if (!_this.isMoved) {
                _this.callPlugins('onTouchMoveStart');
                
                if (params.loop) {
                    _this.fixLoop();
                    _this.positions.start = _this.getWrapperTranslate();
                }
                if (params.onTouchMoveStart) params.onTouchMoveStart(_this);
            }
            _this.isMoved = true;
            
            // cancel event
            if(event.preventDefault) event.preventDefault();
            else event.returnValue = false;

            _this.touches.current = isH ? pageX : pageY ;

            _this.positions.current = (_this.touches.current - _this.touches.start) * params.touchRatio + _this.positions.start;

            //Resistance Callbacks
            if(_this.positions.current > 0 && params.onResistanceBefore) {
                params.onResistanceBefore(_this, _this.positions.current);
            }
            if(_this.positions.current < -maxWrapperPosition() && params.onResistanceAfter) {
                params.onResistanceAfter(_this, Math.abs(_this.positions.current + maxWrapperPosition()));
            }
            //Resistance
            if (params.resistance && params.resistance!='100%') {
                //Resistance for Negative-Back sliding
                if(_this.positions.current > 0) {
                    var resistance = 1 - _this.positions.current/containerSize/2;
                    if (resistance < 0.5)
                        _this.positions.current = (containerSize/2);
                    else
                        _this.positions.current = _this.positions.current * resistance;
                }
                //Resistance for After-End Sliding
                if ( _this.positions.current < -maxWrapperPosition() ) {

                    var diff = (_this.touches.current - _this.touches.start)*params.touchRatio + (maxWrapperPosition()+_this.positions.start);
                    var resistance = (containerSize+diff)/(containerSize);
                    var newPos = _this.positions.current-diff*(1-resistance)/2;
                    var stopPos = -maxWrapperPosition() - containerSize/2;

                    if (newPos < stopPos || resistance<=0)
                        _this.positions.current = stopPos;
                    else
                        _this.positions.current = newPos;
                }
            }
            if (params.resistance && params.resistance=='100%') {
                //Resistance for Negative-Back sliding
                if(_this.positions.current > 0 && !(params.freeMode&&!params.freeModeFluid)) {
                    _this.positions.current = 0;
                }
                //Resistance for After-End Sliding
                if ( (_this.positions.current) < -maxWrapperPosition() && !(params.freeMode&&!params.freeModeFluid)) {
                    _this.positions.current = -maxWrapperPosition();
                }
            }
            //Move Slides
            if (!params.followFinger) return;

            if (!params.moveStartThreshold) {
                _this.setWrapperTranslate(_this.positions.current);
            }
            else {
                if ( Math.abs(_this.touches.current - _this.touches.start)>params.moveStartThreshold || allowThresholdMove) {
                    allowThresholdMove = true;
                    _this.setWrapperTranslate(_this.positions.current);
                }
                else {
                    _this.positions.current = _this.positions.start;
                }
            }

            if (params.freeMode || params.watchActiveIndex) {
                _this.updateActiveSlide(_this.positions.current);
            }

            //Grab Cursor
            if (params.grabCursor) {
                _this.container.style.cursor = 'move';
                _this.container.style.cursor = 'grabbing';
                _this.container.style.cursor = '-moz-grabbin';
                _this.container.style.cursor = '-webkit-grabbing';
            }
            //Velocity
            if (!velocityPrevPosition) velocityPrevPosition = _this.touches.current;
            if (!velocityPrevTime) velocityPrevTime = (new Date).getTime();
            _this.velocity = (_this.touches.current - velocityPrevPosition)/((new Date).getTime() - velocityPrevTime)/2;
            if (Math.abs(_this.touches.current - velocityPrevPosition)<2) _this.velocity=0;
            velocityPrevPosition = _this.touches.current;
            velocityPrevTime = (new Date).getTime();
            //Callbacks
            _this.callPlugins('onTouchMoveEnd');
            if (params.onTouchMove) params.onTouchMove(_this);

            return false;
        }
    }
    function onTouchEnd(event) {
        //Check For scrolling
        if (isScrolling) {
            _this.swipeReset();
        }
        // If slider is not touched exit
        if ( params.onlyExternal || !_this.isTouched ) return;
        _this.isTouched = false

        //Return Grab Cursor
        if (params.grabCursor) {
            _this.container.style.cursor = 'move';
            _this.container.style.cursor = 'grab';
            _this.container.style.cursor = '-moz-grab';
            _this.container.style.cursor = '-webkit-grab';
        }

        //Check for Current Position
        if (!_this.positions.current && _this.positions.current!==0) {
            _this.positions.current = _this.positions.start
        }

        //For case if slider touched but not moved
        if (params.followFinger) {
            _this.setWrapperTranslate(_this.positions.current);
        }

        // TouchEndTime
        _this.times.end = (new Date()).getTime();

        //Difference
        _this.touches.diff = _this.touches.current - _this.touches.start
        _this.touches.abs = Math.abs(_this.touches.diff)

        _this.positions.diff = _this.positions.current - _this.positions.start
        _this.positions.abs = Math.abs(_this.positions.diff)

        var diff = _this.positions.diff ;
        var diffAbs =_this.positions.abs ;
        var timeDiff = _this.times.end - _this.times.start

        if(diffAbs < 5 && (timeDiff) < 300 && _this.allowLinks == false) {
            if (!params.freeMode && diffAbs!=0) _this.swipeReset()
            //Release inner links
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }
        
        setTimeout(function () {
            //Release inner links
            if (params.preventLinks) {
                _this.allowLinks = true;
            }
            if (params.onSlideClick) {
                _this.allowSlideClick = true;
            }
        }, 100);

        var maxPosition = maxWrapperPosition();

        //Not moved or Prevent Negative Back Sliding/After-End Sliding
        if (!_this.isMoved && params.freeMode) {
            _this.isMoved = false;
            if (params.onTouchEnd) params.onTouchEnd(_this);
            _this.callPlugins('onTouchEnd');
            return;   
        }
        if (!_this.isMoved || _this.positions.current > 0 || _this.positions.current < -maxPosition) {
            _this.swipeReset();
            if (params.onTouchEnd) params.onTouchEnd(_this);
            _this.callPlugins('onTouchEnd');
            return;
        }

        _this.isMoved = false;

        //Free Mode
        if (params.freeMode) {
            if ( params.freeModeFluid ) {
                var momentumDuration = 1000*params.momentumRatio;
                var momentumDistance = _this.velocity*momentumDuration;
                var newPosition = _this.positions.current + momentumDistance
                var doBounce = false;
                var afterBouncePosition;
                var bounceAmount = Math.abs( _this.velocity )*20*params.momentumBounceRatio;
                if (newPosition < -maxPosition) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition + maxPosition < -bounceAmount) newPosition = -maxPosition-bounceAmount;
                        afterBouncePosition = -maxPosition;
                        doBounce=true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = -maxPosition;
                }
                if (newPosition > 0) {
                    if (params.momentumBounce && _this.support.transitions) {
                        if (newPosition>bounceAmount) newPosition = bounceAmount;
                        afterBouncePosition = 0
                        doBounce = true;
                        allowMomentumBounce = true;
                    }
                    else newPosition = 0;
                }
                //Fix duration
                if (_this.velocity!=0) momentumDuration = Math.abs((newPosition - _this.positions.current)/_this.velocity)

                _this.setWrapperTranslate(newPosition);

                _this.setWrapperTransition( momentumDuration );

                if (params.momentumBounce && doBounce) {
                    _this.wrapperTransitionEnd(function () {
                        if (!allowMomentumBounce) return;
                        
                        if (params.onMomentumBounce) params.onMomentumBounce(_this);
                        
                        _this.setWrapperTranslate(afterBouncePosition);
                        _this.setWrapperTransition(300);
                    })
                }

                _this.updateActiveSlide(newPosition)
            }
            if (!params.freeModeFluid || timeDiff >= 300) _this.updateActiveSlide(_this.positions.current)

            if (params.onTouchEnd) params.onTouchEnd(_this)
            _this.callPlugins('onTouchEnd');
            return;
        }

        //Direction
        direction = diff < 0 ? "toNext" : "toPrev"

        //Short Touches
        if (direction=="toNext" && ( timeDiff <= 300 ) ) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset()
            else _this.swipeNext(true);
        }

        if (direction=="toPrev" && ( timeDiff <= 300 ) ) {
            if (diffAbs < 30 || !params.shortSwipes) _this.swipeReset()
            else _this.swipePrev(true);
        }

        //Long Touches
        var targetSlideSize = 0;
        if(params.slidesPerView == 'auto') {
            //Define current slide's width
            var currentPosition = Math.abs(_this.getWrapperTranslate());
            var slidesOffset = 0;
            var _slideSize;
            for (var i=0; i<_this.slides.length; i++) {
                _slideSize = isH ? _this.slides[i].getWidth(true) : _this.slides[i].getHeight(true);
                slidesOffset+= _slideSize;
                if (slidesOffset>currentPosition) {
                    targetSlideSize = _slideSize;
                    break;
                }
            }
            if (targetSlideSize>containerSize) targetSlideSize = containerSize;
        }
        else {
            targetSlideSize = slideSize * params.slidesPerView;
        }
        if (direction=="toNext" && ( timeDiff > 300 ) ) {
            if (diffAbs >= targetSlideSize*0.5) {
                _this.swipeNext(true)
            }
            else {
                _this.swipeReset()
            }
        }
        if (direction=="toPrev" && ( timeDiff > 300 ) ) {
            if (diffAbs >= targetSlideSize*0.5) {
                _this.swipePrev(true);
            }
            else {
                _this.swipeReset()
            }
        }
        if (params.onTouchEnd) params.onTouchEnd(_this)
        _this.callPlugins('onTouchEnd');
    }


    /*==================================================
        noSwiping Bubble Check by Isaac Strack
    ====================================================*/
    function noSwipingSlide(el){
        /*This function is specifically designed to check the parent elements for the noSwiping class, up to the wrapper.
        We need to check parents because while onTouchStart bubbles, _this.isTouched is checked in onTouchStart, which stops the bubbling.
        So, if a text box, for example, is the initial target, and the parent slide container has the noSwiping class, the _this.isTouched
        check will never find it, and what was supposed to be noSwiping is able to be swiped.
        This function will iterate up and check for the noSwiping class in parents, up through the wrapperClass.*/

        // First we create a truthy variable, which is that swiping is allowd (noSwiping = false)
        var noSwiping = false;
    
        // Now we iterate up (parentElements) until we reach the node with the wrapperClass.
        do{

            // Each time, we check to see if there's a 'swiper-no-swiping' class (noSwipingClass).
            if (el.className.indexOf(params.noSwipingClass)>-1)
            {
                noSwiping = true; // If there is, we set noSwiping = true;
            }

            el = el.parentElement;  // now we iterate up (parent node)

        } while(!noSwiping && el.parentElement && el.className.indexOf(params.wrapperClass)==-1); // also include el.parentElement truthy, just in case.

        // because we didn't check the wrapper itself, we do so now, if noSwiping is false:
        if (!noSwiping && el.className.indexOf(params.wrapperClass)>-1 && el.className.indexOf(params.noSwipingClass)>-1)
            noSwiping = true; // if the wrapper has the noSwipingClass, we set noSwiping = true;

        return noSwiping;
    }

    /*==================================================
        Swipe Functions
    ====================================================*/
    _this.swipeNext = function(internal){
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins('onSwipeNext');
        var currentPosition = _this.getWrapperTranslate();
        var newPosition = currentPosition;
        if (params.slidesPerView=='auto') {
            for (var i=0; i<_this.snapGrid.length; i++) {
                if (-currentPosition >= _this.snapGrid[i] && -currentPosition<_this.snapGrid[i+1]) {
                    newPosition = -_this.snapGrid[i+1]
                    break;
                }
            }
        }
        else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.floor(Math.abs(currentPosition)/Math.floor(groupSize))*groupSize + groupSize);
        }
        if (newPosition < - maxWrapperPosition()) {
            newPosition = - maxWrapperPosition()
        };

        if (newPosition == currentPosition) return false;

        swipeToPosition(newPosition, 'next');
        return true
    }
    _this.swipePrev = function(internal){
        if (!internal && params.loop) _this.fixLoop();
        if (!internal && params.autoplay) _this.stopAutoplay(true);
        _this.callPlugins('onSwipePrev');

        var currentPosition = Math.ceil(_this.getWrapperTranslate());
        var newPosition;
        if (params.slidesPerView=='auto') {
            newPosition = 0;
            for (var i=1; i<_this.snapGrid.length; i++) {
                if (-currentPosition == _this.snapGrid[i]) {
                    newPosition = -_this.snapGrid[i-1]
                    break;
                }
                if (-currentPosition > _this.snapGrid[i] && -currentPosition<_this.snapGrid[i+1]) {
                    newPosition = -_this.snapGrid[i]
                    break;
                }
            }
        }
        else {
            var groupSize = slideSize * params.slidesPerGroup;
            newPosition = -(Math.ceil(-currentPosition/groupSize)-1)*groupSize;
        }

        if (newPosition > 0) newPosition = 0;

        if (newPosition == currentPosition) return false;
        swipeToPosition(newPosition, 'prev');
        return true;

    }
    _this.swipeReset = function(){
        _this.callPlugins('onSwipeReset');
        var currentPosition = _this.getWrapperTranslate();
        var groupSize = slideSize * params.slidesPerGroup;
        var newPosition;
        var maxPosition = -maxWrapperPosition();
        if (params.slidesPerView=='auto') {
            newPosition = 0;
            for (var i=0; i<_this.snapGrid.length; i++) {
                if (-currentPosition===_this.snapGrid[i]) return;
                if (-currentPosition >= _this.snapGrid[i] && -currentPosition<_this.snapGrid[i+1]) {
                    if(_this.positions.diff>0) newPosition = -_this.snapGrid[i+1]
                    else newPosition = -_this.snapGrid[i]
                    break;
                }
            }
            if (-currentPosition >= _this.snapGrid[_this.snapGrid.length-1]) newPosition = -_this.snapGrid[_this.snapGrid.length-1];
            if (currentPosition <= -maxWrapperPosition()) newPosition = -maxWrapperPosition()
        }
        else {
            newPosition = currentPosition<0 ? Math.round(currentPosition/groupSize)*groupSize : 0
        }
        if (params.scrollContainer)  {
            newPosition = currentPosition<0 ? currentPosition : 0;
        }
        if (newPosition < -maxWrapperPosition()) {
            newPosition = -maxWrapperPosition()
        }
        if (params.scrollContainer && (containerSize>slideSize)) {
            newPosition = 0;
        }

        if (newPosition == currentPosition) return false;

        swipeToPosition(newPosition, 'reset');
        return true;
    }
    
    _this.swipeTo = function(index, speed, runCallbacks) {
        index = parseInt(index, 10);
        _this.callPlugins('onSwipeTo', {index:index, speed:speed});
        if (params.loop) index = index + _this.loopedSlides;
        var currentPosition = _this.getWrapperTranslate();
        if (index > (_this.slides.length-1) || index < 0) return;
        var newPosition
        if (params.slidesPerView=='auto') {
            newPosition = -_this.slidesGrid[ index ];
        }
        else {
            newPosition =  -index*slideSize;
        }
        if (newPosition < - maxWrapperPosition()) {
            newPosition = - maxWrapperPosition();
        };

        if (newPosition == currentPosition) return false;

        runCallbacks = runCallbacks===false ? false : true;
        swipeToPosition(newPosition, 'to', {index:index, speed:speed, runCallbacks:runCallbacks});
        return true;
    }
    
    function swipeToPosition(newPosition, action, toOptions) {
        var speed = (action=='to' && toOptions.speed >= 0) ? toOptions.speed : params.speed;
        
        if (_this.support.transitions || !params.DOMAnimation) {
            _this.setWrapperTranslate(newPosition);
            _this.setWrapperTransition(speed);
        }
        else {
            //Try the DOM animation
            var currentPosition = _this.getWrapperTranslate();
            var animationStep = Math.ceil( (newPosition - currentPosition)/speed*(1000/60) );
            var direction = currentPosition > newPosition ? 'toNext' : 'toPrev';
            var condition = direction=='toNext' ? currentPosition > newPosition : currentPosition < newPosition;
            if (_this._DOMAnimating) return;

            anim();
        }
        function anim(){
            currentPosition += animationStep;
            condition = direction=='toNext' ? currentPosition > newPosition : currentPosition < newPosition;
            if (condition) {
                _this.setWrapperTranslate(Math.round(currentPosition));
                _this._DOMAnimating = true
                window.setTimeout(function(){
                    anim()
                }, 1000 / 60)
            }
            else {
                if (params.onSlideChangeEnd) params.onSlideChangeEnd(_this);
                _this.setWrapperTranslate(newPosition);
                _this._DOMAnimating = false;
            }
        }

        //Update Active Slide Index
        _this.updateActiveSlide(newPosition);

        //Callbacks
        if (params.onSlideNext && action=='next') {
            params.onSlideNext(_this, newPosition);
        }
        if (params.onSlidePrev && action=='prev') {
            params.onSlidePrev(_this, newPosition);
        }
        //"Reset" Callback
        if (params.onSlideReset && action=='reset') {
            params.onSlideReset(_this, newPosition);
        }

        //"Next", "Prev" and "To" Callbacks
        if (action=='next' || action=='prev' || (action=='to' && toOptions.runCallbacks==true))
            slideChangeCallbacks();
    }
    /*==================================================
        Transition Callbacks
    ====================================================*/
    //Prevent Multiple Callbacks
    _this._queueStartCallbacks = false;
    _this._queueEndCallbacks = false;
    function slideChangeCallbacks() {
        //Transition Start Callback
        _this.callPlugins('onSlideChangeStart');
        if (params.onSlideChangeStart) {
            if (params.queueStartCallbacks && _this.support.transitions) {
                if (_this._queueStartCallbacks) return;
                _this._queueStartCallbacks = true;
                params.onSlideChangeStart(_this)
                _this.wrapperTransitionEnd(function(){
                    _this._queueStartCallbacks = false;
                })
            }
            else params.onSlideChangeStart(_this)
        }
        //Transition End Callback
        if (params.onSlideChangeEnd) {
            if (_this.support.transitions) {
                if (params.queueEndCallbacks) {
                    if (_this._queueEndCallbacks) return;
                    _this._queueEndCallbacks = true;
                    _this.wrapperTransitionEnd(params.onSlideChangeEnd)
                }
                else _this.wrapperTransitionEnd(params.onSlideChangeEnd)
            }
            else {
                if (!params.DOMAnimation) {
                    setTimeout(function(){
                        params.onSlideChangeEnd(_this)
                    },10)
                }
            }
        }
    }
    
    /*==================================================
        Update Active Slide Index
    ====================================================*/
    _this.updateActiveSlide = function(position) {
        if (!_this.initialized) return;
        if (_this.slides.length==0) return;
        _this.previousIndex = _this.activeIndex;
        if (typeof position=='undefined') position = _this.getWrapperTranslate();
        if (position>0) position=0;
        
        if (params.slidesPerView == 'auto') {
            var slidesOffset = 0;
            _this.activeIndex = _this.slidesGrid.indexOf(-position);
            if (_this.activeIndex<0) {
                for (var i=0; i<_this.slidesGrid.length-1; i++) {
                    if (-position>_this.slidesGrid[i] && -position<_this.slidesGrid[i+1]) {
                        break;
                    }
                }
                var leftDistance = Math.abs( _this.slidesGrid[i] + position )
                var rightDistance = Math.abs( _this.slidesGrid[i+1] + position )
                if (leftDistance<=rightDistance) _this.activeIndex = i;
                else _this.activeIndex = i+1;
            }
        }
        else {
            _this.activeIndex = Math[params.visibilityFullFit ? 'ceil' : 'round']( -position/slideSize );
        }
        
        if (_this.activeIndex == _this.slides.length ) _this.activeIndex = _this.slides.length - 1;
        if (_this.activeIndex < 0) _this.activeIndex = 0;
        
        // Check for slide
        if (!_this.slides[_this.activeIndex]) return;
        
        // Calc Visible slides
        _this.calcVisibleSlides(position);

        // Mark visible and active slides with additonal classes
        var activeClassRegexp = new RegExp( "\\s*" + params.slideActiveClass );
        var inViewClassRegexp = new RegExp( "\\s*" + params.slideVisibleClass );

        for (var i = 0; i < _this.slides.length; i++) {
            _this.slides[ i ].className = _this.slides[ i ].className.replace( activeClassRegexp, '' ).replace( inViewClassRegexp, '' );
            if ( _this.visibleSlides.indexOf( _this.slides[ i ] )>=0 ) {
                _this.slides[ i ].className += ' ' + params.slideVisibleClass;
            }

        }
        _this.slides[ _this.activeIndex ].className += ' ' + params.slideActiveClass;

        //Update loop index
        if (params.loop) {
            var ls = _this.loopedSlides;
            _this.activeLoopIndex = _this.activeIndex - ls;
            if (_this.activeLoopIndex >= _this.slides.length - ls*2 ) {
                _this.activeLoopIndex = _this.slides.length - ls*2 - _this.activeLoopIndex;
            }
            if (_this.activeLoopIndex<0) {
                _this.activeLoopIndex = _this.slides.length - ls*2 + _this.activeLoopIndex;
            }
        }
        else {
            _this.activeLoopIndex = _this.activeIndex;
        }
        //Update Pagination
        if (params.pagination) {
            _this.updatePagination(position);
        }
    }
    /*==================================================
        Pagination
    ====================================================*/
    _this.createPagination = function (firstInit) {
        if (params.paginationClickable && _this.paginationButtons) {
            removePaginationEvents();
        }
        _this.paginationContainer = params.pagination.nodeType ? params.pagination : $$(params.pagination)[0];
        if (params.createPagination) {
            var paginationHTML = "";
            var numOfSlides = _this.slides.length;
            var numOfButtons = numOfSlides;
            if (params.loop) numOfButtons -= _this.loopedSlides*2
            for (var i = 0; i < numOfButtons; i++) {
                paginationHTML += '<'+params.paginationElement+' class="'+params.paginationElementClass+'"></'+params.paginationElement+'>'
            }
            _this.paginationContainer.innerHTML = paginationHTML;    
        }
        _this.paginationButtons = $$('.'+params.paginationElementClass, _this.paginationContainer);
        if (!firstInit) _this.updatePagination()
        _this.callPlugins('onCreatePagination');
        if (params.paginationClickable) {
            addPaginationEvents();
        }
    }
    function removePaginationEvents() {
        var pagers = _this.paginationButtons;
        for (var i=0; i<pagers.length; i++) {
            _this.h.removeEventListener(pagers[i], 'click', paginationClick);
        }
    }
    function addPaginationEvents() {
        var pagers = _this.paginationButtons;
        for (var i=0; i<pagers.length; i++) {
            _this.h.addEventListener(pagers[i], 'click', paginationClick);
        }
    }
    function paginationClick(e){
        var index;
        var target = e.target || e.srcElement;
        var pagers = _this.paginationButtons;
        for (var i=0; i<pagers.length; i++) {
            if (target===pagers[i]) index = i;
        }
        _this.swipeTo(index)
    }
    _this.updatePagination = function(position) {
        if (!params.pagination) return;
        if (_this.slides.length<1) return;
        var activePagers = $$('.'+params.paginationActiveClass, _this.paginationContainer);
        if(!activePagers) return;

        //Reset all Buttons' class to not active
        var pagers = _this.paginationButtons;
        if (pagers.length==0) return;
        for (var i=0; i < pagers.length; i++) {
            pagers[i].className = params.paginationElementClass
        }

        var indexOffset = params.loop ? _this.loopedSlides : 0;
        if (params.paginationAsRange) {
            if (!_this.visibleSlides) _this.calcVisibleSlides(position)
            //Get Visible Indexes
            var visibleIndexes = [];
            for (var i = 0; i < _this.visibleSlides.length; i++) {
                var visIndex = _this.slides.indexOf( _this.visibleSlides[i] ) - indexOffset

                if (params.loop && visIndex<0) {
                    visIndex = _this.slides.length - _this.loopedSlides*2 + visIndex;
                }
                if (params.loop && visIndex>=_this.slides.length-_this.loopedSlides*2) {
                    visIndex = _this.slides.length - _this.loopedSlides*2 - visIndex;
                    visIndex = Math.abs(visIndex)
                }
                visibleIndexes.push( visIndex )
            }
            
            for (i=0; i<visibleIndexes.length; i++) {
                if (pagers[ visibleIndexes[i] ]) pagers[ visibleIndexes[i] ].className += ' ' + params.paginationVisibleClass;
            }
            
            if (params.loop) {
                pagers[ _this.activeLoopIndex ].className += ' ' + params.paginationActiveClass;
            }
            else {
                pagers[ _this.activeIndex ].className += ' ' + params.paginationActiveClass;
            }
            
        }
        else {
            if (params.loop) {
                pagers[ _this.activeLoopIndex ].className+=' '+params.paginationActiveClass+' '+params.paginationVisibleClass;
            }
            else {
                pagers[ _this.activeIndex ].className+=' '+params.paginationActiveClass+' '+params.paginationVisibleClass;
            }

        }

    }
    _this.calcVisibleSlides = function(position){
        var visibleSlides = [];
        var _slideLeft = 0, _slideSize = 0, _slideRight = 0;
        if (isH && _this.wrapperLeft>0) position = position+_this.wrapperLeft;
        if (!isH && _this.wrapperTop>0) position = position+_this.wrapperTop;

        for (var i=0; i<_this.slides.length; i++) {
            _slideLeft += _slideSize;
            if (params.slidesPerView == 'auto')
                _slideSize  = isH ? _this.h.getWidth(_this.slides[i],true) : _this.h.getHeight(_this.slides[i],true);
            else _slideSize = slideSize;

            _slideRight = _slideLeft + _slideSize;
            var isVisibile = false;
            if (params.visibilityFullFit) {
                if (_slideLeft >= -position && _slideRight <= -position+containerSize) isVisibile = true;
                if (_slideLeft <= -position && _slideRight >= -position+containerSize) isVisibile = true;
            }
            else {

                if (_slideRight > -position && _slideRight <= ((-position+containerSize))) isVisibile = true;
                if (_slideLeft >= -position && _slideLeft < ((-position+containerSize))) isVisibile = true;
                if (_slideLeft < -position && _slideRight > ((-position+containerSize))) isVisibile = true;
            }

            if (isVisibile) visibleSlides.push(_this.slides[i])

        }
        if (visibleSlides.length==0) visibleSlides = [ _this.slides[ _this.activeIndex ] ]

        _this.visibleSlides = visibleSlides;
    }

    /*==========================================
        Autoplay
    ============================================*/
    _this.autoPlayIntervalId = undefined;
    _this.startAutoplay = function () {
        if (typeof _this.autoPlayIntervalId !== 'undefined') return false;
        if (!params.autoplay) return;
        _this.autoPlayIntervalId = setInterval(function(){
            if (params.loop) _this.swipeNext();
            else if (!_this.swipeNext(true)) _this.swipeTo(0);
        }, params.autoplay)
        _this.callPlugins('onAutoplayStart');
    }
    _this.stopAutoplay = function () {
        if (_this.autoPlayIntervalId) clearInterval(_this.autoPlayIntervalId);
        _this.autoPlayIntervalId = undefined;
        _this.callPlugins('onAutoplayStop');
    }
    /*==================================================
        Loop
    ====================================================*/
    _this.loopCreated = false;
    _this.removeLoopedSlides = function(){
        if (_this.loopCreated) {
            for (var i=0; i<_this.slides.length; i++) {
                if (_this.slides[i].getData('looped')===true) _this.wrapper.removeChild(_this.slides[i]);
            }
        }
    }
    
    _this.createLoop = function() {
        if (_this.slides.length==0) return;
        if (params.slidesPerView=='auto') {
            _this.loopedSlides = params.loopedSlides;
        }
        else {
            _this.loopedSlides = params.slidesPerView + params.loopAdditionalSlides;    
        }
        
        if (_this.loopedSlides > _this.slides.length) {
            _this.loopedSlides = _this.slides.length;
        }
        
        var slideFirstHTML = '',
            slideLastHTML = '',
            i;
        var slidesSetFullHTML = '';
        /**
                loopedSlides is too large if loopAdditionalSlides are set.
                Need to divide the slides by maximum number of slides existing.
                
                @author        Tomaz Lovrec <tomaz.lovrec@blanc-noir.at>
        */
        var numSlides = _this.slides.length;
        var fullSlideSets = Math.floor(_this.loopedSlides / numSlides);
        var remainderSlides = _this.loopedSlides % numSlides;
        // assemble full sets of slides
        for (i = 0; i<(fullSlideSets*numSlides);i++) {
                var j = i;
                if (i >= numSlides) {
                        var over = Math.floor(i / numSlides);
                        j = i - (numSlides * over);
                }
                slidesSetFullHTML+=_this.slides[j].outerHTML;
        }
        // assemble remainder slides
        // assemble remainder appended to existing slides
        for(i = 0;i<remainderSlides;i++) {
                slideLastHTML+=_this.slides[i].outerHTML;
        }
        // assemble slides that get preppended to existing slides
        for(i = numSlides - remainderSlides;i<numSlides;i++) {
                slideFirstHTML+=_this.slides[i].outerHTML;
        }
        // assemble all slides
        var slides = slideFirstHTML + slidesSetFullHTML + wrapper.innerHTML + slidesSetFullHTML + slideLastHTML;
        // set the slides
        wrapper.innerHTML = slides;

        _this.loopCreated = true;
        _this.calcSlides();

        //Update Looped Slides with special class
        for (i=0; i<_this.slides.length; i++) {
            if (i<_this.loopedSlides || i>=_this.slides.length-_this.loopedSlides) _this.slides[i].setData('looped', true);
        }
        _this.callPlugins('onCreateLoop');

    }
    
    _this.fixLoop = function() {
        var newIndex;
        //Fix For Negative Oversliding
        if (_this.activeIndex < _this.loopedSlides) {
            newIndex = _this.slides.length - _this.loopedSlides*3 + _this.activeIndex;
            _this.swipeTo(newIndex, 0, false);
        }
        //Fix For Positive Oversliding
        else if (_this.activeIndex > _this.slides.length - params.slidesPerView*2) {
            newIndex = -_this.slides.length + _this.activeIndex + _this.loopedSlides
            _this.swipeTo(newIndex, 0, false);
        }
    }
    
    /*==================================================
        Slides Loader
    ====================================================*/
    _this.loadSlides = function(){
        var slidesHTML = '';
        _this.activeLoaderIndex = 0;
        var slides = params.loader.slides;
        var slidesToLoad = params.loader.loadAllSlides ? slides.length : params.slidesPerView*(1+params.loader.surroundGroups);
        for (var i=0; i< slidesToLoad; i++) {
            if (params.loader.slidesHTMLType=='outer') slidesHTML+=slides[i];
            else {
                slidesHTML+='<'+params.slideElement+' class="'+params.slideClass+'" data-swiperindex="'+i+'">'+slides[i]+'</'+params.slideElement+'>';
            }
        }
        _this.wrapper.innerHTML = slidesHTML;
        _this.calcSlides(true);
        //Add permanent transitionEnd callback
        if (!params.loader.loadAllSlides) {
            _this.wrapperTransitionEnd(_this.reloadSlides, true);
        }
    }
    
    _this.reloadSlides = function(){
        var slides = params.loader.slides;
        var newActiveIndex = parseInt(_this.activeSlide().data('swiperindex'),10)
        if (newActiveIndex<0 || newActiveIndex>slides.length-1) return //<-- Exit
        _this.activeLoaderIndex = newActiveIndex;
        var firstIndex = Math.max(0, newActiveIndex - params.slidesPerView*params.loader.surroundGroups)
        var lastIndex = Math.min(newActiveIndex+params.slidesPerView*(1+params.loader.surroundGroups)-1, slides.length-1)
        //Update Transforms
        if (newActiveIndex>0) {
            var newTransform = -slideSize*(newActiveIndex-firstIndex)
            _this.setWrapperTranslate(newTransform);
            _this.setWrapperTransition(0);
        }
        //New Slides
        if (params.loader.logic==='reload') {
            _this.wrapper.innerHTML = '';
            var slidesHTML = '';
            for (var i = firstIndex; i<=lastIndex; i++) {
                slidesHTML += params.loader.slidesHTMLType == 'outer' ? slides[i] : '<'+params.slideElement+' class="'+params.slideClass+'" data-swiperindex="'+i+'">'+slides[i]+'</'+params.slideElement+'>';
            }
            _this.wrapper.innerHTML = slidesHTML;
        }
        else {
            var minExistIndex=1000;
            var maxExistIndex=0;
            for (var i=0; i<_this.slides.length; i++) {
                var index = _this.slides[i].data('swiperindex');
                if (index<firstIndex || index>lastIndex) {
                    _this.wrapper.removeChild(_this.slides[i]);
                }
                else {
                    minExistIndex = Math.min(index, minExistIndex)
                    maxExistIndex = Math.max(index, maxExistIndex)
                }
            }
            for (var i=firstIndex; i<=lastIndex; i++) {
                if (i<minExistIndex) {
                    var newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute('data-swiperindex',i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.insertBefore(newSlide, _this.wrapper.firstChild);
                }
                if (i>maxExistIndex) {
                    var newSlide = document.createElement(params.slideElement);
                    newSlide.className = params.slideClass;
                    newSlide.setAttribute('data-swiperindex',i);
                    newSlide.innerHTML = slides[i];
                    _this.wrapper.appendChild(newSlide);
                }
            }
        }
        //reInit
        _this.reInit(true);
    }
    
    /*==================================================
        Make Swiper
    ====================================================*/
    function makeSwiper(){
        _this.calcSlides();
        if (params.loader.slides.length>0 && _this.slides.length==0) {
            _this.loadSlides();
        }
        if (params.loop) {
            _this.createLoop();
        }
        _this.init();
        initEvents();
        if (params.pagination) {
            _this.createPagination(true);
        }

        if (params.loop || params.initialSlide>0) {
            _this.swipeTo( params.initialSlide, 0, false );
        }
        else {
            _this.updateActiveSlide(0);
        }
        if (params.autoplay) {
            _this.startAutoplay();
        }
        /**
         * Set center slide index.
         * 
         * @author        Tomaz Lovrec <tomaz.lovrec@gmail.com> 
         */
        _this.centerIndex = _this.activeIndex;

        // Callbacks
        if (params.onSwiperCreated) params.onSwiperCreated(this);
        _this.callPlugins('onSwiperCreated');
    }
    
    makeSwiper();
}

Swiper.prototype = {
    plugins : {},
    
    /*==================================================
        Wrapper Operations
    ====================================================*/
    wrapperTransitionEnd : function(callback, permanent) {
        var a = this,
            el = a.wrapper,
            events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i;
        
        function fireCallBack() {
            callback(a);
            if (a.params.queueEndCallbacks) a._queueEndCallbacks = false;
            if (!permanent) {
                for (i=0; i<events.length; i++) {
                    a.h.removeEventListener(el, events[i], fireCallBack);
                }
            }
        }
        
        if (callback) {
            for (i=0; i<events.length; i++) {
                a.h.addEventListener(el, events[i], fireCallBack);
            }
        }
    },

    getWrapperTranslate : function (axis) {
        var el = this.wrapper,
            matrix, curTransform, curStyle, transformMatrix;
        
        // automatic axis detection
        if (typeof axis == 'undefined') {
            axis = this.params.mode == 'horizontal' ? 'x' : 'y';
        }
        
        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(',');
        }
        
        if (this.support.transforms && this.params.useCSS3Transforms) {
            if (axis=='x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length==16)
                    curTransform = parseFloat( matrix[12] );
                //Normal Browsers
                else
                    curTransform = parseFloat( matrix[4] );
            }
            if (axis=='y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length==16)
                    curTransform = parseFloat( matrix[13] );
                //Normal Browsers
                else
                    curTransform = parseFloat( matrix[5] );
            }
        }
        else {
            if (axis=='x') curTransform = parseFloat(el.style.left,10) || 0;
            if (axis=='y') curTransform = parseFloat(el.style.top,10) || 0;
        }
        return curTransform || 0;
    },

    setWrapperTranslate : function (x, y, z) {
        var es = this.wrapper.style,
            coords = {x: 0, y: 0, z: 0},
            translate;

        // passed all coordinates
        if (arguments.length == 3) {
            coords.x = x;
            coords.y = y;
            coords.z = z;
        }
        
        // passed one coordinate and optional axis
        else {
            if (typeof y == 'undefined') {
                y = this.params.mode == 'horizontal' ? 'x' : 'y';
            }
            coords[y] = x;
        }

        if (this.support.transforms && this.params.useCSS3Transforms) {
            translate = this.support.transforms3d ? 'translate3d(' + coords.x + 'px, ' + coords.y + 'px, ' + coords.z + 'px)' : 'translate(' + coords.x + 'px, ' + coords.y + 'px)';
            es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = translate;
        }
        else {
            es.left = coords.x + 'px';
            es.top  = coords.y + 'px';
        }
        this.callPlugins('onSetWrapperTransform', coords);
        if (this.params.onSetWrapperTransform) this.params.onSetWrapperTransform(this,coords);
    },

    setWrapperTransition : function (duration) {
        var es = this.wrapper.style;
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = (duration / 1000) + 's';
        this.callPlugins('onSetWrapperTransition', {duration: duration});
        if (this.params.onSetWrapperTransition) this.params.onSetWrapperTransition(this);
        
    },

    /*==================================================
        Helpers
    ====================================================*/
    h : {
        getWidth: function (el, outer) {
            var width = window.getComputedStyle(el, null).getPropertyValue('width')
            var returnWidth = parseFloat(width);
            //IE Fixes
            if(isNaN(returnWidth) || width.indexOf('%')>0) {
                returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            }
            if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'))

            return returnWidth;
        },
        getHeight: function(el, outer) {
            if (outer) return el.offsetHeight;

            var height = window.getComputedStyle(el, null).getPropertyValue('height')
            var returnHeight = parseFloat(height);
            //IE Fixes
            if(isNaN(returnHeight) || height.indexOf('%')>0) {
                returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
            }
            if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'))
            return returnHeight;
        },
        getOffset: function(el) {
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop  = el.clientTop  || body.clientTop  || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop  = window.pageYOffset || el.scrollTop;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            if (document.documentElement && !window.pageYOffset) {
                //IE7-8
                scrollTop  = document.documentElement.scrollTop;
                scrollLeft = document.documentElement.scrollLeft;
            }
            return {
                top: box.top  + scrollTop  - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        },
        windowWidth : function() {
            if (window.innerWidth) return window.innerWidth
            else if (document.documentElement && document.documentElement.clientWidth) return document.documentElement.clientWidth;
        },
        windowHeight : function() {
            if (window.innerHeight) return window.innerHeight
            else if (document.documentElement && document.documentElement.clientHeight) return document.documentElement.clientHeight;
        },
        windowScroll : function() {
            var left=0, top=0;
            if (typeof pageYOffset != 'undefined') {
                return {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                }
            }
            else if (document.documentElement) {
                return {
                    left: document.documentElement.scrollLeft,
                    top: document.documentElement.scrollTop
                }
            }
        },

        addEventListener : function (el, event, listener, useCapture) {
            if (typeof useCapture == 'undefined') {
                useCapture = false;
            }
            
            if (el.addEventListener) {
                el.addEventListener(event, listener, useCapture);
            }
            else if (el.attachEvent) {
                el.attachEvent('on' + event, listener);
            }
        },
        
        removeEventListener : function (el, event, listener, useCapture) {
            if (typeof useCapture == 'undefined') {
                useCapture = false;
            }
            
            if (el.removeEventListener) {
                el.removeEventListener(event, listener, useCapture);
            }
            else if (el.detachEvent) {
                el.detachEvent('on' + event, listener);
            }
        }
    },
    setTransform : function (el, transform) {
        var es = el.style
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transform
    },
    setTranslate : function (el, translate) {
        var es = el.style
        var pos = {
            x : translate.x || 0,
            y : translate.y || 0,
            z : translate.z || 0
        };
        var transformString = this.support.transforms3d ? 'translate3d('+(pos.x)+'px,'+(pos.y)+'px,'+(pos.z)+'px)' : 'translate('+(pos.x)+'px,'+(pos.y)+'px)';
        es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = transformString;
        if (!this.support.transforms) {
            es.left = pos.x+'px'
            es.top = pos.y+'px'
        }
    },
    setTransition : function (el, duration) {
        var es = el.style
        es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = duration+'ms';
    },
    /*==================================================
        Feature Detection
    ====================================================*/
    support: {

        touch : (window.Modernizr && Modernizr.touch===true) || (function() {
            return !!(("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),

        transforms3d : (window.Modernizr && Modernizr.csstransforms3d===true) || (function() {
            var div = document.createElement('div').style;
            return ("webkitPerspective" in div || "MozPerspective" in div || "OPerspective" in div || "MsPerspective" in div || "perspective" in div);
        })(),

        transforms : (window.Modernizr && Modernizr.csstransforms===true) || (function(){
            var div = document.createElement('div').style;
            return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
        })(),

        transitions : (window.Modernizr && Modernizr.csstransitions===true) || (function(){
            var div = document.createElement('div').style;
            return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
        })()
    },

    browser : {

        ie8 : (function(){
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent;
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat(RegExp.$1);
            }
            return rv != -1 && rv < 9;
        })(),

        ie10 : window.navigator.msPointerEnabled
    }
}

/*=========================
  jQuery & Zepto Plugins
  ===========================*/
if (window.jQuery||window.Zepto) {
    (function($){
        $.fn.swiper = function(params) {
            var s = new Swiper($(this)[0], params)
            $(this).data('swiper',s);
            return s;
        }
    })(window.jQuery||window.Zepto)
}

// component
if ( typeof( module ) !== 'undefined' )
{
    module.exports = Swiper;
}
;/*
 * SPServices - Work with SharePoint's Web Services using jQuery
 * Version 0.7.2 -> Note to Marc: Also change var VERSION below.
 * @requires jQuery v1.4.2 or greater - jQuery 1.7+ recommended
 *
 * Copyright (c) 2009-2012 Sympraxis Consulting LLC
 * Examples and docs at:
 * http://spservices.codeplex.com
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */
/**
 * @description Work with SharePoint's Web Services using jQuery
 * @type jQuery
 * @name SPServices
 * @category Plugins/SPServices
 * @author Sympraxis Consulting LLC/marc.anderson@sympraxisconsulting.com
 */

(function ($) {

	// Version info
	var VERSION					= "0.7.2";

	// String constants
	//   General
	var SLASH					= "/";
	var TXTColumnNotFound		= "Column not found on page";
	var SCHEMASharePoint		= "http://schemas.microsoft.com/sharepoint";

	//   Web Service names
	var ALERTS					= "Alerts";
	var AUTHENTICATION			= "Authentication";
	var COPY					= "Copy";
	var FORMS					= "Forms";
	var LISTS					= "Lists";
	var MEETINGS				= "Meetings";
	var PEOPLE					= "People";
	var PERMISSIONS				= "Permissions";
	var PUBLISHEDLINKSSERVICE	= "PublishedLinksService";
	var SEARCH					= "Search";
	var SHAREPOINTDIAGNOSTICS	= "SharePointDiagnostics";
	var SITEDATA				= "SiteData";
	var SITES					= "Sites";
	var SOCIALDATASERVICE		= "SocialDataService";
	var SPELLCHECK				= "SpellCheck";
    var TAXONOMYSERVICE			= "TaxonomyClientService";
	var USERGROUP				= "usergroup";
	var USERPROFILESERVICE		= "UserProfileService";
	var VERSIONS				= "Versions";
	var VIEWS					= "Views";
	var WEBPARTPAGES			= "WebPartPages";
	var WEBS					= "Webs";
	var WORKFLOW				= "Workflow";

	// Global variables
	var thisSite = "";		// The current site
	var thisList = "";		// The current list when in a list context
	var i = 0;				// Generic loop counter
	var t = "";				// Temporary string variable

	// Array to store Web Service information
	//	WSops.OpName = [WebService, needs_SOAPAction];
	//		OpName				The name of the Web Service operation -> These names are unique
	//		WebService			The name of the WebService this operation belongs to
	//		needs_SOAPAction	Boolean indicating whether the operatio needs to have the SOAPAction passed in the setRequestHeaderfunction.
	//							true if the operation does a write, else false

	var WSops = [];

	WSops.GetAlerts									= [ALERTS, false];
	WSops.DeleteAlerts								= [ALERTS, true];

	WSops.Mode										= [AUTHENTICATION, false];
	WSops.Login										= [AUTHENTICATION, false];

	WSops.CopyIntoItems								= [COPY, true];
	WSops.CopyIntoItemsLocal						= [COPY, true];
	WSops.GetItem									= [COPY, false];

	WSops.GetForm									= [FORMS, false];
	WSops.GetFormCollection							= [FORMS, false];

	WSops.AddAttachment								= [LISTS, true];
	WSops.AddDiscussionBoardItem					= [LISTS, true];
	WSops.AddList									= [LISTS, true];
	WSops.AddListFromFeature						= [LISTS, true];
	WSops.ApplyContentTypeToList					= [LISTS, true];
	WSops.CheckInFile								= [LISTS, true];
	WSops.CheckOutFile								= [LISTS, true];
	WSops.CreateContentType							= [LISTS, true];
	WSops.DeleteAttachment							= [LISTS, true];
	WSops.DeleteContentType							= [LISTS, true];
	WSops.DeleteContentTypeXmlDocument				= [LISTS, true];
	WSops.DeleteList								= [LISTS, true];
	WSops.GetAttachmentCollection					= [LISTS, false];
	WSops.GetList									= [LISTS, false];
	WSops.GetListAndView							= [LISTS, false];
	WSops.GetListCollection							= [LISTS, false];
	WSops.GetListContentType						= [LISTS, false];
	WSops.GetListContentTypes						= [LISTS, false];
	WSops.GetListItemChanges						= [LISTS, false];
	WSops.GetListItemChangesSinceToken				= [LISTS, false];
	WSops.GetListItems								= [LISTS, false];
	WSops.GetVersionCollection						= [LISTS, false];
	WSops.UndoCheckOut								= [LISTS, true];
	WSops.UpdateContentType							= [LISTS, true];
	WSops.UpdateContentTypesXmlDocument				= [LISTS, true];
	WSops.UpdateContentTypeXmlDocument				= [LISTS, true];
	WSops.UpdateList								= [LISTS, true];
	WSops.UpdateListItems							= [LISTS, true];

	WSops.AddMeeting								= [MEETINGS, true];
	WSops.CreateWorkspace							= [MEETINGS, true];
	WSops.RemoveMeeting								= [MEETINGS, true];
	WSops.SetWorkSpaceTitle							= [MEETINGS, true];

	WSops.ResolvePrincipals							= [PEOPLE, false];
	WSops.SearchPrincipals							= [PEOPLE, false];

	WSops.AddPermission								= [PERMISSIONS, true];
	WSops.AddPermissionCollection					= [PERMISSIONS, true];
	WSops.GetPermissionCollection					= [PERMISSIONS, true];
	WSops.RemovePermission							= [PERMISSIONS, true];
	WSops.RemovePermissionCollection				= [PERMISSIONS, true];
	WSops.UpdatePermission							= [PERMISSIONS, true];

	WSops.GetLinks									= [PUBLISHEDLINKSSERVICE, true];

	WSops.GetPortalSearchInfo						= [SEARCH, false];
	WSops.GetQuerySuggestions						= [SEARCH, false];
	WSops.GetSearchMetadata							= [SEARCH, false];
	WSops.Query										= [SEARCH, false];
	WSops.QueryEx									= [SEARCH, false];
	WSops.Registration								= [SEARCH, false];
	WSops.Status									= [SEARCH, false];

	WSops.SendClientScriptErrorReport				= [SHAREPOINTDIAGNOSTICS,true];

	WSops.GetAttachments							= [SITEDATA, false];
	WSops.EnumerateFolder							= [SITEDATA, false];
	WSops.SiteDataGetList							= [SITEDATA, false];
	WSops.SiteDataGetListCollection					= [SITEDATA, false];
	WSops.SiteDataGetSite							= [SITEDATA, false];
	WSops.SiteDataGetSiteUrl						= [SITEDATA, false];
	WSops.SiteDataGetWeb							= [SITEDATA, false];

	WSops.CreateWeb									= [SITES, true];
	WSops.DeleteWeb									= [SITES, false];
	WSops.GetSite									= [SITES, false];
	WSops.GetSiteTemplates							= [SITES, false];

	WSops.AddComment								= [SOCIALDATASERVICE, true];
	WSops.AddTag									= [SOCIALDATASERVICE, true];
	WSops.AddTagByKeyword							= [SOCIALDATASERVICE, true];
	WSops.CountCommentsOfUser						= [SOCIALDATASERVICE, false];
	WSops.CountCommentsOfUserOnUrl					= [SOCIALDATASERVICE, false];
	WSops.CountCommentsOnUrl						= [SOCIALDATASERVICE, false];
	WSops.CountRatingsOnUrl							= [SOCIALDATASERVICE, false];
	WSops.CountTagsOfUser							= [SOCIALDATASERVICE, false];
	WSops.DeleteComment								= [SOCIALDATASERVICE, true];
	WSops.DeleteRating								= [SOCIALDATASERVICE, true];
	WSops.DeleteTag									= [SOCIALDATASERVICE, true];
	WSops.DeleteTagByKeyword						= [SOCIALDATASERVICE, true];
	WSops.DeleteTags								= [SOCIALDATASERVICE, true];
	WSops.GetAllTagTerms							= [SOCIALDATASERVICE, false];
	WSops.GetAllTagTermsForUrlFolder				= [SOCIALDATASERVICE, false];
	WSops.GetAllTagUrls								= [SOCIALDATASERVICE, false];
	WSops.GetAllTagUrlsByKeyword					= [SOCIALDATASERVICE, false];
	WSops.GetCommentsOfUser							= [SOCIALDATASERVICE, false];
	WSops.GetCommentsOfUserOnUrl					= [SOCIALDATASERVICE, false];
	WSops.GetCommentsOnUrl							= [SOCIALDATASERVICE, false];
	WSops.GetRatingAverageOnUrl						= [SOCIALDATASERVICE, false];
	WSops.GetRatingOfUserOnUrl						= [SOCIALDATASERVICE, false];
	WSops.GetRatingOnUrl							= [SOCIALDATASERVICE, false];
	WSops.GetRatingsOfUser							= [SOCIALDATASERVICE, false];
	WSops.GetRatingsOnUrl							= [SOCIALDATASERVICE, false];
	WSops.GetSocialDataForFullReplication			= [SOCIALDATASERVICE, false];
	WSops.GetTags									= [SOCIALDATASERVICE, true];
	WSops.GetTagsOfUser								= [SOCIALDATASERVICE, true];
	WSops.GetTagTerms								= [SOCIALDATASERVICE, true];
	WSops.GetTagTermsOfUser							= [SOCIALDATASERVICE, true];
	WSops.GetTagTermsOnUrl							= [SOCIALDATASERVICE, true];
	WSops.GetTagUrlsOfUser							= [SOCIALDATASERVICE, true];
	WSops.GetTagUrlsOfUserByKeyword					= [SOCIALDATASERVICE, true];
	WSops.GetTagUrls								= [SOCIALDATASERVICE, true];
	WSops.GetTagUrlsByKeyword						= [SOCIALDATASERVICE, true];
	WSops.SetRating									= [SOCIALDATASERVICE, true];
	WSops.UpdateComment								= [SOCIALDATASERVICE, true];

	WSops.SpellCheck								= [SPELLCHECK, false];

    // Taxonomy Service Calls
    // Updated 2011.01.27 by Thomas McMillan
    WSops.AddTerms									= [TAXONOMYSERVICE, true];
    WSops.GetChildTermsInTerm						= [TAXONOMYSERVICE, false];
    WSops.GetChildTermsInTermSet					= [TAXONOMYSERVICE, false];
    WSops.GetKeywordTermsByGuids					= [TAXONOMYSERVICE, false];
    WSops.GetTermsByLabel							= [TAXONOMYSERVICE, false];
    WSops.GetTermSets								= [TAXONOMYSERVICE, false];

	WSops.AddGroup									= [USERGROUP, true];
	WSops.AddGroupToRole							= [USERGROUP, true];
	WSops.AddRole									= [USERGROUP, true];
	WSops.AddRoleDef								= [USERGROUP, true];
	WSops.AddUserCollectionToGroup					= [USERGROUP, true];
	WSops.AddUserCollectionToRole					= [USERGROUP, true];
	WSops.AddUserToGroup							= [USERGROUP, true];
	WSops.AddUserToRole								= [USERGROUP, true];
	WSops.GetAllUserCollectionFromWeb				= [USERGROUP, false];
	WSops.GetGroupCollection						= [USERGROUP, false];
	WSops.GetGroupCollectionFromRole				= [USERGROUP, false];
	WSops.GetGroupCollectionFromSite				= [USERGROUP, false];
	WSops.GetGroupCollectionFromUser				= [USERGROUP, false];
	WSops.GetGroupCollectionFromWeb					= [USERGROUP, false];
	WSops.GetGroupInfo								= [USERGROUP, false];
	WSops.GetRoleCollection							= [USERGROUP, false];
	WSops.GetRoleCollectionFromGroup				= [USERGROUP, false];
	WSops.GetRoleCollectionFromUser					= [USERGROUP, false];
	WSops.GetRoleCollectionFromWeb					= [USERGROUP, false];
	WSops.GetRoleInfo								= [USERGROUP, false];
	WSops.GetRolesAndPermissionsForCurrentUser		= [USERGROUP, false];
	WSops.GetRolesAndPermissionsForSite				= [USERGROUP, false];
	WSops.GetUserCollection							= [USERGROUP, false];
	WSops.GetUserCollectionFromGroup				= [USERGROUP, false];
	WSops.GetUserCollectionFromRole					= [USERGROUP, false];
	WSops.GetUserCollectionFromSite					= [USERGROUP, false];
	WSops.GetUserCollectionFromWeb					= [USERGROUP, false];
	WSops.GetUserInfo								= [USERGROUP, false];
	WSops.GetUserLoginFromEmail						= [USERGROUP, false];
	WSops.RemoveGroup								= [USERGROUP, true];
	WSops.RemoveGroupFromRole						= [USERGROUP, true];
	WSops.RemoveRole								= [USERGROUP, true];
	WSops.RemoveUserCollectionFromGroup				= [USERGROUP, true];
	WSops.RemoveUserCollectionFromRole				= [USERGROUP, true];
	WSops.RemoveUserCollectionFromSite				= [USERGROUP, true];
	WSops.RemoveUserFromGroup						= [USERGROUP, true];
	WSops.RemoveUserFromRole						= [USERGROUP, true];
	WSops.RemoveUserFromSite						= [USERGROUP, true];
	WSops.RemoveUserFromWeb							= [USERGROUP, true];
	WSops.UpdateGroupInfo							= [USERGROUP, true];
	WSops.UpdateRoleDefInfo							= [USERGROUP, true];
	WSops.UpdateRoleInfo							= [USERGROUP, true];
	WSops.UpdateUserInfo							= [USERGROUP, true];

	WSops.AddColleague								= [USERPROFILESERVICE, true]; 
	WSops.AddLink									= [USERPROFILESERVICE, true];
	WSops.AddMembership								= [USERPROFILESERVICE, true]; 
	WSops.AddPinnedLink								= [USERPROFILESERVICE, true];
	WSops.CreateMemberGroup							= [USERPROFILESERVICE, true]; 
	WSops.CreateUserProfileByAccountName			= [USERPROFILESERVICE, true];
	WSops.GetCommonColleagues						= [USERPROFILESERVICE, false];
	WSops.GetCommonManager							= [USERPROFILESERVICE, false];
	WSops.GetCommonMemberships						= [USERPROFILESERVICE, false];
	WSops.GetInCommon								= [USERPROFILESERVICE, false];
	WSops.GetPropertyChoiceList						= [USERPROFILESERVICE, false];
	WSops.GetUserColleagues							= [USERPROFILESERVICE, false];
	WSops.GetUserLinks								= [USERPROFILESERVICE, false];
	WSops.GetUserMemberships						= [USERPROFILESERVICE, false];
	WSops.GetUserPinnedLinks						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileByGuid						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileByIndex						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileByName						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileCount						= [USERPROFILESERVICE, false];
	WSops.GetUserProfileSchema						= [USERPROFILESERVICE, false];
	WSops.ModifyUserPropertyByAccountName			= [USERPROFILESERVICE, true];
	WSops.RemoveAllColleagues						= [USERPROFILESERVICE, true];
	WSops.RemoveAllLinks							= [USERPROFILESERVICE, true];
	WSops.RemoveAllMemberships						= [USERPROFILESERVICE, true];
	WSops.RemoveAllPinnedLinks						= [USERPROFILESERVICE, true];
	WSops.RemoveColleague							= [USERPROFILESERVICE, true];
	WSops.RemoveLink								= [USERPROFILESERVICE, true];
	WSops.RemoveMembership							= [USERPROFILESERVICE, true];
	WSops.RemovePinnedLink							= [USERPROFILESERVICE, true]; 
	WSops.UpdateColleaguePrivacy					= [USERPROFILESERVICE, true];
	WSops.UpdateLink								= [USERPROFILESERVICE, true];
	WSops.UpdateMembershipPrivacy					= [USERPROFILESERVICE, true];
	WSops.UpdatePinnedLink							= [USERPROFILESERVICE, true];

	WSops.DeleteAllVersions							= [VERSIONS, true];
	WSops.DeleteVersion								= [VERSIONS, true];
	WSops.GetVersions								= [VERSIONS, false];
	WSops.RestoreVersion							= [VERSIONS, true];

	WSops.AddView									= [VIEWS, true];
	WSops.DeleteView								= [VIEWS, true];
	WSops.GetView									= [VIEWS, false];
	WSops.GetViewHtml								= [VIEWS, false];
	WSops.GetViewCollection							= [VIEWS, false];
	WSops.UpdateView								= [VIEWS, true];
	WSops.UpdateViewHtml							= [VIEWS, true];

	WSops.AddWebPart								= [WEBPARTPAGES, true];
	WSops.AddWebPartToZone							= [WEBPARTPAGES, true];
	WSops.GetWebPart2								= [WEBPARTPAGES, false];
	WSops.GetWebPartPage							= [WEBPARTPAGES, false];
	WSops.GetWebPartProperties						= [WEBPARTPAGES, false];
	WSops.GetWebPartProperties2						= [WEBPARTPAGES, false];

	WSops.CreateContentType							= [WEBS, true];
	WSops.GetColumns								= [WEBS, false];
	WSops.GetContentType							= [WEBS, false];
	WSops.GetContentTypes							= [WEBS, false];
	WSops.GetCustomizedPageStatus					= [WEBS, false];
	WSops.GetListTemplates							= [WEBS, false];
	WSops.GetObjectIdFromUrl						= [WEBS, false]; // 2010
	WSops.GetWeb									= [WEBS, false];
	WSops.GetWebCollection							= [WEBS, false];
	WSops.GetAllSubWebCollection					= [WEBS, false];
	WSops.UpdateColumns								= [WEBS, true];
	WSops.UpdateContentType							= [WEBS, true];
	WSops.WebUrlFromPageUrl							= [WEBS, false];

	WSops.AlterToDo									= [WORKFLOW, true];
	WSops.GetTemplatesForItem						= [WORKFLOW, false];
	WSops.GetToDosForItem							= [WORKFLOW, false];
	WSops.GetWorkflowDataForItem					= [WORKFLOW, false];
	WSops.GetWorkflowTaskData						= [WORKFLOW, false];
	WSops.StartWorkflow								= [WORKFLOW, true];

	// Set up SOAP envelope
	var SOAPEnvelope = {};
	SOAPEnvelope.header = "<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body>";
	SOAPEnvelope.footer = "</soap:Body></soap:Envelope>";
	SOAPEnvelope.payload = "";
	var SOAPAction;


	// Main function, which calls SharePoint's Web Services directly.
	$.fn.SPServices = function(options) {

		// If there are no options passed in, use the defaults.  Extend replaces each default with the passed option.
		var opt = $.extend({}, $.fn.SPServices.defaults, options);

		// Put together operation header and SOAPAction for the SOAP call based on which Web Service we're calling
		SOAPEnvelope.opheader = "<" + opt.operation + " ";
		switch(WSops[opt.operation][0]) {
			case ALERTS:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/2002/1/alerts/' >";
				SOAPAction = SCHEMASharePoint + "/soap/2002/1/alerts/";
				break;
			case MEETINGS:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/meetings/' >";
				SOAPAction = SCHEMASharePoint + "/soap/meetings/";
				break;
			case PERMISSIONS:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/directory/' >";
				SOAPAction = SCHEMASharePoint + "/soap/directory/";
				break;
			case PUBLISHEDLINKSSERVICE:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/PublishedLinksService/";
				break;
			case SEARCH:
				SOAPEnvelope.opheader += "xmlns='urn:Microsoft.Search' >";
				SOAPAction = "urn:Microsoft.Search/";
				break;
			case SHAREPOINTDIAGNOSTICS:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/diagnostics/' >";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/diagnostics/";
				break;
			case SOCIALDATASERVICE:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/SocialDataService' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/SocialDataService/";
				break;
			case SPELLCHECK:
				SOAPEnvelope.opheader += "xmlns='http://schemas.microsoft.com/sharepoint/publishing/spelling/'";
				SOAPAction = "http://schemas.microsoft.com/sharepoint/publishing/spelling/SpellCheck";
				break;
            case TAXONOMYSERVICE:
                SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/taxonomy/soap/' >";
                SOAPAction = SCHEMASharePoint + "/taxonomy/soap/";
                break;
			case USERGROUP:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/directory/' >";
				SOAPAction = SCHEMASharePoint + "/soap/directory/";
				break;
			case USERPROFILESERVICE:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/webservices/SharePointPortalServer/UserProfileService' >";
				SOAPAction = "http://microsoft.com/webservices/SharePointPortalServer/UserProfileService/";
				break;
			case WEBPARTPAGES:
				SOAPEnvelope.opheader += "xmlns='http://microsoft.com/sharepoint/webpartpages' >";
				SOAPAction = "http://microsoft.com/sharepoint/webpartpages/";
				break;
			case WORKFLOW:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/workflow/' >";
				SOAPAction = SCHEMASharePoint + "/soap/workflow/";
				break;
			default:
				SOAPEnvelope.opheader += "xmlns='" + SCHEMASharePoint + "/soap/'>";
				SOAPAction = SCHEMASharePoint + "/soap/";
				break;
		}
		
		// Add the operation to the SOAPAction and opfooter
		SOAPAction += opt.operation;
		SOAPEnvelope.opfooter = "</" + opt.operation + ">";

		// Build the URL for the Ajax call based on which operation we're calling
		// If the webURL has been provided, then use it, else use the current site
		var ajaxURL = "_vti_bin/" + WSops[opt.operation][0] + ".asmx";
		if(opt.webURL.charAt(opt.webURL.length - 1) === SLASH) {
			ajaxURL = opt.webURL + ajaxURL;
		} else if(opt.webURL.length > 0) {
			ajaxURL = opt.webURL + SLASH + ajaxURL;
		} else {
			ajaxURL = $().SPServices.SPGetCurrentSite() + SLASH + ajaxURL;
		}

		SOAPEnvelope.payload = "";
		// Each operation requires a different set of values.  This switch statement sets them up in the SOAPEnvelope.payload.
		switch(opt.operation) {
			// ALERT OPERATIONS
			case "GetAlerts":
				break;
			case "DeleteAlerts":
				SOAPEnvelope.payload += "<IDs>";
				for (i=0; i < opt.IDs.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.IDs[i]);
				}
				SOAPEnvelope.payload += "</IDs>";
				break;

			// AUTHENTICATION OPERATIONS
			case "Mode":
				break;
			case "Login":
				addToPayload(opt, ["username", "password"]);
				break;

			// COPY OPERATIONS
			case "CopyIntoItems":
				addToPayload(opt, ["SourceUrl"]);
				SOAPEnvelope.payload += "<DestinationUrls>";
				for (i=0; i < opt.DestinationUrls.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
				}
				SOAPEnvelope.payload += "</DestinationUrls>";
				addToPayload(opt, ["Fields", "Stream", "Results"]);
				break;
			case "CopyIntoItemsLocal":
				addToPayload(opt, ["SourceUrl"]);
				SOAPEnvelope.payload += "<DestinationUrls>";
				for (i=0; i < opt.DestinationUrls.length; i++) {
					SOAPEnvelope.payload += wrapNode("string", opt.DestinationUrls[i]);
				}
				SOAPEnvelope.payload += "</DestinationUrls>";
				break;
			case "GetItem":
				addToPayload(opt, ["Url", "Fields", "Stream"]);
				break;

			// FORM OPERATIONS
			case "GetForm":
				addToPayload(opt, ["listName", "formUrl"]);
				break;
			case "GetFormCollection":
				addToPayload(opt, ["listName"]);
				break;

			// LIST OPERATIONS
			case "AddAttachment":
				addToPayload(opt, ["listName", "listItemID", "fileName", "attachment"]);
				break;
			case "AddDiscussionBoardItem":
				addToPayload(opt, ["listName", "message"]);
				break;
			case "AddList":
				addToPayload(opt, ["listName", "description", "templateID"]);
				break;
			case "AddListFromFeature":
				addToPayload(opt, ["listName", "description", "featureID", "templateID"]);
				break;
			case "ApplyContentTypeToList":
				addToPayload(opt, ["webUrl", "contentTypeId", "listName"]);
				break;
			case "CheckInFile":
				addToPayload(opt, ["pageUrl", "comment", "CheckinType"]);
				break;
			case "CheckOutFile":
				addToPayload(opt, ["pageUrl", "checkoutToLocal", "lastmodified"]);
				break;
			case "CreateContentType":
				addToPayload(opt, ["listName", "displayName", "parentType", "fields", "contentTypeProperties", "addToView"]);
				break;
			case "DeleteAttachment":
				addToPayload(opt, ["listName", "listItemID", "url"]);
				break;
			case "DeleteContentType":
				addToPayload(opt, ["listName", "contentTypeId"]);
				break;
			case "DeleteContentTypeXmlDocument":
				addToPayload(opt, ["listName", "contentTypeId", "documentUri"]);
				break;
			case "DeleteList":
				addToPayload(opt, ["listName"]);
				break;
			case "GetAttachmentCollection":
				addToPayload(opt, ["listName", ["listItemID", "ID"]]);
				break;
			case "GetList":
				addToPayload(opt, ["listName"]);
				break;
			case "GetListAndView":
				addToPayload(opt, ["listName", "viewName"]);
				break;
			case "GetListCollection":
				break;
			case "GetListContentType":
				addToPayload(opt, ["listName", "contentTypeId"]);
				break;
			case "GetListContentTypes":
				addToPayload(opt, ["listName"]);
				break;
			case "GetListItems":
				addToPayload(opt, ["listName", "viewName", ["query", "CAMLQuery"], ["viewFields", "CAMLViewFields"], ["rowLimit", "CAMLRowLimit"], ["queryOptions", "CAMLQueryOptions"]]);
				break;
			case "GetListItemChanges":
				addToPayload(opt, ["listName", "viewFields", "since", "contains"]);
				break;
			case "GetListItemChangesSinceToken":
				addToPayload(opt, ["listName", "viewName", "query", "viewFields", "rowLimit", "queryOptions", "changeToken", "contains"]);
				break;
			case "GetVersionCollection":
				addToPayload(opt, ["strlistID", "strlistItemID", "strFieldName"]);
				break;
			case "UndoCheckOut":
				addToPayload(opt, ["pageUrl"]);
				break;
			case "UpdateContentType":
				addToPayload(opt, ["listName", "contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields", "addToView"]);
				break;
			case "UpdateContentTypesXmlDocument":
				addToPayload(opt, ["listName", "newDocument"]);
				break;
			case "UpdateContentTypeXmlDocument":
				addToPayload(opt, ["listName", "contentTypeId", "newDocument"]);
				break;
			case "UpdateList":
				addToPayload(opt, ["listName", "listProperties", "newFields", "updateFields", "deleteFields", "listVersion"]);
				break;
			case "UpdateListItems":
				addToPayload(opt, ["listName"]);
				if(opt.updates !== undefined && opt.updates.length > 0) {
					addToPayload(opt, ["updates"]);
				} else {
					SOAPEnvelope.payload += "<updates><Batch OnError='Continue'><Method ID='1' Cmd='" + opt.batchCmd + "'>";
					for (i=0; i < opt.valuepairs.length; i++) { 
						SOAPEnvelope.payload += "<Field Name='" + opt.valuepairs[i][0] + "'>" + escapeColumnValue(opt.valuepairs[i][1]) + "</Field>";
					}
					if(opt.batchCmd !== "New") {
						SOAPEnvelope.payload += "<Field Name='ID'>" + opt.ID + "</Field>";
					}
					SOAPEnvelope.payload += "</Method></Batch></updates>";
				}
				break;

			// MEETINGS OPERATIONS
			case "AddMeeting":
				addToPayload(opt, ["organizerEmail", "uid", "sequence", "utcDateStamp", "title", "location", "utcDateStart", "utcDateEnd", "nonGregorian"]);
				break;
			case "CreateWorkspace":
				addToPayload(opt, ["title", "templateName", "lcid", "timeZoneInformation"]);
				break;
			case "RemoveMeeting":
				addToPayload(opt, ["recurrenceId", "uid", "sequence", "utcDateStamp", "cancelMeeting"]);
				break;
			case "SetWorkspaceTitle":
				addToPayload(opt, ["title"]);
				break;

			// PEOPLE OPERATIONS
			case "ResolvePrincipals":
				addToPayload(opt, ["principalKeys", "principalType", "addToUserInfoList"]);
				break;
			case "SearchPrincipals":
				addToPayload(opt, ["searchText", "maxResults", "principalType"]);
				break;

			// PERMISSION OPERATIONS
			case "AddPermission":
				addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
				break;
			case "AddPermissionCollection":
				addToPayload(opt, ["objectName", "objectType", "permissionsInfoXml"]);
				break;
			case "GetPermissionCollection":
				addToPayload(opt, ["objectName", "objectType"]);
				break;
			case "RemovePermission":
				addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType"]);
				break;
			case "RemovePermissionCollection":
				addToPayload(opt, ["objectName", "objectType", "memberIdsXml"]);
				break;
			case "UpdatePermission":
				addToPayload(opt, ["objectName", "objectType", "permissionIdentifier", "permissionType", "permissionMask"]);
				break;

			// PUBLISHEDLINKSSERVICE OPERATIONS
			case "GetLinks":
				break;

			// SEARCH OPERATIONS
			case "GetPortalSearchInfo":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				break;
			case "GetQuerySuggestions":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				SOAPEnvelope.payload += wrapNode("queryXml", escapeHTML(opt.queryXml));
				break;
			case "GetSearchMetadata":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				break;
			case "Query":
				SOAPEnvelope.payload += wrapNode("queryXml", escapeHTML(opt.queryXml));
				break;
			case "QueryEx":
				SOAPEnvelope.opheader = "<" + opt.operation + " xmlns='http://microsoft.com/webservices/OfficeServer/QueryService'>";
				SOAPAction = "http://microsoft.com/webservices/OfficeServer/QueryService/" + opt.operation;
				SOAPEnvelope.payload += wrapNode("queryXml", escapeHTML(opt.queryXml));
				break;
			case "Registration":
				SOAPEnvelope.payload += wrapNode("registrationXml", escapeHTML(opt.registrationXml));
				break;
			case "Status":
				break;

			// SHAREPOINTDIAGNOSTICS OPERATIONS
			case "SendClientScriptErrorReport":
				addToPayload(opt, ["message", "file", "line", "client", "stack", "team", "originalFile"]);
				break;

			// SITEDATA OPERATIONS
			case "EnumerateFolder":
				addToPayload(opt, ["strFolderUrl"]);
				break;
			case "GetAttachments":
				addToPayload(opt, ["strListName", "strItemId"]);
				break;
			case "SiteDataGetList":
				addToPayload(opt, ["strListName"]);
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;
			case "SiteDataGetListCollection":
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;
			case "SiteDataGetSite":
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;
			case "SiteDataGetSiteUrl":
				addToPayload(opt, ["Url"]);
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;
			case "SiteDataGetWeb":
				// Because this operation has a name which duplicates the Lists WS, need to handle
				SOAPEnvelope = siteDataFixSOAPEnvelope(SOAPEnvelope, opt.operation);
				break;

			// SITES OPERATIONS
			case "CreateWeb":
				addToPayload(opt, ["urlType", "titleType", "descriptionType", "templateNameType", "languageType", "languageSpecifiedType",
					"localeType", "localeSpecifiedType", "collationLocaleType", "collationLocaleSpecifiedType", "uniquePermissionsType",
					"uniquePermissionsSpecifiedType", "anonymousType", "anonymousSpecifiedType", "presenceType", "presenceSpecifiedType"]);
				break;
			case "DeleteWeb":
				addToPayload(opt, ["url"]);
				break;
			case "GetSite":
				addToPayload(opt, ["SiteUrl"]);
				break;
			case "GetSiteTemplates":
				addToPayload(opt, ["LCID", "TemplateList"]);
				break;

			// SOCIALDATASERVICE OPERATIONS
			case "AddComment":
				addToPayload(opt, ["url", "comment", "isHighPriority", "title"]);
				break;
			case "AddTag":
				addToPayload(opt, ["url", "termID", "title", "isPrivate"]);
				break;
			case "AddTagByKeyword":
				addToPayload(opt, ["url", "keyword", "title", "isPrivate"]);
				break;
			case "CountCommentsOfUser":
				addToPayload(opt, ["userAccountName"]);
				break;
			case "CountCommentsOfUserOnUrl":
				addToPayload(opt, ["userAccountName", "url"]);
				break;
			case "CountCommentsOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "CountRatingsOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "CountTagsOfUser":
				addToPayload(opt, ["userAccountName"]);
				break;
			case "DeleteComment":
				addToPayload(opt, ["url", "lastModifiedTime"]);
				break;
			case "DeleteRating":
				addToPayload(opt, ["url"]);
				break;
			case "DeleteTag":
				addToPayload(opt, ["url", "termID"]);
				break;
			case "DeleteTagByKeyword":
				addToPayload(opt, ["url", "keyword"]);
				break;
			case "DeleteTags":
				addToPayload(opt, ["url"]);
				break;
			case "GetAllTagTerms":
				addToPayload(opt, ["maximumItemsToReturn"]);
				break;
			case "GetAllTagTermsForUrlFolder":
				addToPayload(opt, ["urlFolder", "maximumItemsToReturn"]);
				break;
			case "GetAllTagUrls":
				addToPayload(opt, ["termID"]);
				break;
			case "GetAllTagUrlsByKeyword":
				addToPayload(opt, ["keyword"]);
				break;
			case "GetCommentsOfUser":
				addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
				break;
			case "GetCommentsOfUserOnUrl":
				addToPayload(opt, ["userAccountName", "url"]);
				break;
			case "GetCommentsOnUrl":
				addToPayload(opt, ["url", "maximumItemsToReturn", "startIndex"]);
				if(opt.excludeItemsTime !== undefined && opt.excludeItemsTime.length > 0) {
					SOAPEnvelope.payload += wrapNode("excludeItemsTime", opt.excludeItemsTime);
				}
				break;
			case "GetRatingAverageOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "GetRatingOfUserOnUrl":
				addToPayload(opt, ["userAccountName", "url"]);
				break;
			case "GetRatingOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "GetRatingsOfUser":
				addToPayload(opt, ["userAccountName"]);
				break;
			case "GetRatingsOnUrl":
				addToPayload(opt, ["url"]);
				break;
			case "GetSocialDataForFullReplication":
				addToPayload(opt, ["userAccountName"]);
				break;
			case "GetTags":
				addToPayload(opt, ["url"]);
				break;
			case "GetTagsOfUser":
				addToPayload(opt, ["userAccountName", "maximumItemsToReturn", "startIndex"]);
				break;
			case "GetTagTerms":
				addToPayload(opt, ["maximumItemsToReturn"]);
				break;
			case "GetTagTermsOfUser":
				addToPayload(opt, ["userAccountName", "maximumItemsToReturn"]);
				break;
			case "GetTagTermsOnUrl":
				addToPayload(opt, ["url", "maximumItemsToReturn"]);
				break;
			case "GetTagUrls":
				addToPayload(opt, ["termID"]);
				break;
			case "GetTagUrlsByKeyword":
				addToPayload(opt, ["keyword"]);
				break;
			case "GetTagUrlsOfUser":
				addToPayload(opt, ["termID", "userAccountName"]);
				break;
			case "GetTagUrlsOfUserByKeyword":
				addToPayload(opt, ["keyword", "userAccountName"]);
				break;
			case "SetRating":
				addToPayload(opt, ["url", "rating", "title", "analysisDataEntry"]);
				break;
			case "UpdateComment":
				addToPayload(opt, ["url", "lastModifiedTime", "comment", "isHighPriority"]);
				break;

			// SPELLCHECK OPERATIONS 
            case "SpellCheck":
				addToPayload(opt, ["chunksToSpell", "declaredLanguage", "useLad"]);
                break;

           // TAXONOMY OPERATIONS 
            case "AddTerms":
				addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "newTerms"]);
                break;
            case "GetChildTermsInTerm":
				addToPayload(opt, ["sspId", "lcid", "termId", "termSetId"]);
                break;
            case "GetChildTermsInTermSet":
				addToPayload(opt, ["sspId", "lcid", "termSetId"]);
                break;
            case "GetKeywordTermsByGuids":
				addToPayload(opt, ["termIds", "lcid"]);
                break;
            case "GetTermsByLabel":
				addToPayload(opt, ["label", "lcid", "matchOption", "resultCollectionSize", "termIds", "addIfNotFound"]);
                break;
            case "GetTermSets":
				addToPayload(opt, ["sharedServiceId", "termSetId", "lcid", "clientTimeStamps", "clientVersions"]);
                break;

			// USERS AND GROUPS OPERATIONS
			case "AddGroup":
				addToPayload(opt, ["groupName", "ownerIdentifier", "ownerType", "defaultUserLoginName", "description"]);
				break;
			case "AddGroupToRole":
				addToPayload(opt, ["groupName", "roleName"]);
				break;
			case "AddRole":
				addToPayload(opt, ["roleName", "description", "permissionMask"]);
				break;
			case "AddRoleDef":
				addToPayload(opt, ["roleName", "description", "permissionMask"]);
				break;
			case "AddUserCollectionToGroup":
				addToPayload(opt, ["groupName", "usersInfoXml"]);
				break;
			case "AddUserCollectionToRole":
				addToPayload(opt, ["roleName", "usersInfoXml"]);
				break;
			case "AddUserToGroup":
				addToPayload(opt, ["groupName", "userName", "userLoginName", "userEmail", "userNotes"]);
				break;
			case "AddUserToRole":
				addToPayload(opt, ["roleName", "userName", "userLoginName", "userEmail", "userNotes"]);
				break;
			case "GetAllUserCollectionFromWeb":
				break;
			case "GetGroupCollection":
				addToPayload(opt, ["groupNamesXml"]);
				break;
			case "GetGroupCollectionFromRole":
				addToPayload(opt, ["roleName"]);
				break;
			case "GetGroupCollectionFromSite":
				break;
			case "GetGroupCollectionFromUser":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "GetGroupCollectionFromWeb":
				break;
			case "GetGroupInfo":
				addToPayload(opt, ["groupName"]);
				break;
			case "GetRoleCollection":
				addToPayload(opt, ["roleNamesXml"]);
				break;
			case "GetRoleCollectionFromGroup":
				addToPayload(opt, ["groupName"]);
				break;
			case "GetRoleCollectionFromUser":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "GetRoleCollectionFromWeb":
				break;
			case "GetRoleInfo":
				addToPayload(opt, ["roleName"]);
				break;
			case "GetRolesAndPermissionsForCurrentUser":
				break;
			case "GetRolesAndPermissionsForSite":
				break;
			case "GetUserCollection":
				addToPayload(opt, ["userLoginNamesXml"]);
				break;
			case "GetUserCollectionFromGroup":
				addToPayload(opt, ["groupName"]);
				break;
			case "GetUserCollectionFromRole":
				addToPayload(opt, ["roleName"]);
				break;
			case "GetUserCollectionFromSite":
				break;
			case "GetUserCollectionFromWeb":
				break;
			case "GetUserInfo":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "GetUserLoginFromEmail":
				addToPayload(opt, ["emailXml"]);
				break;
			case "RemoveGroup":
				addToPayload(opt, ["groupName"]);
				break;
			case "RemoveGroupFromRole":
				addToPayload(opt, ["roleName", "groupName"]);
				break;
			case "RemoveRole":
				addToPayload(opt, ["roleName"]);
				break;
			case "RemoveUserCollectionFromGroup":
				addToPayload(opt, ["groupName", "userLoginNamesXml"]);
				break;
			case "RemoveUserCollectionFromRole":
				addToPayload(opt, ["roleName", "userLoginNamesXml"]);
				break;
			case "RemoveUserCollectionFromSite":
				addToPayload(opt, ["userLoginNamesXml"]);
				break;
			case "RemoveUserFromGroup":
				addToPayload(opt, ["groupName", "userLoginName"]);
				break;
			case "RemoveUserFromRole":
				addToPayload(opt, ["roleName", "userLoginName"]);
				break;
			case "RemoveUserFromSite":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "RemoveUserFromWeb":
				addToPayload(opt, ["userLoginName"]);
				break;
			case "UpdateGroupInfo":
				addToPayload(opt, ["oldGroupName", "groupName", "ownerIdentifier", "ownerType", "description"]);
				break;
			case "UpdateRoleDefInfo":
				addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
				break;
			case "UpdateRoleInfo":
				addToPayload(opt, ["oldRoleName", "roleName", "description", "permissionMask"]);
				break;
			case "UpdateUserInfo":
				addToPayload(opt, ["userLoginName", "userName", "userEmail", "userNotes"]);
				break;

			// USERPROFILESERVICE OPERATIONS
			case "AddColleague":
				addToPayload(opt, ["accountName", "colleagueAccountName", "group", "privacy", "isInWorkGroup"]);
				break;																			
			case "AddLink":
				addToPayload(opt, ["accountName", "name", "url", "group", "privacy"]);
				break;																						
			case "AddMembership":
				addToPayload(opt, ["accountName", "membershipInfo", "group", "privacy"]);
				break;															
			case "AddPinnedLink":
				addToPayload(opt, ["accountName", "name", "url"]);
				break;
			case "CreateMemberGroup":
				addToPayload(opt, ["membershipInfo"]);
				break;
			case "CreateUserProfileByAccountName":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetCommonColleagues":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetCommonManager":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetCommonMemberships":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetInCommon":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetPropertyChoiceList":
				addToPayload(opt, ["propertyName"]);
				break;
			case "GetUserColleagues":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetUserLinks":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetUserMemberships":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetUserPinnedLinks":
				addToPayload(opt, ["accountName"]);
				break;
			case "GetUserProfileByGuid":
				addToPayload(opt, ["guid"]);
				break;
			case "GetUserProfileByIndex":
				addToPayload(opt, ["index"]);
				break;
			case "GetUserProfileByName":
				// Note that this operation is inconsistent with the others, using AccountName rather than accountName
				if(opt.accountName !== undefined && opt.accountName.length > 0) {
					addToPayload(opt, [["AccountName", "accountName"]]);
				} else {
					addToPayload(opt, ["AccountName"]);
				}
				break;
			case "GetUserProfileCount":
				break;
			case "GetUserProfileSchema":
				break;
			case "ModifyUserPropertyByAccountName":
				addToPayload(opt, ["accountName", "newData"]);
				break;
			case "RemoveAllColleagues":
				addToPayload(opt, ["accountName"]);
				break;
			case "RemoveAllLinks":
				addToPayload(opt, ["accountName"]);
				break;
			case "RemoveAllMemberships":
				addToPayload(opt, ["accountName"]);
				break;
			case "RemoveAllPinnedLinks":
				addToPayload(opt, ["accountName"]);
				break;	
			case "RemoveColleague":
				addToPayload(opt, ["accountName", "colleagueAccountName"]);
				break;	
			case "RemoveLink":
				addToPayload(opt, ["accountName", "id"]);
				break;
			case "RemoveMembership":
				addToPayload(opt, ["accountName", "sourceInternal", "sourceReference"]);
				break;
			case "RemovePinnedLink":
				addToPayload(opt, ["accountName", "id"]);
				break;																							
			case "UpdateColleaguePrivacy":
				addToPayload(opt, ["accountName", "colleagueAccountName", "newPrivacy"]);
				break;
			case "UpdateLink":
				addToPayload(opt, ["accountName", "data"]);
				break;			
			case "UpdateMembershipPrivacy":  
				addToPayload(opt, ["accountName", "sourceInternal", "sourceReference", "newPrivacy"]);
				break;
			case "UpdatePinnedLink ":
				addToPayload(opt, ["accountName", "data"]);
				break;

			// VERSIONS OPERATIONS
			case "DeleteAllVersions":
				addToPayload(opt, ["fileName"]);
				break;
			case "DeleteVersion":
				addToPayload(opt, ["fileName", "fileVersion"]);
				break;
			case "GetVersions":
				addToPayload(opt, ["fileName"]);
				break;
			case "RestoreVersion":
				addToPayload(opt, ["fileName", "fileVersion"]);
				break;

			// VIEW OPERATIONS
			case "AddView":
				addToPayload(opt, ["listName", "viewName", "viewFields", "query", "rowLimit", "rowLimit", "type", "makeViewDefault"]);
				break;
			case "DeleteView":
				addToPayload(opt, ["listName", "viewName"]);
				break;
			case "GetView":
				addToPayload(opt, ["listName", "viewName"]);
				break;
			case "GetViewCollection":
				addToPayload(opt, ["listName"]);
				break;
			case "GetViewHtml":
				addToPayload(opt, ["listName", "viewName"]);
				break;
			case "UpdateView":
				addToPayload(opt, ["listName", "viewName", "viewProperties", "query", "viewFields", "aggregations", "formats", "rowLimit"]);
				break;
			case "UpdateViewHtml":
				addToPayload(opt, ["listName", "viewName", "viewProperties", "toolbar", "viewHeader", "viewBody", "viewFooter", "viewEmpty", "rowLimitExceeded",
					"query", "viewFields", "aggregations", "formats", "rowLimit"]);
				break;

			// WEBPARTPAGES OPERATIONS
			case "AddWebPart":
				addToPayload(opt, ["pageUrl", "webPartXml", "storage"]);
				break;
			case "AddWebPartToZone":
				addToPayload(opt, ["pageUrl", "webPartXml", "storage", "zoneId", "zoneIndex"]);
				break;
			case "GetWebPart2":
				addToPayload(opt, ["pageUrl", "storageKey", "storage", "behavior"]);
				break;
			case "GetWebPartPage":
				addToPayload(opt, ["documentName", "behavior"]);
				break;
			case "GetWebPartProperties":
				addToPayload(opt, ["pageUrl", "storage"]);
				break;
			case "GetWebPartProperties2":
				addToPayload(opt, ["pageUrl", "storage", "behavior"]);
				break;

			// WEBS OPERATIONS
			case "Webs.CreateContentType":
				addToPayload(opt, ["displayName", "parentType", "newFields", "contentTypeProperties"]);
				break;
			case "GetColumns":
				addToPayload(opt, ["webUrl"]);
				break;
			case "GetContentType":
				addToPayload(opt, ["contentTypeId"]);
				break;
			case "GetContentTypes":
				break;
			case "GetCustomizedPageStatus":
				addToPayload(opt, ["fileUrl"]);
				break;
			case "GetListTemplates":
				break;
			case "GetObjectIdFromUrl":
				addToPayload(opt, ["objectUrl"]);
				break;
			case "GetWeb":
				addToPayload(opt, [["webUrl", "webURL"]]);
				break;
			case "GetWebCollection":
				break;
			case "GetAllSubWebCollection":
				break;
			case "UpdateColumns":
				addToPayload(opt, ["newFields", "updateFields", "deleteFields"]);
				break;				
			case "Webs.UpdateContentType":
				addToPayload(opt, ["contentTypeId", "contentTypeProperties", "newFields", "updateFields", "deleteFields"]);
				break;				
			case "WebUrlFromPageUrl":
				addToPayload(opt, [["pageUrl", "pageURL"]]);
				break;

			// WORKFLOW OPERATIONS
			case "AlterToDo":
				addToPayload(opt, ["item", "todoId", "todoListId", "taskData"]);
				break;
			case "GetTemplatesForItem":
				addToPayload(opt, ["item"]);
				break;
			case "GetToDosForItem":
				addToPayload(opt, ["item"]);
				break;
			case "GetWorkflowDataForItem":
				addToPayload(opt, ["item"]);
				break;
			case "GetWorkflowTaskData":
				addToPayload(opt, ["item", "listId", "taskId"]);
				break;
			case "StartWorkflow":
				addToPayload(opt, ["item", "templateId", "workflowParameters"]);
				break;

			default:
				break;
		}

		// Glue together the pieces of the SOAP message
		var msg = SOAPEnvelope.header +
			SOAPEnvelope.opheader +
			SOAPEnvelope.payload +
			SOAPEnvelope.opfooter +
			SOAPEnvelope.footer;

		var cachedXML;
		var status = null;

		if(opt.cacheXML) {
			cachedXML = $("body").data(msg);
		}
		
		if(cachedXML === undefined) {
			// Make the Ajax call
			$.ajax({
				url: ajaxURL,											// The relative URL for the AJAX call
				async: opt.async,										// By default, the AJAX calls are asynchronous.  You can specify false to require a synchronous call.
				beforeSend: function (xhr) {							// Before sending the msg, need to send the request header
					// If we need to pass the SOAPAction, do so
					if(WSops[opt.operation][1]) {
						xhr.setRequestHeader("SOAPAction", SOAPAction);
					}
				},
				type: "POST",											// This is a POST
				data: msg,												// Here is the SOAP request we've built above
				dataType: "xml",										// We're getting XML; tell jQuery so that it doesn't need to do a best guess
				contentType: "text/xml;charset='utf-8'",				// and this is its content type
				complete: function(xData, Status) {
					if(opt.cacheXML) {
						$("body").data(msg, xData);				// Cache the results
					}
					cachedXML = xData;
					status = Status;
					opt.completefunc(cachedXML, status);				// When the call is complete, do this
				}
			});

		} else {
			opt.completefunc(cachedXML, status);						// Call the completefunc
		}

	}; // End $.fn.SPServices

	// Defaults added as a function in our library means that the caller can override the defaults
	// for their session by calling this function.  Each operation requires a different set of options;
	// we allow for all in a standardized way.
	$.fn.SPServices.defaults = {

		cacheXML: false,				// If true, we'll cache the XML results with jQuery's .data() function
		operation: "",				// The Web Service operation
		webURL: "",					// URL of the target Web
		makeViewDefault: false,		// true to make the view the default view for the list

		// For operations requiring CAML, these options will override any abstractions
		CAMLViewName: "",			// View name in CAML format.
		CAMLQuery: "",				// Query in CAML format
		CAMLViewFields: "",			// View fields in CAML format
		CAMLRowLimit: 0,			// Row limit as a string representation of an integer
		CAMLQueryOptions: "<QueryOptions></QueryOptions>",		// Query options in CAML format

		// Abstractions for CAML syntax
		batchCmd: "Update",			// Method Cmd for UpdateListItems
		valuepairs: [],				// Fieldname / Fieldvalue pairs for UpdateListItems

		// As of v0.7.1, removed all options which were assigned an empty string ("")
		DestinationUrls: [],		// Array of destination URLs for copy operations
		behavior: "Version3",		// An SPWebServiceBehavior indicating whether the client supports Windows SharePoint Services 2.0 or Windows SharePoint Services 3.0: {Version2 | Version3 }
		storage: "Shared",			// A Storage value indicating how the Web Part is stored: {None | Personal | Shared}
		objectType: "List",			// objectType for operations which require it
		cancelMeeting: true,		// true to delete a meeting;false to remove its association with a Meeting Workspace site
		nonGregorian: false,		// true if the calendar is set to a format other than Gregorian;otherwise, false.
		fClaim: false,				// Specifies if the action is a claim or a release. Specifies true for a claim and false for a release.
		recurrenceId: 0,			// The recurrence ID for the meeting that needs its association removed. This parameter can be set to 0 for single-instance meetings.
		sequence: 0,				// An integer that is used to determine the ordering of updates in case they arrive out of sequence. Updates with a lower-than-current sequence are discarded. If the sequence is equal to the current sequence, the latest update are applied.
		maximumItemsToReturn: 0,	// SocialDataService maximumItemsToReturn
		startIndex: 0,				// SocialDataService startIndex
		isHighPriority: false,		// SocialDataService isHighPriority
		isPrivate: false,			// SocialDataService isPrivate
		rating: 1,					// SocialDataService rating
		maxResults: 10,				// Unless otherwise specified, the maximum number of principals that can be returned from a provider is 10.
		principalType: "User",		// Specifies user scope and other information: [None | User | DistributionList | SecurityGroup | SharePointGroup | All]

		async: true,				// Allow the user to force async
		completefunc: null			// Function to call on completion

	}; // End $.fn.SPServices.defaults

	// Function to determine the current Web's URL.  We need this for successful Ajax calls.
	// The function is also available as a public function.
	$.fn.SPServices.SPGetCurrentSite = function() {

		// Do we already know the current site?
		if(thisSite.length > 0) {
			return thisSite;
		}

		// SharePoint 2010 provides the current context, so if available, let's use it
//		thisSite = (typeof SP !== "undefined") ? SP.ClientContext.get_current().get_url() : undefined;
//		if(thisSite !== undefined) return thisSite = location.protocol + "//" + location.hostname + thisSite;
		
		var msg = SOAPEnvelope.header +
				"<WebUrlFromPageUrl xmlns='" + SCHEMASharePoint + "/soap/' ><pageUrl>" +
				((location.href.indexOf("?") > 0) ? location.href.substr(0, location.href.indexOf("?")) : location.href) +
				"</pageUrl></WebUrlFromPageUrl>" +
				SOAPEnvelope.footer;
		$.ajax({
			async: false, // Need this to be synchronous so we're assured of a valid value
			url: "/_vti_bin/Webs.asmx",
			type: "POST",
			data: msg,
			dataType: "xml",
			contentType: "text/xml;charset=\"utf-8\"",
			complete: function (xData, Status) {
				thisSite = $(xData.responseXML).find("WebUrlFromPageUrlResult").text();
			}
		});
		return thisSite; // Return the URL
	}; // End $.fn.SPServices.SPGetCurrentSite

	// Function to set up cascading dropdowns on a SharePoint form
	// (Newform.aspx, EditForm.aspx, or any other customized form.)
	$.fn.SPServices.SPCascadeDropdowns = function(options) {

		var opt = $.extend({}, {
			relationshipWebURL: "",				// [Optional] The name of the Web (site) which contains the relationships list
			relationshipList: "",				// The name of the list which contains the parent/child relationships
			relationshipListParentColumn: "",	// The internal name of the parent column in the relationship list
			relationshipListChildColumn: "",	// The internal name of the child column in the relationship list
			relationshipListSortColumn: "",		// [Optional] If specified, sort the options in the dropdown by this column,
												// otherwise the options are sorted by relationshipListChildColumn
			parentColumn: "",					// The display name of the parent column in the form
			childColumn: "",					// The display name of the child column in the form
			listName: $().SPServices.SPListNameFromUrl(),		// The list the form is working with. This is useful if the form is not in the list context.
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relationshipList
			promptText: "",						// [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of childColumn. IOrignal value "Choose {0}..."
			noneText: "(None)",					// [Optional] Text to use for the (None) selection. Provided for non-English language support.
			simpleChild: false,					// [Optional] If set to true and childColumn is a complex dropdown, convert it to a simple dropdown
			selectSingleOption: false,			// [Optional] If set to true and there is only a single child option, select it
			matchOnId: false,					// By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages;if false, run silent
		}, options);


		var thisParentSetUp = false;
		var thisFunction = "SPServices.SPCascadeDropdowns";

		// Find the parent column's select (dropdown)
		var parentSelect = new DropdownCtl(opt.parentColumn);
		if(parentSelect.Obj.html() === null && opt.debug) {errBox(thisFunction, "parentColumn: " + opt.parentColumn , TXTColumnNotFound);return;}

		// Find the child column's select (dropdown)
		var childSelect = new DropdownCtl(opt.childColumn);
		if(childSelect.Obj.html() === null && opt.debug) {errBox(thisFunction, "childColumn: " + opt.childColumn, TXTColumnNotFound);return;}

		// If requested and the childColumn is a complex dropdown, convert to a simple dropdown
		if(opt.simpleChild === true && childSelect.Type === "C") {
			$().SPServices.SPComplexToSimpleDropdown({
				columnName: opt.childColumn
			});
			// Set the childSelect to reference the new simple dropdown
			childSelect = new DropdownCtl(opt.childColumn);
		}

		// Get information about the childColumn from the current list
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Fields").each(function() {
					$(this).find("Field[DisplayName='" + opt.childColumn + "']").each(function() {
						// Determine whether childColumn is Required
						childColumnRequired = ($(this).attr("Required") === "TRUE") ? true : false;
						childColumnStatic = $(this).attr("StaticName");
						// Stop looking; we're done
						return false;
					});
				});
			}
		});

		// Save data about each child column on the parent
		var childColumn = {opt: opt, childSelect: childSelect, childColumnStatic: childColumnStatic, childColumnRequired: childColumnRequired};
		var childColumns = parentSelect.Obj.data("SPCascadeDropdownsChildColumns");

		// If this is the first child for this parent, then create the data object to hold the settings
		if(childColumns === undefined) {
			parentSelect.Obj.data("SPCascadeDropdownsChildColumns", [childColumn]);
		// If we already have a data object for this parent, then add the setting for this child to it
		} else {
			childColumns.push(childColumn);
			parentSelect.Obj.data("SPCascadeDropdownsChildColumns", childColumns);
			thisParentSetUp = true;
		}

		// We only need to bind to the event(s) if we haven't already done so
		if(!thisParentSetUp) {
			switch(parentSelect.Type) {
				// Plain old select
				case "S":
					parentSelect.Obj.bind("change", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
					});
					break;
				// Input / Select hybrid
				case "C":
					// Bind to any change on the hidden input element
					$("input[id='"+ parentSelect.Obj.attr("optHid") + "']").bind("propertychange", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
					});
					break;
				// Multi-select hybrid
				case "M":
					// Handle the dblclick on the candidate select
					parentSelect.Obj.bind("dblclick", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
					});
					// Handle the dblclick on the selected values
					parentSelections = parentSelect.Obj.closest("span").find("select[id$='SelectResult']");
					parentSelections.bind("dblclick", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
					});
					// Handle a button click
					parentSelect.Obj.closest("span").find("button").each(function() {
						$(this).bind("click", function() {
						cascadeDropdown(opt.parentColumn, parentSelect);
						});
					});
					break;
				default:
					break;
			}
		}
		// Fire the change to set the initially allowable values
		cascadeDropdown(opt.parentColumn, parentSelect);

	}; // End $.fn.SPServices.SPCascadeDropdowns

	function cascadeDropdown(parentColumn, parentSelect) {
		var choices = "";
		var parentSelectSelected;
		var childSelectSelected = null;
		var master;
		var MultiLookupPickerdata;
		var newMultiLookupPickerdata;
		var numChildOptions;
		var firstChildOptionId;
		var firstChildOptionValue;

		// Filter each child column
		var childColumns = parentSelect.Obj.data("SPCascadeDropdownsChildColumns");
		$(childColumns).each(function() {

			// Break out the data objects for this child column
			var opt = this.opt;
			var childSelect = this.childSelect;
			var childColumnStatic = this.childColumnStatic;
			var childColumnRequired = this.childColumnRequired;

			// Get the parent column selection(s)
			parentSelectSelected = getDropdownSelected(parentSelect, opt.matchOnId);

			// If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
			// the number of Web Service calls when the parentSelect.Type = "C" or "M", as there are multiple propertychanges
			// which don't require any action.  The attribute will be unique per child column in case there are
			// multiple children for a given parent.
			var allParentSelections = parentSelectSelected.join(";#");
			if(parentSelect.Obj.data("SPCascadeDropdown_Selected_" + childColumnStatic) === allParentSelections) {
				return;
			}
			parentSelect.Obj.data("SPCascadeDropdown_Selected_" + childColumnStatic, allParentSelections);

			// Get the current child column selection(s)
			childSelectSelected = getDropdownSelected(childSelect, true);

			// Find the important bits of the multi-select
			if(childSelect.Type === "M") {
				MultiLookupPickerdata = childSelect.Obj.closest("span").find("input[name$='MultiLookupPicker$data']");
				master = window[childSelect.Obj.closest("tr").find("button[id$='AddButton']").attr("id").replace(/AddButton/,'MultiLookupPicker_m')];
				currentSelection = childSelect.Obj.closest("span").find("select[ID$='SelectResult']");
			}

			// When the parent column's selected option changes, get the matching items from the relationship list
			// Get the list items which match the current selection
			var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListChildColumn;
			var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "'/></OrderBy><Where><And>";
			if(opt.CAMLQuery.length > 0) {
				camlQuery += "<And>";
			}

			// Build up the criteria for inclusion
			if(parentSelectSelected.length === 0) {
				// Handle the case where no values are selected in multi-selects
				camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn + "'/><Value Type='Text'></Value></Eq>";
			} else if(parentSelectSelected.length === 1) {
				// Only one value is selected
				camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn +
					(opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
					escapeColumnValue(parentSelectSelected[0]) + "</Value></Eq>";
			} else {
				var compound = (parentSelectSelected.length > 2) ? true : false;
				for(i=0; i < (parentSelectSelected.length - 1); i++) {
					camlQuery += "<Or>";
				}
				for(i=0; i < parentSelectSelected.length; i++) {
					camlQuery += "<Eq><FieldRef Name='" + opt.relationshipListParentColumn +
						(opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
						escapeColumnValue(parentSelectSelected[i]) + "</Value></Eq>";
					if(i>0 && (i < (parentSelectSelected.length - 1)) && compound) {
						camlQuery += "</Or>";
					}
				}
				camlQuery += "</Or>";
			}

			if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery + "</And>";
			}

			// Make sure we don't get any items which don't have the child value
			camlQuery += "<IsNotNull><FieldRef Name='" + opt.relationshipListChildColumn + "' /></IsNotNull>";

			camlQuery += "</And></Where></Query>";
		
			$().SPServices({
				operation: "GetListItems",
				// Force sync so that we have the right values for the child column onchange trigger
				async: false,
				webURL: opt.relationshipWebURL,
				listName: opt.relationshipList,
				// Filter based on the currently selected parent column's value
				CAMLQuery: camlQuery,
				// Only get the parent and child columns
				CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.relationshipListParentColumn + "' /><FieldRef Name='" + opt.relationshipListChildColumn + "' /></ViewFields>",
				// Override the default view rowlimit and get all appropriate rows
				CAMLRowLimit: 0,
				// Even though setting IncludeMandatoryColumns to FALSE doesn't work as the docs describe, it fixes a bug in GetListItems with mandatory multi-selects
				CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns></QueryOptions>",
				completefunc: function(xData, Status) {

					// Handle errors
					$(xData.responseXML).find("errorstring").each(function() {
						var thisFunction = "SPServices.SPCascadeDropdowns";
						var errorText = $(this).text();
						if(opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
							errBox(thisFunction,
								"relationshipListParentColumn: " + opt.relationshipListParentColumn + " or " +
								"relationshipListChildColumn: " + opt.relationshipListChildColumn,
								"Not found in relationshipList " + opt.relationshipList);
						} else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
							errBox(thisFunction,
								"relationshipList: " + opt.relationshipList,
								"List not found");
						}
						return;
					});

					// Add an explanatory prompt
					switch(childSelect.Type) {
						case "S":
							// Remove all of the existing options
							$(childSelect.Obj).find("option").remove();
							// If the column is required or the promptText option is empty, don't add the prompt text
							if(!childColumnRequired && (opt.promptText.length > 0)) {
								childSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.childColumn) + "</option>");
							} else if(!childColumnRequired){
								childSelect.Obj.append("<option value='0'>" + opt.noneText + "</option>");
							}
							break;
						case "C":
							// If the column is required, don't add the "(None)" option
							choices = childColumnRequired ? "" : opt.noneText + "|0";
							childSelect.Obj.attr("value", "");
							break;
						case "M":
							// Remove all of the existing options
							$(childSelect.Obj).find("option").remove();
							newMultiLookupPickerdata = "";
							break;
						default:
							break;
					}
					// Get the count of items returned and save it so that we can select if it's a single option 
					// The item count is stored thus: <rs:data ItemCount="1">
					numChildOptions = parseFloat($(xData.responseXML).SPFilterNode("rs:data").attr("ItemCount"));

					// Add an option for each child item
					$(xData.responseXML).SPFilterNode("z:row").each(function() {

						var thisOptionId, thisOptionValue;

						// If relationshipListChildColumn is a Lookup column, then the ID should be for the Lookup value,
						// else the ID of the relationshipList item
						var thisValue = $(this).attr("ows_" + opt.relationshipListChildColumn);
						
						if(thisValue !== undefined && thisValue.indexOf(";#") > 0) {
							var splitValue = thisValue.split(";#");
							thisOptionId = splitValue[0];
							thisOptionValue = splitValue[1];
						} else {
							thisOptionId = $(this).attr("ows_ID");
							thisOptionValue = thisValue;						
						}

						// If the relationshipListChildColumn is a calculated column, then the value isn't preceded by the ID,
						// but by the datatype.  In this case, thisOptionId should be the ID of the relationshipList item.
						// e.g., float;#12345.67
						if(isNaN(thisOptionId)) {
							thisOptionId = $(this).attr("ows_ID");
						}
					
						// Save the id and value for the first child option in case we need to select it (selectSingleOption option is true)
						firstChildOptionId = thisOptionId;
						firstChildOptionValue = thisOptionValue;
					
						switch(childSelect.Type) {
							case "S":
								var selected = ($(this).attr("ows_ID") === childSelectSelected[0]) ? " selected='selected'" : "";
								childSelect.Obj.append("<option" + selected + " value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
								break;
							case "C":
								if(thisOptionId === childSelectSelected[0]) {
									childSelect.Obj.attr("value", thisOptionValue);
								}
								choices = choices + ((choices.length > 0) ? "|" : "") + thisOptionValue + "|" + thisOptionId;
								break;
							case "M":
								childSelect.Obj.append("<option value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
								newMultiLookupPickerdata += thisOptionId + "|t" + thisOptionValue + "|t |t |t";
								break;
							default:
								break;
						}
					});

					switch(childSelect.Type) {
						case "S":
							childSelect.Obj.trigger("change");
							// If there is only one option and the selectSingleOption option is true, then select it
							if(numChildOptions === 1 && opt.selectSingleOption === true) {
								$(childSelect.Obj).find("option[value!='0']:first").attr("selected", "selected");
							}
							break;
						case "C":
							// Set the allowable choices
							childSelect.Obj.attr("choices", choices);
							// If there is only one option and the selectSingleOption option is true, then select it
							if(numChildOptions === 1 && opt.selectSingleOption === true) {
								// Set the input element value
								$(childSelect.Obj).attr("value", firstChildOptionValue);
								// Set the value of the optHid input element
								$("input[id='" + childSelect.Obj.attr("optHid") + "']").val(firstChildOptionId);
							}
							// If there's no selection, then remove the value in the associated hidden input element (optHid)
							if(childSelect.Obj.val() === "") {
								$("input[id='" + childSelect.Obj.attr("optHid") + "']").val("");
							}
							break;
						case "M":
							// Clear the master
							master.data = "";
							MultiLookupPickerdata.attr("value", newMultiLookupPickerdata);

							// Clear any prior selections that are no longer valid or aren't selected
							$(currentSelection).find("option").each(function() {
								var thisSelected = $(this);
								var thisValue = $(this).html();
								$(this).attr("selected", "selected");
								$(childSelect.Obj).find("option").filter(function() {
									return $(this).text() == thisValue.replace(/&amp;/, "&");	
								}).each(function() {
									if($(this).html() === thisValue) {
										thisSelected.removeAttr("selected");
									}
								});
							});
							GipRemoveSelectedItems(master);

							// Hide any options in the candidate list which are already selected
							$(childSelect.Obj).find("option").each(function() {
								var thisSelected = $(this);
								$(currentSelection).find("option").each(function() {
									if($(this).html() === thisSelected.html()) {
										thisSelected.remove();
									}
								});
							});
							GipAddSelectedItems(master);

							// Set master.data to the newly allowable values
							master.data = GipGetGroupData(newMultiLookupPickerdata);

							// Trigger a dblclick so that the child will be cascaded if it is a multiselect.
							childSelect.Obj.trigger("dblclick");

							break;
						default:
							break;
					}
				}
			});
			// If present, call completefunc when all else is done
			if(opt.completefunc !== null) {
				opt.completefunc();
			}
		}); // $(childColumns).each(function()

	} // End cascadeDropdown


	// function to convert complex dropdowns to simple dropdowns
	$.fn.SPServices.SPComplexToSimpleDropdown = function(options) {

		var opt = $.extend({}, {
			columnName: "",						// The display name of the column in the form
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		// Find the column's select (dropdown)
		var columnSelect = new DropdownCtl(opt.columnName);
		if(columnSelect.Obj.html() === null && opt.debug) {errBox("SPServices.SPComplexToSimpleDropdown", "columnName: " + opt.columnName, TXTColumnNotFound); return;	}

		// If we don't have a complex dropdown, then there is nothing to do
		if(columnSelect.Type !== "C") { return; }
		
		// The available options are stored in the choices attribute of the complex dropdowns's input element...
		var choices = $(columnSelect.Obj).attr("choices").split("|");
		// The optHid attribute contains the id of a hidden input element which stores the selected value for the commit
		var columnOptHid = $(columnSelect.Obj).attr("optHid");
		var columnOptHidInput = $("input[id='" + columnOptHid + "']");
		// We need to know which option is selected already, if any
		var complexSelectSelectedId = $("input[id='" + columnOptHid + "']").val();

		// Build up the simple dropdown, giving it an easy to select id
		var simpleSelectId = genContainerId("SPComplexToSimpleDropdown", opt.columnName);

		var simpleSelect = "<select id='" + simpleSelectId + "' title='" + opt.columnName + "'>";		
		for(i=0; i < choices.length; i=i+2) {
			var simpleSelectSelected = (choices[i+1] === complexSelectSelectedId) ? " selected='selected' " : " ";
			simpleSelect += "<option" + simpleSelectSelected + "value='" + choices[i+1] + "'>" + choices[i] + "</option>";
		}
		simpleSelect += "</select>";
		
		// Append the new simple select to the form
		$(columnSelect.Obj).closest("td").prepend(simpleSelect);

		// Remove the complex dropdown functionality since we don't need it anymore...
		$(columnSelect.Obj).closest("span").find("img").remove();
		// ...and hide the input element
		$(columnSelect.Obj).closest("span").find("input").hide();

		// When the simple select changes...
		$("#" + simpleSelectId).change(function() {
			var thisVal = $(this).val();
			// ...set the optHid input element's value to the valus of the selected option...
			columnOptHidInput.val(thisVal);
			// ...and save the selected value as the hidden input's value only if the value is not equal to "0" (None)
			$(columnSelect.Obj).val($(this).find("option[value='" + (thisVal !== "0" ? thisVal : "") + "']").html());
		});
		// Trigger a change to ensure that the selected value registers in the complex dropdown
		$("#" + simpleSelectId).trigger("change");

		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}

	}; // End $.fn.SPServices.SPConvertToSimpleDropdown


	// Function to display related information when an option is selected on a form.
	$.fn.SPServices.SPDisplayRelatedInfo = function(options) {

		var opt = $.extend({}, {
			columnName: "",						// The display name of the column in the form
			relatedWebURL: "",					// [Optional] The name of the Web (site) which contains the related list
			relatedList: "",					// The name of the list which contains the additional information
			relatedListColumn: "",				// The internal name of the related column in the related list
			relatedColumns: [],					// An array of related columns to display
			displayFormat: "table",				// The format to use in displaying the related information.  Possible values are: [table, list]
			headerCSSClass: "ms-vh2",			// CSS class for the table headers
			rowCSSClass: "ms-vb",				// CSS class for the table rows
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be <And>ed with the default query on the relatedList
			numChars: 0,						// If used on an input column (not a dropdown), no matching will occur until at least this number of characters has been entered
			matchType: "Eq",					// If used on an input column (not a dropdown), type of match. Can be any valid CAML comparison operator, most often "Eq" or "BeginsWith"
			matchOnId: false,					// By default, we match on the lookup's text value. If matchOnId is true, we'll match on the lookup id instead.
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var divId;
		var relatedColumnsXML = [];
		var relatedListXML;
		var thisFunction = "SPServices.SPDisplayRelatedInfo";

		// Find the column's select (dropdown)
		var columnSelect = new DropdownCtl(opt.columnName);
		if(columnSelect.Obj.html() === null && opt.debug) {errBox(thisFunction, "columnName: " + opt.columnName, TXTColumnNotFound); return; }

		// Generate a unique id for the container
		divId = genContainerId("SPDisplayRelatedInfo", opt.columnName);

		// Get information about the related list and its columns
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			webURL: opt.relatedWebURL,
			listName: opt.relatedList,
			completefunc: function(xData, Status) {
				// If debug is on, notify about an error
				$(xData.responseXML).find("faultcode").each(function() {
					if(opt.debug) {errBox(thisFunction, "relatedList: " + opt.relatedList, "List not found"); return; }
				});
				// Get info about the related list
				relatedListXML = $(xData.responseXML).find("List");
				// Save the information about each column requested
				for (i=0; i < opt.relatedColumns.length; i++) {
					relatedColumnsXML[i] = $(xData.responseXML).find("Fields > Field[Name='" + opt.relatedColumns[i] + "']");
				}
			}
		});

		switch(columnSelect.Type) {
			// Plain old select
			case "S":
				columnSelect.Obj.bind("change", function() {
					showRelated(opt, divId, relatedListXML, relatedColumnsXML);
				});
				break;
			// Input / Select hybrid
			case "C":
				// Bind to any change on the hidden input element
                $("input[id='" + columnSelect.Obj.attr("optHid") + "']").bind("propertychange", function() {
					showRelated(opt, divId, relatedListXML, relatedColumnsXML);
				});
				break;
			// Multi-select hybrid
			case "M":
				if(opt.debug) {errBox(thisFunction, "columnName: " + opt.columnName, "Multi-select columns not supported by this function"); }
				break;
			default:
				break;
		}
		// Fire the change to set the initially allowable values
		showRelated(opt, divId, relatedListXML, relatedColumnsXML);

	}; // End $.fn.SPServices.SPDisplayRelatedInfo

	function showRelated(opt, divId, relatedListXML, relatedColumnsXML) {

		var columnSelectSelected = null;
		var thisFunction = "SPServices.SPDisplayRelatedInfo";

		// Find the column's select (dropdown)
		var columnSelect = new DropdownCtl(opt.columnName);

		// Get the current column selection(s)
		columnSelectSelected = getDropdownSelected(columnSelect, opt.matchOnId);
		if(columnSelect.Type === "C" && opt.numChars > 0 && columnSelectSelected[0].length < opt.numChars) {
			return;
		}

		// If the selection hasn't changed, then there's nothing to do right now.  This is useful to reduce
		// the number of Web Service calls when the parentSelect.Type = "C", as there are multiple propertychanges
		// which don't require any action.
		if(columnSelect.Obj.attr("showRelatedSelected") === columnSelectSelected[0]) {
			return;
		}
		columnSelect.Obj.attr("showRelatedSelected", columnSelectSelected[0]);

		// Remove the old container...
		$("#" + divId).remove();
		// ...and append a new, empty one
		columnSelect.Obj.parent().append("<div id=" + divId + "></div>");

		// Get the list items which match the current selection
		var camlQuery = "<Query><Where>";
		if(opt.CAMLQuery.length > 0) {
			camlQuery += "<And>";
		}

		camlQuery += "<Eq><FieldRef Name='" + opt.relatedListColumn +
			(opt.matchOnId ? "' LookupId='True'/><Value Type='Integer'>" : "'/><Value Type='Text'>") +
			escapeColumnValue(columnSelectSelected[0]) + "</Value></Eq>";

		if(opt.CAMLQuery.length > 0) {
			camlQuery += opt.CAMLQuery + "</And>";
		}
		camlQuery += "</Where></Query>";

		var viewFields = " ";
		for (i=0; i < opt.relatedColumns.length; i++) {
			viewFields += "<FieldRef Name='" + opt.relatedColumns[i] + "' />";
		}

		$().SPServices({
			operation: "GetListItems",
			async: false,
			webURL: opt.relatedWebURL,
			listName: opt.relatedList,
			// Filter based on the column's currently selected value
			CAMLQuery: camlQuery,
			CAMLViewFields: "<ViewFields>" + viewFields +  "</ViewFields>",
			// Override the default view rowlimit and get all appropriate rows
			CAMLRowLimit: 0,
			completefunc: function(xData, Status) {

				// Handle errors
				$(xData.responseXML).find("errorstring").each(function() {
					var errorText = $(this).text();
					if(opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
						errBox(thisFunction,
							"relatedListColumn: " + opt.relatedListColumn,
							"Column not found in relatedList " + opt.relatedList);
					} else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
						errBox(thisFunction,
							"relatedList: " + opt.relatedList,
							"List not found");
					}
					return;
				});

				var outString;
				// Output each row
				switch(opt.displayFormat) {
					// Only implementing the table format in the first iteration (v0.2.9)
					case "table":
						outString = "<table>";
						outString += "<tr>";
						for (i=0; i < opt.relatedColumns.length; i++) {
							if(typeof relatedColumnsXML[i] === 'undefined' && opt.debug) {errBox(thisFunction, "columnName: " + opt.relatedColumns[i], "Column not found in relatedList"); return; }
							outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
						}
						outString += "</tr>";
						// Add an option for each child item
						$(xData.responseXML).SPFilterNode("z:row").each(function() {
							outString += "<tr>";
							for (i=0; i < opt.relatedColumns.length; i++) {
								outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedListXML, relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
							}
							outString += "</tr>";
						});
						outString += "</table>";
						break;
					// list format implemented in v0.5.0. Still table-based, but vertical orientation.
					case "list":
						outString = "<table>";
						$(xData.responseXML).SPFilterNode("z:row").each(function() {
							for (i=0; i < opt.relatedColumns.length; i++) {
								if(typeof relatedColumnsXML[i] === 'undefined' && opt.debug) {errBox(thisFunction, "columnName: " + opt.relatedColumns[i], "Column not found in relatedList"); return; }
								outString += "<tr>";
								outString += "<th class='" + opt.headerCSSClass + "'>" + relatedColumnsXML[i].attr("DisplayName") + "</th>";
								outString += "<td class='" + opt.rowCSSClass + "'>" + showColumn(relatedListXML, relatedColumnsXML[i], $(this).attr("ows_" + opt.relatedColumns[i]), opt) + "</td>";
								outString += "</tr>";
							}
						});
						outString += "</table>";
						break;
					default:
						break;
				}
				// Write out the results
				$("#" + divId).html(outString);
			}
		});
		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}
	} // End showRelated

	// Function to filter a lookup based dropdown 
	$.fn.SPServices.SPFilterDropdown = function(options) {
		var opt = $.extend({}, {
			relationshipWebURL: "",				// [Optional] The name of the Web (site) which contains the relationshipList
			relationshipList: "",				// The name of the list which contains the lookup values
			relationshipListColumn: "",			// The internal name of the column in the relationship list
			relationshipListSortColumn: "",		// [Optional] If specified, sort the options in the dropdown by this column,
												// otherwise the options are sorted by relationshipListColumn
			columnName: "",						// The display name of the column in the form
			listName: $().SPServices.SPListNameFromUrl(),		// The list the form is working with. This is useful if the form is not in the list context.
			promptText: "",						// [DEPRECATED] Text to use as prompt. If included, {0} will be replaced with the value of columnName. IOrignal value "Choose {0}..."
			noneText: "(None)",					// [Optional] Text to use for the (None) selection. Provided for non-English language support.
			CAMLQuery: "",						// This CAML fragment will be applied to the relationshipList
			CAMLQueryOptions: "<QueryOptions><IncludeMandatoryColumns>FALSE</IncludeMandatoryColumns><ViewAttributes Scope='RecursiveAll'/></QueryOptions>", // Need this to mirror SharePoint's behavior, but it can be overridden
			completefunc: null,					// Function to call on completion of rendering the change.
			debug: false						// If true, show error messages; if false, run silent
		}, options);
	
		var choices = "";
		var columnSelectSelected = null;
		var master;
		var MultiLookupPickerdata;
		var newMultiLookupPickerdata;
		var columnColumnRequired;
		var thisFunction = "SPServices.SPFilterDropdown";
	
		// Find the column's select (dropdown)
		var columnSelect = new DropdownCtl(opt.columnName);
		if(columnSelect.Obj.html() === null && opt.debug) {errBox(thisFunction, "columnName: " + opt.columnName, TXTColumnNotFound); return;}
	
		// Get the current column selection(s)
		columnSelectSelected = getDropdownSelected(columnSelect, true);

		// Get the relationshipList items which match the current selection
		var sortColumn = (opt.relationshipListSortColumn.length > 0) ? opt.relationshipListSortColumn : opt.relationshipListColumn;
		var camlQuery = "<Query><OrderBy><FieldRef Name='" + sortColumn + "'/></OrderBy><Where>";
		if(opt.CAMLQuery.length > 0) {
			camlQuery += opt.CAMLQuery;
		}
		camlQuery += "</Where></Query>";
	
		// Get information about columnName from the current list
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Fields").each(function() {
					$(this).find("Field[DisplayName='" + opt.columnName + "']").each(function() {
						// Determine whether columnName is Required
						columnColumnRequired = ($(this).attr("Required") === "TRUE") ? true : false;
						// Stop looking; we're done
						return false;
					});
				});
			}
		});
		
		$().SPServices({
			operation: "GetListItems",
			// Force sync so that we have the right values for the column onchange trigger
			async: false,
			webURL: opt.relationshipWebURL,
			listName: opt.relationshipList,
			// Filter based on the specified CAML
			CAMLQuery: camlQuery,
			// Only get the columnName's data (plus columns we can't prevent)
			CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.relationshipListColumn + "' /></ViewFields>",
			// Override the default view rowlimit and get all appropriate rows
			CAMLRowLimit: 0,
			// Even though setting IncludeMandatoryColumns to FALSE doesn't work as the docs describe, it fixes a bug in GetListItems with mandatory multi-selects
			CAMLQueryOptions: opt.CAMLQueryOptions,
			completefunc: function(xData, Status) {

				// Handle errors
				$(xData.responseXML).find("errorstring").each(function() {
					var errorText = $(this).text();
					if(opt.debug && errorText === "One or more field types are not installed properly. Go to the list settings page to delete these fields.") {
						errBox(thisFunction,
							"relationshipListColumn: " + opt.relationshipListColumn,
							"Not found in relationshipList " + opt.relationshipList);
					} else if (opt.debug && errorText === "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).") {
						errBox(thisFunction,
							"relationshipList: " + opt.relationshipList,
							"List not found");
					}
					return;
				});

				// Add an explanatory prompt
				switch(columnSelect.Type) {
					case "S":
						// Remove all of the existing options
						$(columnSelect.Obj).find("option").remove();
						// If the column is required or the promptText option is empty, don't add the prompt text
						if(!columnColumnRequired && (opt.promptText.length > 0)) {
							columnSelect.Obj.append("<option value='0'>" + opt.promptText.replace(/\{0\}/g, opt.columnName) + "</option>");
						} else if(!columnColumnRequired){
							columnSelect.Obj.append("<option value='0'>" + opt.noneText + "</option>");
						}
						break;
					case "C":
						// If the column is required, don't add the "(None)" option
						choices = columnColumnRequired ? "" : opt.noneText + "|0";
						columnSelect.Obj.attr("value", "");
						break;
					case "M":
						// Remove all of the existing options
						$(columnSelect.Obj).find("option").remove();
						newMultiLookupPickerdata = "";
						break;
					default:
						break;
				}

				// Add an option for each item
				$(xData.responseXML).SPFilterNode("z:row").each(function() {
					
					var thisOptionId, thisOptionValue;

					// If relationshipListColumn is a Lookup column, then the ID should be for the Lookup value,
					// else the ID of the relationshipList item
					var thisValue = $(this).attr("ows_" + opt.relationshipListColumn);
					
					if(thisValue !== undefined && thisValue.indexOf(";#") > 0) {
						var splitValue = thisValue.split(";#");
						thisOptionId = splitValue[0];
						thisOptionValue = splitValue[1];
					} else {
						thisOptionId = $(this).attr("ows_ID");
						thisOptionValue = thisValue;						
					}

					// If the relationshipListColumn is a calculated column, then the value isn't preceded by the ID,
					// but by the datatype.  In this case, thisOptionId should be the ID of the relationshipList item.
					// e.g., float;#12345.67
					if(isNaN(thisOptionId)) {
						thisOptionId = $(this).attr("ows_ID");
					}
					
					switch(columnSelect.Type) {
						case "S":
							var selected = ($(this).attr("ows_ID") === columnSelectSelected[0]) ? " selected='selected'" : "";
							columnSelect.Obj.append("<option" + selected + " value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
							break;
						case "C":
							if(thisOptionId === columnSelectSelected[0]) {
								columnSelect.Obj.attr("value", thisOptionValue);
							}
							choices = choices + ((choices.length > 0) ? "|" : "") + thisOptionValue + "|" + thisOptionId;
							break;
						case "M":
							columnSelect.Obj.append("<option value='" + thisOptionId + "'>" + thisOptionValue + "</option>");
							newMultiLookupPickerdata += thisOptionId + "|t" + thisOptionValue + "|t |t |t";
							break;
						default:
							break;
					}
				});
	
				switch(columnSelect.Type) {
					case "S":
						columnSelect.Obj.trigger("change");
						break;
					case "C":
						columnSelect.Obj.attr("choices", choices);
						columnSelect.Obj.trigger("propertychange");
						break;
					case "M":
						// Find the important bits of the multi-select
						MultiLookupPickerdata = columnSelect.Obj.closest("span").find("input[name$='MultiLookupPicker$data']");
						master = window[columnSelect.Obj.closest("tr").find("button[id$='AddButton']").attr("id").replace(/AddButton/,'MultiLookupPicker_m')];
						currentSelection = columnSelect.Obj.closest("span").find("select[ID$='SelectResult']");
						// Clear the master
						master.data = "";

						MultiLookupPickerdata.attr("value", newMultiLookupPickerdata);
						// Clear any prior selections that are no longer valid
						$(currentSelection).find("option").each(function() {
							var thisSelected = $(this);
							$(this).attr("selected", "selected");
							$(columnSelect.Obj).find("option").each(function() {
								if($(this).html() === thisSelected.html()) {
									thisSelected.removeAttr("selected");
								}
							});
						});
						GipRemoveSelectedItems(master);
						// Hide any options in the candidate list which are already selected
						$(columnSelect.Obj).find("option").each(function() {
							var thisSelected = $(this);
							$(currentSelection).find("option").each(function() {
								if($(this).html() === thisSelected.html()) {
									thisSelected.remove();
								}
							});
						});
						GipAddSelectedItems(master);
						// Set master.data to the newly allowable values
						master.data = GipGetGroupData(newMultiLookupPickerdata);

						// Trigger a dblclick so that the child will be cascaded if it is a multiselect.
						columnSelect.Obj.trigger("dblclick");

						break;
					default:
						break;
				}
			}
		});
		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}
	}; // End $.fn.SPServices.SPFilterDropdown


	// Utility function to show the results of a Web Service call formatted well in the browser.
	$.fn.SPServices.SPDebugXMLHttpResult = function(options) {

		var opt = $.extend({}, {
			node: null,							// An XMLHttpResult object from an ajax call
			indent: 0							// Number of indents
		}, options);

		var i;
		var NODE_TEXT = 3;
		var NODE_CDATA_SECTION = 4;

		var outString = "";
		// For each new subnode, begin rendering a new TABLE
		outString += "<table class='ms-vb' style='margin-left:" + opt.indent * 3 + "px;' width='100%'>";
		// DisplayPatterns are a bit unique, so let's handle them differently
		if(opt.node.nodeName === "DisplayPattern") {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.xml + "</textarea></td></tr>";
		// A node which has no children
		} else if (!opt.node.hasChildNodes()) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td>" + ((opt.node.nodeValue !== null) ? checkLink(opt.node.nodeValue) : "&nbsp;") + "</td></tr>";
			if (opt.node.attributes) {
				outString += "<tr><td colspan='99'>" + showAttrs(opt.node, opt) + "</td></tr>";
			}
		// A CDATA_SECTION node
		} else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType === NODE_CDATA_SECTION) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td><textarea readonly='readonly' rows='5' cols='50'>" + opt.node.parentNode.text + "</textarea></td></tr>";
		// A TEXT node
		} else if (opt.node.hasChildNodes() && opt.node.firstChild.nodeType === NODE_TEXT) {
			outString += "<tr><td width='100px' style='font-weight:bold;'>" + opt.node.nodeName +
				"</td><td>" + checkLink(opt.node.firstChild.nodeValue) + "</td></tr>";
		// Handle child nodes
		} else {
			outString += "<tr><td width='100px' style='font-weight:bold;' colspan='99'>" + opt.node.nodeName + "</td></tr>";
			if (opt.node.attributes) {
				outString += "<tr><td colspan='99'>" + showAttrs(opt.node, opt) + "</td></tr>";
			}
			// Since the node has child nodes, recurse
			outString += "<tr><td>";
			for (i = 0;i < opt.node.childNodes.length; i++) {
				outString += $().SPServices.SPDebugXMLHttpResult({
					node: opt.node.childNodes.item(i),
					indent: opt.indent + 1
				});
			}
			outString += "</td></tr>";
		}
		outString += "</table>";
		// Return the HTML which we have built up
		return outString;
	}; // End $.fn.SPServices.SPDebugXMLHttpResult

	// Function which returns the account name for the current user in DOMAIN\username format
	$.fn.SPServices.SPGetCurrentUser = function(options) {

		var opt = $.extend({}, {
			fieldName: "Name",				// Specifies which field to return from the userdisp.aspx page
			fieldNames: {},					// Specifies which fields to return from the userdisp.aspx page - added in v0.7.2 to allow multiple columns
			debug: false					// If true, show error messages; if false, run silent
		}, options);

		// The current user's ID is reliably available in an existing JavaScript variable
		if(opt.fieldName === "ID" && _spUserId != undefined) {
			return _spUserId;
		}

		var thisField = "";
		var theseFields = {};
		var fieldCount = opt.fieldNames.length > 0 ? opt.fieldNames.length : 1;
		var thisUserDisp;

		// Get the UserDisp.aspx page using AJAX
		$.ajax({
			// Need this to be synchronous so we're assured of a valid value
			async: false,
			// Force parameter forces redirection to a page that displays the information as stored in the UserInfo table rather than My Site.
			// Adding the extra Query String parameter with the current date/time forces the server to view this as a new request.
			url: $().SPServices.SPGetCurrentSite() + "/_layouts/userdisp.aspx?Force=True&" + new Date().getTime(),
			complete: function (xData, Status) {
				thisUserDisp = xData;
			}
		});

		for(i=0; i < fieldCount; i++) {

			// The current user's ID is reliably available in an existing JavaScript variable
			if(opt.fieldNames[i] === "ID") {
				thisField = _spUserId;
			} else {
				var thisTextValue;
				if(fieldCount > 1) {
					thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldNames[i] + "\"", "gi");
				} else {
					thisTextValue = RegExp("FieldInternalName=\"" + opt.fieldName + "\"", "gi");
				}
				$(thisUserDisp.responseText).find("table.ms-formtable td[id^='SPField']").each(function() {
					if(thisTextValue.test($(this).html())) {
						// Each fieldtype contains a different data type, as indicated by the id
						switch($(this).attr("id")) {
							case "SPFieldText":
								thisField = $(this).text();
								break;
							case "SPFieldNote":
								thisField = $(this).find("div").html();
								break;
							case "SPFieldURL":
								thisField = $(this).find("img").attr("src");
								break;
							// Just in case
							default:
								thisField = $(this).text();
								break;						
						}
						// Stop looking; we're done
						return false;
					}
				});
			}
			if(opt.fieldNames[i] !== "ID") {
				thisField = (thisField !== undefined) ? thisField.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '') : null;
			}
			if(fieldCount > 1) {
				theseFields[opt.fieldNames[i]] = thisField;
			}
		}

		return (fieldCount > 1) ? theseFields : thisField;

	}; // End $.fn.SPServices.SPGetCurrentUser


	// Function which provides a link on a Lookup column for the user to follow
	// which allows them to add a new value to the Lookup list.
	// Based on http://blog.mastykarz.nl/extending-lookup-fields-add-new-item-option/
	// by Waldek Mastykarz
	$.fn.SPServices.SPLookupAddNew = function(options) {

		var opt = $.extend({}, {
			lookupColumn: "",				// The display name of the Lookup column
			promptText: "Add new {0}",		// Text to use as prompt + column name
			newWindow: false,				// If true, the link will open in a new window *without* passing the Source.
			ContentTypeID: "",				// [Optional] Pass the ContentTypeID if you'd like to specify it
			completefunc: null,				// Function to call on completion of rendering the change.
			debug: false					// If true, show error messages;if false, run silent
		}, options);

		var thisFunction = "SPServices.SPLookupAddNew";

		// Find the lookup column's select (dropdown)
		var lookupSelect = new DropdownCtl(opt.lookupColumn);
		if(lookupSelect.Obj.html() === null && opt.debug) { errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, TXTColumnNotFound);return;}

		var newUrl = "";
		var lookupListUrl = "";
		var lookupColumnStaticName = "";
		// Use GetList for the current list to determine the details for the Lookup column
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			listName: $().SPServices.SPListNameFromUrl(),
			completefunc: function (xData, Status) {
				$(xData.responseXML).find("Field[DisplayName='" + opt.lookupColumn + "']").each(function() {
					lookupColumnStaticName = $(this).attr("StaticName");
					// Use GetList for the Lookup column's list to determine the list's URL
					$().SPServices({
						operation: "GetList",
						async: false,
						cacheXML: true,
						listName: $(this).attr("List"),
						completefunc: function (xData, Status) {
							$(xData.responseXML).find("List").each(function() {
								lookupListUrl = $(this).attr("WebFullUrl");
								// Need to handle when list is in the root site
								lookupListUrl = lookupListUrl !== SLASH ? lookupListUrl + SLASH : lookupListUrl;
							});
						}
					});
					// Get the NewItem form for the Lookup column's list
					newUrl = getListFormUrl($(this).attr("List"), "NewForm");
					// Stop looking;we're done
					return false;
				});
			}
		});

		if(lookupListUrl.length === 0 && opt.debug) {
			errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, "This column does not appear to be a lookup column");
			return;
		}
		if(newUrl.length > 0) {
			// Build the link to the Lookup column's list enclosed in a div with the id="SPLookupAddNew_" + lookupColumnStaticName
			var newHref = lookupListUrl + newUrl;
			// If requested, open the link in a new window and if requested, pass the ContentTypeID
			newHref += opt.newWindow ?
					((opt.ContentTypeID.length > 0) ? "?ContentTypeID=" + opt.ContentTypeID : "") + "' target='_blank'" :
					"?" + ((opt.ContentTypeID.length > 0) ? "ContentTypeID=" + opt.ContentTypeID + "&" : "") + "Source=" + escapeUrl(location.href) + "'";
			newLink = "<div id='SPLookupAddNew_" + lookupColumnStaticName + "'>" + "<a href='" + newHref + ">" + opt.promptText.replace(/\{0\}/g, opt.lookupColumn) + "</a></div>";
			// Append the link to the Lookup columns's formbody table cell
			$(lookupSelect.Obj).parents("td.ms-formbody").append(newLink);
		} else if(opt.debug) {
			errBox(thisFunction, "lookupColumn: " + opt.lookupColumn, "NewForm cannot be found");
			return;
		}
		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}
	}; // End $.fn.SPServices.SPLookupAddNew

	// Function to return the ID of the last item created on a list by a specific user. Useful for maintaining parent/child relationships
	// between list forms
	$.fn.SPServices.SPGetLastItemId = function(options) {

		var opt = $.extend({}, {
			webURL: "",				// URL of the target Web.  If not specified, the current Web is used.
			listName: "",			// The name or GUID of the list
			userAccount: "",		// The account for the user in DOMAIN\username format. If not specified, the current user is used.
			CAMLQuery: ""			// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
		}, options);

		var userId;
		var lastId = 0;
		$().SPServices({
			operation: "GetUserInfo",
			webURL: opt.webURL,
			async: false,
			userLoginName: (opt.userAccount !== "") ? opt.userAccount : $().SPServices.SPGetCurrentUser(),
			completefunc: function (xData, Status) {
				$(xData.responseXML).find("User").each(function() {
					userId = $(this).attr("ID");
				});
			}
		});

		// Get the list items for the user, sorted by Created, descending. If the CAMLQuery option has been specified, And it with
		// the existing Where clause
		var camlQuery = "<Query><Where>";
		if(opt.CAMLQuery.length > 0) {
			camlQuery += "<And>";
		}
		camlQuery += "<Eq><FieldRef Name='Author' LookupId='TRUE'/><Value Type='Integer'>" + userId + "</Value></Eq>";
		if(opt.CAMLQuery.length > 0) {
			camlQuery += opt.CAMLQuery + "</And>";
		}
		camlQuery += "</Where><OrderBy><FieldRef Name='Created_x0020_Date' Ascending='FALSE'/></OrderBy></Query>";

		$().SPServices({
			operation: "GetListItems",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			CAMLQuery: camlQuery,
			CAMLViewFields: "<ViewFields><FieldRef Name='ID'/></ViewFields>",
			CAMLRowLimit: 1,
			CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
			completefunc: function(xData, Status) {
				$(xData.responseXML).SPFilterNode("z:row").each(function() {
					lastId = $(this).attr("ows_ID");
				});
			}
		});
		return lastId;
	}; // End $.fn.SPServices.SPGetLastItemId
	
	// Function which checks to see if the value for a column on the form is unique in the list.
	$.fn.SPServices.SPRequireUnique = function (options) {

		var opt = $.extend({}, {
			columnStaticName: "Title",					// Name of the column
			duplicateAction: 0,							// 0 = warn, 1 = prevent
			ignoreCase: false,							// If set to true, the function ignores case, if false it looks for an exact match
			initMsg: "This value must be unique.",		// Initial message to display after setup
			initMsgCSSClass: "ms-vb",					// CSS class for initial message
			errMsg: "This value is not unique.",		// Error message to display if not unique
			errMsgCSSClass: "ms-formvalidation",		// CSS class for error message
			showDupes: false,							// If true, show links to the duplicate item(s) after the error message
			completefunc: null							// Function to call on completion of rendering the change.
		}, options);

		// Get the current item's ID from the Query String
		var queryStringVals = $().SPServices.SPGetQueryString();
		var thisID = queryStringVals.ID;
		var thisList = $().SPServices.SPListNameFromUrl();

		// Set the messages based on the options provided
		var msg = "<span id='SPRequireUnique" + opt.columnStaticName + "' class='{0}'>{1}</span><br/>";
		var firstMsg = msg.replace(/\{0\}/g, opt.initMsgCSSClass).replace(/\{1\}/g, opt.initMsg);
		
		// We need the DisplayName
		var columnDisplayName = $().SPServices.SPGetDisplayFromStatic({
			listName: thisList,
			columnStaticName: opt.columnStaticName
		});
		var columnObj = $("input[Title='" + columnDisplayName + "']");
		$(columnObj).parent().append(firstMsg);

		$(columnObj).blur(function () {
			var columnValueIDs = [];
			// Get the columnDisplayName's value
			var columnValue = $(this).attr("value");
			if(columnValue.length === 0) { return false; }

			// Call the Lists Web Service (GetListItems) to see if the value already exists
			$().SPServices({
				operation: "GetListItems",
				async: false,
				listName: thisList,
				// Make sure we get all the items, ignoring any filters on the default view.
				CAMLQuery: "<Query><Where><IsNotNull><FieldRef Name='" + opt.columnStaticName + "'/></IsNotNull></Where></Query>",
				// Filter based on columnStaticName's value
				CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='" + opt.columnStaticName + "' /></ViewFields>",
				// Override the default view rowlimit and get all appropriate rows
				CAMLRowLimit: 0,
				completefunc: function(xData, Status) {
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					$(xData.responseXML).SPFilterNode("z:row").each(function() {
						var thisValue = opt.ignoreCase ? $(this).attr("ows_" + opt.columnStaticName).toUpperCase() : $(this).attr("ows_" + opt.columnStaticName);
						// If this value already exists in columnStaticName and it's not the current item, then save the ID in the array
						if((testValue === thisValue) && ($(this).attr("ows_ID") !== thisID)) {
							columnValueIDs.push([$(this).attr("ows_ID"), $(this).attr("ows_" + opt.columnStaticName)]);
						}
					});
				}
			});
			var newMsg = opt.initMsg;
			$("span#SPRequireUnique" + opt.columnStaticName).html(newMsg).attr("class", opt.initMsgCSSClass);

			$("input[value='OK']:disabled, input[value='Save']:disabled").removeAttr("disabled");
			if(columnValueIDs.length > 0) {
				newMsg = opt.errMsg;
				$("span#SPRequireUnique" + opt.columnStaticName).html(newMsg).attr("class", opt.errMsgCSSClass);
				if(opt.duplicateAction === 1) {
					$("input[Title='" + opt.columnDisplayName + "']").focus();
					$("input[value='OK'], input[value='Save']").attr("disabled", "disabled");
				}
				if(opt.showDupes) {
					var out = " " + columnValueIDs.length + " duplicate item" + (columnValueIDs.length > 1 ? "s" : "") + ": ";
					for (i=0;i < columnValueIDs.length; i++) {
						out += "<a href='DispForm.aspx?ID=" + columnValueIDs[i][0] + "&Source=" + location.href + "'>" + columnValueIDs[i][1] + "</a> ";
					}
					$("span#SPRequireUnique" + opt.columnStaticName).append(out);
				}
			}

		});
		// If present, call completefunc when all else is done
		if(opt.completefunc !== null) {
			opt.completefunc();
		}
	}; // End $.fn.SPServices.SPRequireUnique

	// This function returns the DisplayName for a column based on the StaticName.
	$.fn.SPServices.SPGetDisplayFromStatic = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// URL of the target Web.  If not specified, the current Web is used.
			listName: "",					// The name or GUID of the list
			columnStaticName: "",			// StaticName of the column
			columnStaticNames: {}			// StaticName of the columns - added in v0.7.2 to allow multiple columns
		}, options);

		var displayName = "";
		var displayNames = {};
		var nameCount = opt.columnStaticNames.length > 0 ? opt.columnStaticNames.length : 1;

		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			webURL: opt.webURL,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				if(nameCount > 1) {
					for(i=0; i < nameCount; i++) {
						displayNames[opt.columnStaticNames[i]] = $(xData.responseXML).find("Field[StaticName='" + opt.columnStaticNames[i] + "']").attr("DisplayName");
					}
				} else {
					displayName = $(xData.responseXML).find("Field[StaticName='" + opt.columnStaticName + "']").attr("DisplayName");
				}
			}
		});

		return (nameCount > 1) ? displayNames : displayName;

	}; // End $.fn.SPServices.SPGetDisplayFromStatic

	// This function returns the StaticName for a column based on the DisplayName.
	$.fn.SPServices.SPGetStaticFromDisplay = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// URL of the target Web.  If not specified, the current Web is used.
			listName: "",					// The name or GUID of the list
			columnDisplayName: "",			// DisplayName of the column
			columnDisplayNames: {}			// DisplayNames of the columns - added in v0.7.2 to allow multiple columns
		}, options);

		var staticName = "";
		var staticNames = {};
		var nameCount = opt.columnDisplayNames.length > 0 ? opt.columnDisplayNames.length : 1;

		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			webURL: opt.webURL,
			listName: opt.listName,
			completefunc: function(xData, Status) {
				if(nameCount > 1) {
					for(i=0; i < nameCount; i++) {
						staticNames[opt.columnDisplayNames[i]] = $(xData.responseXML).find("Field[DisplayName='" + opt.columnDisplayNames[i] + "']").attr("StaticName");
					}
				} else {
					staticName = $(xData.responseXML).find("Field[DisplayName='" + opt.columnDisplayName + "']").attr("StaticName");
				}
			}
		});

		return (nameCount > 1) ? staticNames : staticName;

	}; // End $.fn.SPServices.SPGetStaticFromDisplay

	// This function allows you to redirect to a another page from a new item form with the new
	// item's ID. This allows chaining of forms from item creation onward.
	$.fn.SPServices.SPRedirectWithID = function (options) {

		var opt = $.extend({}, {
			redirectUrl: "",			// Page for the redirect
			qsParamName: "ID"			// In some cases, you may want to pass the newly created item's ID with a different
										// parameter name than ID. Specify that name here, if needed.
		}, options);

		var thisList = $().SPServices.SPListNameFromUrl();
		var queryStringVals = $().SPServices.SPGetQueryString();
		var lastID = queryStringVals.ID;
		var QSList = queryStringVals.List;
		var QSRootFolder = queryStringVals.RootFolder;
		var QSContentTypeId = queryStringVals.ContentTypeId;
		
		// On first load, change the form actions to redirect back to this page with the current lastID for this user and the
		// original Source.
		if(typeof queryStringVals.ID === 'undefined') {
			lastID = $().SPServices.SPGetLastItemId({
				listName: thisList
			});
			$("form[name='aspnetForm']").each(function() {
				// This page...
				var thisUrl = (location.href.indexOf("?") > 0) ? location.href.substring(0, location.href.indexOf("?")) : location.href;
				// ... plus the Source if it exists
				var thisSource = (typeof queryStringVals.Source === "string") ?
					"Source=" + queryStringVals.Source.replace(/\//g, "%2f").replace(/:/g, "%3a") : "";
				
				var newQS = [];
				if(typeof QSList !== 'undefined') {
					newQS.push("List=" + QSList);
				}
				if(typeof QSRootFolder !== 'undefined') {
					newQS.push("RootFolder=" + QSRootFolder);
				}
				if(typeof QSContentTypeId !== 'undefined') {
					newQS.push("ContentTypeId=" + QSContentTypeId);
				}

				var newAction = thisUrl +
					((newQS.length > 0) ? ("?" + newQS.join("&") + "&") : "?") +
					// Set the Source to point back to this page with the lastID this user has added
					"Source=" + thisUrl +
					"?ID=" + lastID +
					// Pass the original source as RealSource, if present
					((thisSource.length > 0) ? ("%26RealSource=" + queryStringVals.Source) : "") +
					// Pass the override RedirectURL, if present
					((typeof queryStringVals.RedirectURL === "string") ? ("%26RedirectURL=" + queryStringVals.RedirectURL) : "");
				$(this).attr("action", newAction);
			});
		// If this is the load after the item is saved, wait until the new item has been saved (commits are asynchronous),
		// then do the redirect to redirectUrl with the new lastID, passing along the original Source.
		} else {
			while(queryStringVals.ID === lastID) {
				lastID = $().SPServices.SPGetLastItemId({
					listName: thisList
				});
			}
			// If there is a RedirectURL parameter on the Query String, then redirect there instead of the value
			// specified in the options (opt.redirectUrl)
			var thisRedirectUrl = (typeof queryStringVals.RedirectURL === "string") ? queryStringVals.RedirectURL : opt.redirectUrl;
			location.href = thisRedirectUrl + "?" + opt.qsParamName + "=" + lastID +
				((typeof queryStringVals.RealSource === "string") ? ("&Source=" + queryStringVals.RealSource) : "");
		}
	}; // End $.fn.SPServices.SPRedirectWithID

	// The SPSetMultiSelectSizes function sets the sizes of the multi-select boxes for a column on a form automagically
	// based on the values they contain. The function takes into account the fontSize, fontFamily, fontWeight, etc., in its algorithm.
	$.fn.SPServices.SPSetMultiSelectSizes = function (options) {

		var opt = $.extend({}, {
			multiSelectColumn: "",
			minWidth: 0,
			maxWidth: 0,
			debug: false
		}, options);

		var thisFunction = "SPServices.SPSetMultiSelectSizes";

		// Find the multi-select column
		var thisMultiSelect = new DropdownCtl(opt.multiSelectColumn);
		if(thisMultiSelect.Obj.html() === null && opt.debug) { errBox(thisFunction, "multiSelectColumn: " + opt.multiSelectColumn, TXTColumnNotFound);return;}
		if(thisMultiSelect.Type !== "M" && opt.debug) { errBox(thisFunction, "multiSelectColumn: " + opt.multiSelectColumn, "Column is not multi-select.");return;}

		var possibleValues = thisMultiSelect.Obj;
		var selectedValues = possibleValues.closest("span").find("select[ID$='SelectResult']");

		// Create a temporary clone of the select to use to determine the appropriate width settings.
		// We'll append it to the end of the enclosing span.
		var cloneId = genContainerId("SPSetMultiSelectSizes", opt.multiSelectColumn);
		possibleValues.clone().appendTo(possibleValues.closest("span")).css({
			"width": "auto",		// We want the clone to resize its width based on the contents
			"height": 0,			// Just to keep the page clean while we are using the clone
			"visibility": "hidden"	// And let's keep it hidden
		}).attr({
			id: cloneId,			// We don't want the clone to have the same id as its source
			length: 0				// And let's start with no options
		});
		var cloneObj = $("#" + cloneId);

		// Add all the values to the cloned select.  First the left (possible values) select...
		possibleValues.find("option").each(function() {
			cloneObj.append("<option value='" + $(this).html() + "'>" + $(this).html() + "</option>");
		});
		// ...then the right (selected values) select (in case some values have already been selected)
		selectedValues.find("option").each(function() {
			cloneObj.append("<option value='" + $(this).html() + "'>" + $(this).html() + "</option>");
		});

		// We'll add 5px for a little padding on the right.
		var divWidth = $("#" + cloneId).width() + 5;
		var newDivWidth = divWidth;
		if(opt.minWidth > 0 || opt.maxWidth > 0) {
			if(divWidth < opt.minWidth) {
				divWidth = opt.minWidth;
			}
			if(newDivWidth < opt.minWidth) {
				newDivWidth = opt.minWidth;
			}
			if(newDivWidth > opt.maxWidth) {
				newDivWidth = opt.maxWidth;
			}
		}
		var selectWidth = divWidth;

		// Set the new widths
		possibleValues.css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");
		selectedValues.css("width", selectWidth + "px").parent().css("width", newDivWidth + "px");

		// Remove the select's clone, since we're done with it
		$("#" + cloneId).remove();
	}; // End $.fn.SPServices.SPSetMultiSelectSizes

	// Does an audit of a site's list forms to show where script is in use.
	$.fn.SPServices.SPScriptAudit = function (options) {

		var opt = $.extend({}, {
			webURL: "",						// [Optional] The name of the Web (site) to audit
			listName: "",					// [Optional] The name of a specific list to audit. If not present, all lists in the site are audited.
			outputId: "",					// The id of the DOM object for output
			auditForms: true,				// Audit the form pages
			auditViews: true,				// Audit the view pages
			auditPages: true,				// Audit the Pages Document Library
			auditPagesListName: "Pages",	// The Pages Document Library(ies), if desired. Either a single string or an array of strings.
			showHiddenLists: false,			// Show output for hidden lists
			showNoScript: false,			// Show output for lists with no scripts (effectively "verbose")
			showSrc: true					// Show the source location for included scripts
		}, options);

		var formTypes = [["New", "NewForm.aspx", false], ["Display", "DispForm.aspx", false], ["Edit", "EditForm.aspx", false]];
		var listXml;

		// Build the table to contain the results
		$("#" + opt.outputId)
			.append("<table id='SPScriptAudit' width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1>" +
					"<tr>" +
						"<th></th>" +
						"<th>List</th>" +
						"<th>Page Class</th>" +
						"<th>Page Type</th>" +
						"<th>Page</th>" +
						(opt.showSrc ? "<th>Script References</th>" : "") +
					"</tr>" +
				"</table>");
		// Apply the CSS class to the headers
		$("#SPScriptAudit th").attr("class", "ms-vh2-nofilter");
		
		// Don't bother with the lists if the options don't require them
		if(opt.auditForms || opt.auditViews) {
			// First, get all of the lists within the site
			$().SPServices({
				operation: "GetListCollection",
				webURL: opt.webURL,
				async: false, // Need this to be synchronous so we're assured of a valid value
				completefunc: function (xData, Status) {
					$(xData.responseXML).find("List").each(function() {
						listXml = $(this);
							
						// If listName has been specified, then only return results for that list
						if((opt.listName.length === 0) || (listXml.attr("Title") === opt.listName)) {
							// Don't work with hidden lists unless we're asked to
							if((opt.showHiddenLists && listXml.attr("Hidden") === "False") || !opt.showHiddenLists) {
	
								// Audit the list's forms
								if(opt.auditForms) {
									// Get the list's Content Types, therefore the form pages
									$().SPServices({
										operation: "GetListContentTypes",
										webURL: opt.webURL,
										listName: listXml.attr("ID"),
										async: false, // Need this to be synchronous so we're assured of a valid value
										completefunc: function (xData, Status) {
											$(xData.responseXML).find("ContentType").each(function() {
												// Don't deal with folders
												if($(this).attr("ID").substring(0,6) !== "0x0120") {
													var formUrls = $(this).find("FormUrls");
													for(i=0; i < formTypes.length; i++) {
														// Look for a customized form...
														$(formUrls).find(formTypes[i][0]).each(function() {
															SPScriptAuditPage(opt, listXml, "Form", this.nodeName,
																((opt.webURL.length > 0) ? opt.webURL : $().SPServices.SPGetCurrentSite()) + SLASH + $(this).text());
															formTypes[i][2] = true;
														});
														// ...else the uncustomized form
														if(!formTypes[i][2]) {
															var defaultViewUrl = listXml.attr("DefaultViewUrl");
															SPScriptAuditPage(opt, listXml, "Form", formTypes[i][0],
																defaultViewUrl.substring(0, defaultViewUrl.lastIndexOf(SLASH)+1) + formTypes[i][1]);
														}
													}
													// Reset the form types
													for(i=0; i < formTypes.length; i++) {
														formTypes[i][2] = false;
													}
												}
											});
										}
									});
								}
	
								// Audit the list's views
								if(opt.auditViews) {
									// Get the list's Views
									$().SPServices({
										operation: "GetViewCollection",
										webURL: opt.webURL,
										listName: listXml.attr("ID"),
										async: false, // Need this to be synchronous so we're assured of a valid value
										completefunc: function (xData, Status) {
											$(xData.responseXML).find("View").each(function() {
												SPScriptAuditPage(opt, listXml, "View", $(this).attr("DisplayName"), $(this).attr("Url"));
											});
										}
									});
								}

							}
						}
					});
				}
			});
		}

		// Don't bother with auditing pages if the options don't require it
		var numLists = 0;
		var listsArray = [];
		if(typeof opt.auditPagesListName === "string") {
			numLists = 1;
			listsArray.push(opt.auditPagesListName);
		} else {
			numLists = opt.auditPagesListName.length;
			listsArray = opt.auditPagesListName;
		}
		
		if(opt.auditPages) {
			for(i=0; i < numLists; i++) {
				$().SPServices({
					operation: "GetList",
					async: false,
					cacheXML: true,
					webURL: opt.webURL,
					listName: listsArray[i],
					completefunc: function (xData, Status) {
						$(xData.responseXML).find("List").each(function() {
							listXml = $(this);
						});
					}
				});
				// Get all of the items from the Document Library
				$().SPServices({
					operation: "GetListItems",
					async: false,
					webURL: opt.webURL,
					listName: listsArray[i],
					CAMLQuery: "<Query><Where><Neq><FieldRef Name='ContentType'/><Value Type='Text'>Folder</Value></Neq></Where></Query>",
					CAMLViewFields: "<ViewFields><FieldRef Name='Title'/><FieldRef Name='FileRef'/></ViewFields>",
					CAMLRowLimit: 0,
					completefunc: function(xData, Status) {
						$(xData.responseXML).SPFilterNode("z:row").each(function() {
							var thisPageUrl = $(this).attr("ows_FileRef").split(";#")[1];
							var thisPageType = (typeof $(this).attr("ows_Title") !== 'undefined') ? $(this).attr("ows_Title") : "";
							if(thisPageUrl.indexOf(".aspx") > 0) {
								SPScriptAuditPage(opt, listXml, "Page", thisPageType, SLASH + thisPageUrl);
							}
						});
					}
				});
			}
		}
		// Remove progress indicator and make the output pretty by cleaning up the ms-alternating CSS class
		$("#SPScriptAudit tr[class='ms-alternating']:even").removeAttr("class");
	}; // End $.fn.SPServices.SPScriptAudit

	// Displays the usage of scripts in a site
	function SPScriptAuditPage(opt, listXml, pageClass, pageType, pageUrl) {

		var i = 0;
		var jQueryPage = 0;
		var pageScriptSrc = {};
		pageScriptSrc.type = [];
		pageScriptSrc.src = [];
		pageScriptSrc.script = [];
		var scriptRegex = RegExp("<script[\\s\\S]*?/script>", "gi");

		// Fetch the page
		$.ajax({
			type: "GET",
			url: pageUrl,
			dataType: "text",
			async: false,
			success: function(xData) {

				while (scriptMatch = scriptRegex.exec(xData)) {
					var scriptLanguage = getScriptAttribute(scriptMatch, "language");
					var scriptType = getScriptAttribute(scriptMatch, "type");
					var scriptSrc = getScriptAttribute(scriptMatch, "src");
					if(scriptSrc !== null && scriptSrc.length > 0 && !coreScript(scriptSrc)) {
						pageScriptSrc.type.push((scriptLanguage !== null && scriptLanguage.length > 0) ? scriptLanguage : scriptType);
						pageScriptSrc.src.push(scriptSrc);
						jQueryPage++;
					}
				}

				// Only show pages without script if we've been asked to do so.
				if((!opt.showNoScript && (pageScriptSrc.type.length > 0)) || opt.showNoScript)  {
					var pagePath = pageUrl.substring(0, pageUrl.lastIndexOf(SLASH)+1);
					var out = "<tr class=ms-alternating>" +
						"<td class=ms-vb-icon><a href='" + listXml.attr("DefaultViewUrl") + "'><IMG border=0 src='" + listXml.attr("ImageUrl") + "'width=16 height=16></A></TD>" +
						"<td class=ms-vb2><a href='" + listXml.attr("DefaultViewUrl") + "'>" + listXml.attr("Title") + ((listXml.attr("Hidden") === "True") ? '(Hidden)' : '')+ "</td>" +
						"<td class=ms-vb2>" + pageClass + "</td>" +
						"<td class=ms-vb2>" + pageType + "</td>" +
						"<td class=ms-vb2><a href='" + pageUrl + "'>" + fileName(pageUrl) + "</td>";
					if(opt.showSrc) {
						var thisSrcPath; 
						out += "<td valign='top'><table width='100%' style='border-collapse: collapse;' border=0 cellSpacing=0 cellPadding=1>";
						for(i=0; i < pageScriptSrc.type.length; i++) {
							thisSrcPath = (pageScriptSrc.src[i].substr(0,1) !== SLASH) ? pagePath + pageScriptSrc.src[i] : pageScriptSrc.src[i];
							out += "<tr><td class=ms-vb2 width='30%'>" + pageScriptSrc.type[i] + "</td>";
							out += "<td class=ms-vb2 width='70%'><a href='" + thisSrcPath + "'>" + fileName(pageScriptSrc.src[i]) + "</td></tr>";
						}
						out += "</table></td>";
					}
					$("#SPScriptAudit").append(out);
				}
			}
		});
	} // End of function SPScriptAuditPage
	
	function getScriptAttribute(source, attribute) {
		var regex = RegExp(attribute + "=(\"([^\"]*)\")|('([^']*)')", "gi");
		if(matches = regex.exec(source)) {
			return matches[2];
		}
		return null;
	} // End of function getScriptAttribute

	// Check to see if the script reference is part of SharePoint core so that we can ignore it
	function coreScript(src) {
		var i;
		var coreScriptLocations = ["WebResource.axd", "_layouts"];
		for(i=0; i < coreScriptLocations.length; i++) {
			if(src.indexOf(coreScriptLocations[i]) > -1) {
				return true;	
			}
		}
		return false;
	} // End of function coreScript

	// Rearrange radio buttons or checkboxes in a form from vertical to horizontal display to save page real estate
	$.fn.SPServices.SPArrangeChoices = function (options) {

		var opt = $.extend({}, {
			listName: "",					// The list name for the current form
			columnName: "",					// The display name of the column in the form
			perRow: 99,						// Maximum number of choices desired per row.
			randomize: false				// If true, randomize the order of the options
		}, options);

		var columnFillInChoice = false;
		var columnOptions = [];
		var out;
		
		// Get information about columnName from the list to determine if we're allowing fill-in choices
		$().SPServices({
			operation: "GetList",
			async: false,
			cacheXML: true,
			listName: (opt.listName.length > 0) ? opt.listName : $().SPServices.SPListNameFromUrl(),
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("Fields").each(function() {
					$(this).find("Field[DisplayName='" + opt.columnName + "']").each(function() {
						// Determine whether columnName allows a fill-in choice
						columnFillInChoice = ($(this).attr("FillInChoice") === "TRUE") ? true : false;
						// Stop looking;we're done
						return false;
					});
				});
			}
		});

		var thisFormField = findFormField(opt.columnName);
		
		var totalChoices = $(thisFormField).find("tr").length;
		var choiceNumber = 0;
		var fillinPrompt;
		var fillinInput;
		// Collect all of the choices
		$(thisFormField).find("tr").each(function() {
			choiceNumber++;
			// If this is the fill-in prompt, save it...
			if(columnFillInChoice && choiceNumber === (totalChoices - 1)) {
				fillinPrompt = $(this).find("td").html();
			// ...or if it is the fill-in input box, save it...
			} else if(columnFillInChoice && choiceNumber === totalChoices) {
				fillinInput = $(this).find("td").html();
			// ...else push into the columnOptions array.
			} else {
				columnOptions.push($(this).html());
			}
		});
		out = "<TR>";

		// If randomize is true, randomly sort the options
		if(opt.randomize) {
			columnOptions.sort(randOrd);
		}

		// Add all of the options to the out string
		for(i=0; i < columnOptions.length; i++) {
			out += columnOptions[i];
			// If we've already got perRow columnOptions in the row, close off the row
			if((i+1) % opt.perRow === 0) {
				out += "</TR><TR>";
			}
		}
		out += "</TR>";

		// If we are allowing a fill-in choice, add that option in a separate row at the bottom
		if(columnFillInChoice) {
			out += "<TR><TD colspan='99'>" + fillinPrompt + fillinInput + "</TD></TR>";
		}

		// Remove the existing rows...
		$(thisFormField).find("tr").remove();
		// ...and append the out string
		$(thisFormField).find("table").append(out);

	}; // End $.fn.SPServices.SPArrangeChoices

	// Provide suggested values from a list for in input column based on characters typed
	$.fn.SPServices.SPAutocomplete = function (options) {

		var opt = $.extend({}, {
			WebURL: "",							// [Optional] The name of the Web (site) which contains the sourceList
			sourceList: "",						// The name of the list which contains the values
			sourceColumn: "",					// The static name of the column which contains the values
			columnName: "",						// The display name of the column in the form
			CAMLQuery: "",						// [Optional] For power users, this CAML fragment will be Anded with the default query on the relatedList
			CAMLQueryOptions: "<QueryOptions></QueryOptions>",	// [Optional] For power users, allows specifying the CAMLQueryOptions for the GetListItems call
			CAMLRowLimit: 0,					// [Optional] Override the default view rowlimit and get all appropriate rows
			filterType: "BeginsWith",			// Type of filtering: [BeginsWith, Contains]
			numChars: 0,						// Wait until this number of characters has been typed before attempting any actions
			ignoreCase: false,					// If set to true, the function ignores case, if false it looks for an exact match
			highlightClass: "",					// If a class is supplied, highlight the matched characters in the values by applying that class to a wrapping span
			uniqueVals: false,					// If set to true, the function only adds unique values to the list (no duplicates)
			maxHeight: 99999,					// Sets the maximum number of values to display before scrolling occurs
			slideDownSpeed: "fast",				// Speed at which the div should slide down when values match (milliseconds or ["fast" | "slow"])
			processingIndicator: "_layouts/images/REFRESH.GIF",				// If present, show this while processing
			debug: false						// If true, show error messages;if false, run silent
		}, options);

		var matchNum;

		// Find the input control for the column and save some of its attributes
		var columnObj = $("input[Title='" + opt.columnName + "']");
		$("input[Title='" + opt.columnName + "']").css("position", "");
		var columnObjId = columnObj.attr("ID");
		var columnObjColor = columnObj.css("color");
		var columnObjWidth = columnObj.css("width");

		if(columnObj.html() === null && opt.debug) {
			errBox("SPServices.SPAutocomplete",
				"columnName: " + opt.columnName,
				"Column is not an input control or is not found on page");
			return;
		}

		// Remove the <br/> which isn't needed and messes up the formatting
		columnObj.closest("span").find("br").remove();
		columnObj.wrap("<div>");

		// Create a div to contain the matching values and add it to the DOM
		var containerId = genContainerId("SPAutocomplete", opt.columnName);		
		columnObj.after("<div><ul id='" + containerId + "' style='width:" + columnObjWidth + ";display:none;padding:2px;border:1px solid #2A1FAA;background-color:#FFF;position:absolute;z-index:40;margin:0'></div>");

		// Set the width to match the width of the input control
		$("#" + containerId).css("width", columnObjWidth);		

		// Handle keypresses
		$(columnObj).keyup(function () {

			// Get the column's value
			var columnValue = $(this).val();

			// Hide the container while we're working on it
			$("#" + containerId).hide();

			// Have enough characters been typed yet?
			if(columnValue.length < opt.numChars) {
				return false;
			}

			// Show the the processingIndicator as a background image in the input element
			columnObj.css({
				"background-image": "url(" + opt.processingIndicator + ")",
				"background-position": "right",
				"background-repeat": "no-repeat"
			});

			// Array to hold the matched values
			var matchArray = [];
			
			// Build the appropriate CAMLQuery
			var camlQuery = "<Query><OrderBy><FieldRef Name='" + opt.sourceColumn + "'/></OrderBy><Where>";
			if(opt.CAMLQuery.length > 0) {
				camlQuery += "<And>";
			}
			camlQuery += "<" + opt.filterType + "><FieldRef Name='" + opt.sourceColumn + "'/><Value Type='Text'>" + columnValue + "</Value></" + opt.filterType + ">";			
			if(opt.CAMLQuery.length > 0) {
				camlQuery += opt.CAMLQuery + "</And>";
			}
			camlQuery += "</Where></Query>";

			// Call GetListItems to find all of the potential values
			$().SPServices({
				operation: "GetListItems",
				async: false,
				webURL: opt.WebURL,
				listName: opt.sourceList,
				CAMLQuery: camlQuery,
				CAMLQueryOptions: opt.CAMLQueryOptions,
				CAMLViewFields: "<ViewFields><FieldRef Name='" + opt.sourceColumn + "' /></ViewFields>",
				CAMLRowLimit: opt.CAMLRowLimit,
				completefunc: function(xData, Status) {
					// Handle upper/lower case if ignoreCase = true
					var testValue = opt.ignoreCase ? columnValue.toUpperCase() : columnValue;
					// See which values match and add the ones that do to matchArray
					$(xData.responseXML).SPFilterNode("z:row").each(function() {
						var thisValue = $(this).attr("ows_" + opt.sourceColumn);
						var thisValueTest = opt.ignoreCase ? $(this).attr("ows_" + opt.sourceColumn).toUpperCase() : $(this).attr("ows_" + opt.sourceColumn);
						// Make sure we have a match...
						if(opt.filterType === "Contains") {
							var firstMatch = thisValueTest.indexOf(testValue);
							if((firstMatch >= 0) &&
								// ...and that the match is not already in the array if we want uniqueness
								(!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
								matchArray.push($(this).attr("ows_" + opt.sourceColumn));
							}
						} else {
							// Handles normal case, which is BeginsWith and and other unknown values
							if(testValue === thisValueTest.substr(0,testValue.length) &&
									// ...and that the match is not already in the array if we want uniqueness
									(!opt.uniqueVals || ($.inArray(thisValue, matchArray) === -1))) {
								matchArray.push($(this).attr("ows_" + opt.sourceColumn));
							}
						}
					});
				}
			});

			// Build out the set of list elements to contain the available values
			var out = "";
			for (i=0; i < matchArray.length; i++) {
				// If a highlightClass has been supplied, wrap a span around each match
				if(opt.highlightClass.length > 0) {
					// Set up Regex based on whether we want to ignore case
					var thisRegex = RegExp(columnValue, opt.ignoreCase ? "gi" : "g");
					// Look for all occurrences
					var matches = matchArray[i].match(thisRegex);
					var startLoc = 0;
					// Loop for each occurrence, wrapping each in a span with the highlightClass CSS class
					for (matchNum=0; matchNum < matches.length; matchNum++) {
						var thisPos = matchArray[i].indexOf(matches[matchNum], startLoc);
						var endPos = thisPos + matches[matchNum].length;
						var thisSpan = "<span class='" + opt.highlightClass + "'>" + matches[matchNum] + "</span>";
						matchArray[i] = matchArray[i].substr(0, thisPos) + thisSpan + matchArray[i].substr(endPos);
						startLoc = thisPos + thisSpan.length;
					}
				}
				// Add the value to the markup for the container
				out += "<li style='display: block;position: relative;cursor: pointer;'>" + matchArray[i] + "</li>";
			}
			
			// Add all the list elements to the containerId container
			$("#" + containerId).html(out);
			// Set up hehavior for the available values in the list element
			$("#" + containerId + " li").click(function () {
				$("#" + containerId).fadeOut(opt.slideUpSpeed);
				$("#" + columnObjId).val($(this).text());
			}).mouseover(function () {
				var mouseoverCss = {
					"cursor": "hand",
					"color": "#ffffff",
					"background": "#3399ff"
				};
				$(this).css(mouseoverCss);
			}).mouseout(function () {
				var mouseoutCss = {
					"cursor": "inherit",
					"color": columnObjColor,
					"background": "transparent"
				};
				$(this).css(mouseoutCss);
			});

			// If we've got some values to show, then show 'em!
			if(matchArray.length > 0) {
				$("#" + containerId).slideDown(opt.slideDownSpeed);
			}
			// Remove the processing indicator
			columnObj.css("background-image", "");
		});

	}; // End $.fn.SPServices.SPAutocomplete

	// Get the Query String parameters and their values and return in an array
	$.fn.SPServices.SPGetQueryString = function () {

		var i;
		var queryStringVals = {};

		var qs = location.search.substring(1, location.search.length);
		var args = qs.split("&");
		var rxQS = /^([^=]+)=(.*)/i;

		for (i=0; i < args.length; i++) {
			matches = rxQS.exec(args[i]);
			if (rxQS.test(location.href)) {
				if (matches !== null && matches.length > 2) {
					queryStringVals[matches[1]] = unescape(matches[2]).replace(/\+/g,' ');
				}
			}
		}
		return queryStringVals;

	}; // End $.fn.SPServices.SPGetQueryString

	// Get the current list's GUID (ID) from the current URL.  Use of this function only makes sense if we're in a list's context,
	// and we assume that we are calling it from an aspx page which is a form or view for the list.
	$.fn.SPServices.SPListNameFromUrl = function (options) {

		var opt = $.extend({}, {
			listName: ""		// [Optional] Pass in the name or GUID of a list if you are not in its context. e.g., on a Web Part pages in the Pages library
		}, options);

		// Has the name or GUID been passed in?
		if(opt.listName.length > 0) {
			thisList = opt.listName;
			return thisList;
		// Do we already know the current list?
		} else if(thisList.length > 0) {
			return thisList;
		}

		// Parse out the list's root URL from the current location or the passed url
		var thisPage = location.href;
		var thisPageBaseName = thisPage.substring(0, thisPage.indexOf(".aspx"));
		var listPath = decodeURIComponent(thisPageBaseName.substring(0, thisPageBaseName.lastIndexOf(SLASH) + 1)).toUpperCase();

		// Call GetListCollection and loop through the results to find a match with the list's URL to get the list's GUID
		$().SPServices({
			operation: "GetListCollection",
			async: false,
			completefunc: function(xData, Status) {
				$(xData.responseXML).find("List").each(function() {
					var defaultViewUrl = $(this).attr("DefaultViewUrl");
					var listCollList = defaultViewUrl.substring(0, defaultViewUrl.lastIndexOf(SLASH) + 1).toUpperCase();
					if(listPath.indexOf(listCollList) > 0) {
						thisList = $(this).attr("ID");
						return false;
					}
				});
			}
		});

		// Return the GUID (ID)
		return thisList;
	}; // End $.fn.SPServices.SPListNameFromUrl

	// SPUpdateMultipleListItems allows you to update multiple items in a list based upon some common characteristic or metadata criteria.
	$.fn.SPServices.SPUpdateMultipleListItems = function(options) {

		var opt = $.extend({}, {
			webURL: "",			// [Optional] URL of the target Web.  If not specified, the current Web is used.
			listName: "",		// The list to operate on.
			CAMLQuery: "",		// A CAML fragment specifying which items in the list will be selected and updated
			batchCmd: "Update",	// The operation to perform. By default, Update.
			valuepairs: [],		// Valuepairs for the update in the form [[fieldname1, fieldvalue1], [fieldname2, fieldvalue2]...]
			completefunc: null,	// Function to call on completion of rendering the change.
			debug: false		// If true, show error messages;if false, run silent
		}, options);

		var i;
		var itemsToUpdate = [];
		var documentsToUpdate = [];

		// Call GetListItems to find all of the items matching the CAMLQuery
		$().SPServices({
			operation: "GetListItems",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			CAMLQuery: opt.CAMLQuery,
			CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
			completefunc: function(xData, Status) {
				$(xData.responseXML).SPFilterNode("z:row").each(function() {
					itemsToUpdate.push($(this).attr("ows_ID"));
					var fileRef = $(this).attr("ows_FileRef");
					fileRef = "/" + fileRef.substring(fileRef.indexOf(";#")+2);
					documentsToUpdate.push(fileRef);
				});
			}
		});

		var fieldNum;
		var batch = "<Batch OnError='Continue'>";
		for(i=0; i < itemsToUpdate.length; i++) {
			batch += "<Method ID='" + i + "' Cmd='" + opt.batchCmd + "'>";
			for (fieldNum=0; fieldNum < opt.valuepairs.length; fieldNum++) {
				batch += "<Field Name='" + opt.valuepairs[fieldNum][0] + "'>" + escapeColumnValue(opt.valuepairs[fieldNum][1]) + "</Field>";
			}
			batch += "<Field Name='ID'>" + itemsToUpdate[i] + "</Field>";
			if(documentsToUpdate[i].length > 0) {
				batch += "<Field Name='FileRef'>" + documentsToUpdate[i] + "</Field>";
			}
			batch += "</Method>";
		}
		batch += "</Batch>";

		// Call UpdateListItems to update all of the items matching the CAMLQuery
		$().SPServices({
			operation: "UpdateListItems",
			async: false,
			webURL: opt.webURL,
			listName: opt.listName,
			updates: batch,
			completefunc: function(xData, Status) {
				// If present, call completefunc when all else is done
				if(opt.completefunc !== null) {
					opt.completefunc(xData, Status);
				}
			}
		});

	}; // End $.fn.SPServices.SPUpdateMultipleListItems

	// This method for finding specific nodes in the returned XML was developed by Steve Workman. See his blog post
	// http://www.steveworkman.com/html5-2/javascript/2011/improving-javascript-xml-node-finding-performance-by-2000/
	// for performance details.
	$.fn.SPFilterNode = function(name) {
		return this.find('*').filter(function() {
			return this.nodeName === name;
		});
	}; // End $.fn.SPFilterNode


	// This function converts an XML node set to JSON
	// Initial implementation focuses only on GetListItems
	$.fn.SPXmlToJson = function(options) {

		var opt = $.extend({}, {
			mapping: {},			// columnName: mappedName: "mappedName", objectType: "objectType"
			includeAllAttrs: false, // If true, return all attributes, regardless whether they are in the mapping
			removeOws: true			// Specifically for GetListItems, if true, the leading ows_ will be stripped off the field name
		}, options);

		var colNum;
		var jsonObject = [];

		this.each(function() {
			var row = {};
			var colValue;
			var rowAttrs = this.attributes;

			// Bring back all mapped columns, even those with no value
			$.each(opt.mapping, function() { 
				row[this.mappedName] = ""; 
			});

			// Parse through the element's attributes
			for(attrNum = 0; attrNum < rowAttrs.length; attrNum++) {
				var thisAttrName = rowAttrs[attrNum].name;
				var thisMapping = opt.mapping[thisAttrName];
				var thisObjectName = thisMapping !== undefined ? thisMapping.mappedName : opt.removeOws ? thisAttrName.split("ows_")[1] : thisAttrName;
				var thisObjectType = thisMapping !== undefined ? thisMapping.objectType : undefined;
				if(opt.includeAllAttrs || thisMapping !== undefined) {
					row[thisObjectName] = attrToJson(rowAttrs[attrNum].value, thisObjectType);
				}
			}
			// Push this item into the JSON Object			
			jsonObject.push(row);

		});

		// Return the JSON object
		return jsonObject;

	}; // End $.fn.SPServices.SPXmlToJson


	function attrToJson(v, objectType) {

		switch (objectType) {
			case "DateTime":
			case "datetime": 							// For calculated columns, stored as datetime;#value
				// Dates have dashes instead of slashes: ows_Created="2009-08-25 14:24:48"
				colValue = dateToJsonObject(v);
				break;
			case "User":
				colValue = userToJsonObject(v);
				break;
			case "UserMulti":
				colValue = userMultiToJsonObject(v);
				break;
			case "Lookup":
				colValue = lookupToJsonObject(v);
				break;
			case "LookupMulti":
				colValue = lookupMultiToJsonObject(v);
				break;
			case "Boolean":
				colValue = booleanToJsonObject(v);
				break;
			case "Integer":
				colValue = intToJsonObject(v);
				break;
			case "Counter":
				colValue = intToJsonObject(v);
				break;
			case "MultiChoice":
				colValue = choiceMultiToJsonObject(v);
				break;
			case "Currency":
			case "float":							// For calculated columns, stored as float;#value
				colValue = floatToJsonObject(v);
				break;
			case "Calc":
				colValue = calcToJsonObject(v);
				break;
			default:
				// All other objectTypes will be simple strings
				colValue = stringToJsonObject(v);
				break;
		}
		return colValue;
	}

	function stringToJsonObject(s) {
		return s;
	}
	function intToJsonObject(s) {
		return parseInt(s, 10);
	}
	function floatToJsonObject(s) {
		return parseFloat(s);
	}
	function booleanToJsonObject(s) {
		var out = s === "0" ? false : true;
		return out;
	}
	function dateToJsonObject(s) {
		return new Date(s.replace(/-/g, "/"));
	}
   function userToJsonObject(s) {
        if (s.length === 0) {
			return null;
        } else {
            var thisUser = s.split(";#"); 
            var thisUserExpanded = thisUser[1].split(",#");
            if(thisUserExpanded.length == 1) {
                return {userId: thisUser[0], userName: thisUser[1]};
            } else {
                return {
					userId: thisUser[0], 
					userName: thisUserExpanded[0].replace( /(,,)/g, ","), 
					loginName: thisUserExpanded[1].replace( /(,,)/g, ","), 
					email: thisUserExpanded[2].replace( /(,,)/g, ","), 
					sipAddress: thisUserExpanded[3].replace( /(,,)/g, ","), 
					title: thisUserExpanded[4].replace( /(,,)/g, ",")
				};
            }
        }
    }
	function userMultiToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisUserMultiObject = [];
			var thisUserMulti = s.split(";#");
			for(i=0; i < thisUserMulti.length; i=i+2) {
				var thisUser = userToJsonObject(thisUserMulti[i] + ";#" + thisUserMulti[i+1]);
				thisUserMultiObject.push(thisUser);
			}
			return thisUserMultiObject;
		}
	}
	function lookupToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisLookup = s.split(";#");
			return {lookupId: thisLookup[0], lookupValue: thisLookup[1]};
		}
	}
	function lookupMultiToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisLookupMultiObject = [];
			var thisLookupMulti = s.split(";#");
			for(i=0; i < thisLookupMulti.length; i=i+2) {
				var thisLookup = lookupToJsonObject(thisLookupMulti[i] + ";#" + thisLookupMulti[i+1]);
				thisLookupMultiObject.push(thisLookup);
			}
			return thisLookupMultiObject;
		}
	}
	function choiceMultiToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisChoiceMultiObject = [];
			var thisChoiceMulti = s.split(";#");
			for(i=0; i < thisChoiceMulti.length; i++) {
				if(thisChoiceMulti[i].length !== 0) {
					thisChoiceMultiObject.push(thisChoiceMulti[i]);
				}
			}
			return thisChoiceMultiObject;
		}
	}
	function calcToJsonObject(s) {
		if(s.length === 0) {
			return null;
		} else {
			var thisCalc = s.split(";#");
			// The first value will be the calculated column value type, the second will be the value
			return attrToJson(thisCalc[1], thisCalc[0]);
		}
	}

	// Find a People Picker in the page
	// Returns references to:
	//   row - The TR which contains the People Picker (useful if you'd like to hide it at some point)
	//   contents - The element which contains the current value
	//   currentValue - The current value if it is set
	//   checkNames - The Check Names image (in case you'd like to click it at some point)
	$.fn.SPFindPeoplePicker = function(options) {

		var opt = $.extend({}, {
			peoplePickerDisplayName: "",	// The displayName of the People Picker on the form
			valueToSet: "",					// The value to set the People Picker to. Should be a string containing each username or groupname separated by semi-colons.
			checkNames: true				// If set to true, the Check Names image will be clicked to resolve the names
		}, options);

		var thisRow = $("nobr").filter(function() {
			// Ensures we get a match whether or not the People Picker is required (if required, the nobr contains a span also)
			return $(this).contents().eq(0).text() === opt.peoplePickerDisplayName;	
		}).closest("tr");

		var thisContents = thisRow.find("div[name='upLevelDiv']");
		var thisCheckNames = thisRow.find("img[Title='Check Names']:first");

		// If a value was provided, set the value
		if(opt.valueToSet.length > 0) {
			thisContents.html(opt.valueToSet);
		}

		// If checkName is true, click the check names icon
		if(opt.checkNames) {
			thisCheckNames.click();
		}
		var thisCurrentValue = $.trim(thisContents.text());

		// Parse the entity data
		var dictionaryEntries = [];

		// IE
		thisContents.children("span").each(function() {
		
			// Grab the entity data
			var thisData = $(this).find("div[data]").attr("data");

			var dictionaryEntry = {};

			// Entity data is only available in IE
			if(thisData != undefined) {
				var arrayOfDictionaryEntry = $.parseXML(thisData);
				$xml = $(arrayOfDictionaryEntry);

				$xml.find("DictionaryEntry").each(function() {
					var key = $(this).find("Key").text();
					var value = $(this).find("Value").text();
					dictionaryEntry[key] = value;
				});
				dictionaryEntries.push(dictionaryEntry);
			// For other browsers, we'll call GetUserInfo to get the data
			} else {
				$().SPServices({
					operation: "GetUserInfo",
					async: false,
					cacheXML: true,
					userLoginName: $(this).attr("title"),
					completefunc: function(xData, Status) {

						$(xData.responseXML).find("User").each(function() {
						
							$.each(this.attributes, function(i, attrib){ 
								var key = attrib.name; 
								var value = attrib.value; 
								dictionaryEntry[key] = value;
							});						
							dictionaryEntries.push(dictionaryEntry);
						});
					}
				});
			}	
		});
	
		return {row: thisRow, contents: thisContents, currentValue: thisCurrentValue, checkNames: thisCheckNames, dictionaryEntries: dictionaryEntries};
	};

	// Return the current version of SPServices as a string
	$.fn.SPServices.Version = function () {

		return VERSION;

	}; // End $.fn.SPServices.Version



////// PRIVATE FUNCTIONS ////////

	// Display a column (field) formatted correctly based on its definition in the list.
	// NOTE: Currently not dealing with locale differences.
	//   columnXML			The XML node for the column from a GetList operation
	//   columnValue		The text representation of the column's value
	//   opt				The current set of options
	function showColumn(listXML, columnXML, columnValue, opt) {

		if(typeof columnValue === 'undefined') {
			return "";
		}

		var i;
		var outString = "";
		var dispUrl;
		var numDecimals;
		var outArray =[];
		var webUrl = opt.relatedWebURL.length > 0 ? opt.relatedWebURL : $().SPServices.SPGetCurrentSite();

		switch(columnXML.attr("Type")) {
			case "Text":
				outString = columnValue;
				break;
			case "URL":
				switch(columnXML.attr("Format")) {
					// URL as hyperlink
					case "Hyperlink":
						outString = "<a href='" + columnValue.substring(0, columnValue.search(",")) + "'>" +
							columnValue.substring(columnValue.search(",") + 1) + "</a>";
						break;
					// URL as image
					case "Image":
						outString = "<img alt='" + columnValue.substring(columnValue.search(",") + 1) +
							"' src='" + columnValue.substring(0, columnValue.search(",")) + "'/>";
						break;
					// Just in case
					default:
						outString = columnValue;
						break;						
				}
				break;
			case "User":
			case "UserMulti":
				var userMultiValues = columnValue.split(";#");
				for(i=0; i < userMultiValues.length; i = i+2) {
					outArray.push("<a href='/_layouts/userdisp.aspx?ID=" + userMultiValues[i] +
						"&Source=" + escapeUrl(location.href) + "'>" +
						userMultiValues[i+1] +  "</a>");
				}
				outString = outArray.join(", ");
				break;
			case "Calculated":
				var calcColumn = columnValue.split(";#");
				outString = calcColumn[1];
				break;
			case "Number":
				numDecimals = columnXML.attr("Decimals");
				outString = numDecimals === undefined ?
					parseFloat(columnValue).toString() :
					parseFloat(columnValue).toFixed(numDecimals).toString();
				break;
			case "Currency":
				numDecimals = columnXML.attr("Decimals");
				outString = numDecimals === undefined ?
					parseFloat(columnValue).toFixed(2).toString() :
					parseFloat(columnValue).toFixed(numDecimals).toString();
				break;
			case "Lookup":
				switch(columnXML.attr("Name")) {
					case "FileRef":
						// Get the display form URL for the lookup source list
						dispUrl = listXML.attr("BaseType") === "1" ? listXML.attr("RootFolder") + SLASH + "Forms/DispForm.aspx" :
							listXML.attr("RootFolder") + SLASH + "DispForm.aspx";
						outString = "<a href='" + dispUrl +
							"?ID=" + columnValue.substring(0, columnValue.search(";#")) + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;
					case "FileDirRef":
						// Get the display form URL for the lookup source list
						dispUrl = SLASH + columnValue.substring(columnValue.search(";#") + 2);
						outString = "<a href='" + dispUrl + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;
					// Any other lookup column
					default:
						// Get the display form URL for the lookup source list
						dispUrl = getListFormUrl(columnXML.attr("List"), "DisplayForm");
						outString = "<a href='" + opt.relatedWebURL + SLASH + dispUrl +
							"?ID=" + columnValue.substring(0, columnValue.search(";#")) + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							columnValue.substring(columnValue.search(";#") + 2) + "</a>";
						break;						
				}
				break;
			case "LookupMulti":
				// Get the display form URL for the lookup source list
				dispUrl = getListFormUrl(columnXML.attr("List"), "DisplayForm");
				// Show all the values as links to the items, separated by commas
				outString = "";
				if(columnValue.length > 0) {
					var lookupMultiValues = columnValue.split(";#");
					for(i=0; i < lookupMultiValues.length / 2; i++) {
						outArray.push("<a href='" + webUrl + SLASH + dispUrl +
							"?ID=" + lookupMultiValues[i * 2] + "&RootFolder=*&Source=" + escapeUrl(location.href) + "'>" +
							lookupMultiValues[(i * 2) + 1] + "</a>");
					}
				}
				outString = outArray.join(", ");
				break;
			case "File":
				fileName = columnValue.substring(columnValue.search(";#") + 2);
				outString = "<a href='" + listXML.attr("RootFolder") + SLASH + fileName + "'>" + fileName + "</a>";
				break;
			case "Counter":
				outString = columnValue;
				break;
			case "DateTime":
				outString = columnValue;
				break;
			default:
				outString = columnValue;
				break;
		}
		return outString;
	} // End of function showColumn

	// Show a single attribute of a node, enclosed in a table
	//   node				The XML node
	//   opt				The current set of options
	function showAttrs(node, opt) {
		var i;
		var out = "<table class='ms-vb' width='100%'>";
		for (i=0; i < node.attributes.length; i++) {
			out += "<tr><td width='10px' style='font-weight:bold;'>" + i + "</td><td width='100px'>" +
				node.attributes.item(i).nodeName + "</td><td>" + checkLink(node.attributes.item(i).nodeValue) + "</td></tr>";
		}
		out += "</table>";
		return out;
	} // End of function showAttrs

	// Find a dropdown (or multi-select) in the DOM. Returns the dropdown onject and its type:
	// S = Simple (select);C = Compound (input + select hybrid);M = Multi-select (select hybrid)
	function DropdownCtl(colName) {
		// Simple
		if((this.Obj = $("select[Title='" + colName + "']")).length === 1) {
			this.Type = "S";
		// Compound
		} else if((this.Obj = $("input[Title='" + colName + "']")).length === 1) {
			this.Type = "C";
		// Multi-select: This will find the multi-select column control in English and most other languages sites where the Title looks like 'Column Name possible values'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title^='" + colName + " ']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a Russian site (and perhaps others) where the Title looks like 'Выбранных значений: Column Name'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$=': " + colName + "']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a German site (and perhaps others) where the Title looks like 'Mögliche Werte für &quot;Column name&quot;.'
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$='\"" + colName + "\".']")).length === 1) {
			this.Type = "M";
		// Multi-select: This will find the multi-select column control on a Italian site (and perhaps others) where the Title looks like "Valori possibili Column name"
		} else if((this.Obj = $("select[ID$='SelectCandidate'][Title$=' " + colName + "']")).length === 1) {
			this.Type = "M";
		} else {
			this.Type = null;
		}
	} // End of function DropdownCtl

	// Returns the selected value(s) for a dropdown in an array. Expects a dropdown object as returned by the DropdownCtl function.
	// If matchOnId is true, returns the ids rather than the text values for the selection options(s).
	function getDropdownSelected(columnSelect, matchOnId) {

		var columnSelectSelected = [];
		
		switch(columnSelect.Type) {
			case "S":
				if(matchOnId) {
					columnSelectSelected.push(columnSelect.Obj.find("option:selected").val() || []);
				} else {
					columnSelectSelected.push(columnSelect.Obj.find("option:selected").text() || []);
				}
				break;
			case "C":
				if(matchOnId) {
					columnSelectSelected.push($("input[id='"+ columnSelect.Obj.attr("optHid") + "']").val() || []);
				} else {
					columnSelectSelected.push(columnSelect.Obj.attr("value") || []);
				}				
				break;
			case "M":
				var columnSelections = columnSelect.Obj.closest("span").find("select[ID$='SelectResult']");
				$(columnSelections).find("option").each(function() {
					columnSelectSelected.push($(this).html());
				});
				break;
			default:
				break;
		}
		return columnSelectSelected;

	} // End of function getDropdownSelected
	
	// Build an error message based on passed parameters
	function errBox(func, param, msg) {
		var errMsg = "<b>Error in function</b><br/>" + func + "<br/>" +
			"<b>Parameter</b><br/>" + param + "<br/>" +
			"<b>Message</b><br/>" + msg + "<br/><br/>" +
			"<span onmouseover='this.style.cursor=\"hand\";' onmouseout='this.style.cursor=\"inherit\";' style='width=100%;text-align:right;'>Click to continue</span></div>";
		modalBox(errMsg);
	} // End of function errBox

	// Call this function to pop up a branded modal msgBox
	function modalBox(msg) {
		var boxCSS = "position:absolute;width:300px;height:150px;padding:10px;background-color:#000000;color:#ffffff;z-index:30;font-family:'Arial';font-size:12px;display:none;";
		$("#aspnetForm").parent().append("<div id='SPServices_msgBox' style=" + boxCSS + ">" + msg);
		var height = $("#SPServices_msgBox").height();
		var width = $("#SPServices_msgBox").width();
		var leftVal = ($(window).width() / 2) - (width / 2) + "px";
		var topVal = ($(window).height() / 2) - (height / 2) - 100 + "px";
		$("#SPServices_msgBox").css({border:'5px #C02000 solid', left:leftVal, top:topVal}).show().fadeTo("slow", 0.75).click(function () {
			$(this).fadeOut("3000", function () {
				$(this).remove();
			});
		});
	} // End of function modalBox

	// Generate a unique id for a containing div using the function name and the column display name
	function genContainerId(funcname, columnName) {
		return funcname + "_" + $().SPServices.SPGetStaticFromDisplay({
			listName: $().SPServices.SPListNameFromUrl(),
			columnDisplayName: columnName
		});
	} // End of function genContainerId
	
	// Get the URL for a specified form for a list
	function getListFormUrl(l, f) {

		var thisForm, u;

		$().SPServices({
			operation: "GetFormCollection",
			async: false,
			listName: l,
			completefunc: function (xData, Status) {
				u = $(xData.responseXML).find("Form[Type='" + f + "']").attr("Url");;
			}
		});
		return u;

	} // End of function getListFormUrl

	// Add the option values to the SOAPEnvelope.payload for the operation
	//	opt = options for the call
	//	paramArray = an array of option names to add to the payload
	//		"paramName" if the parameter name and the option name match
	//		["paramName", "optionName"] if the parameter name and the option name are different (this handles early "wrappings" with inconsistent naming)
	function addToPayload(opt, paramArray) {

		var i;

		for (i=0; i < paramArray.length; i++) {
			// the parameter name and the option name match
			if(typeof paramArray[i] === "string") {
				SOAPEnvelope.payload += wrapNode(paramArray[i], opt[paramArray[i]]);
			// the parameter name and the option name are different 
			} else if(paramArray[i].length === 2) {
				SOAPEnvelope.payload += wrapNode(paramArray[i][0], opt[paramArray[i][1]]);
			// something isn't right, so report it
			} else {
				errBox(opt.operation, "paramArray[" + i + "]: " + paramArray[i], "Invalid paramArray element passed to addToPayload()");
			}
		}
	} // End of function addToPayload

	// Finds the td which contains a form field in default forms using the comment which contains:
	//   <!--  FieldName="Title"
	//		 FieldInternalName="Title"
	//		 FieldType="SPFieldText"
	//	   -->
	// as the "anchor" to find it. Necessary because SharePoint doesn't give all field types ids or specific classes.
	function findFormField(columnName) {
		var thisFormBody;
		// There's no easy way to find one of these columns; we'll look for the comment with the columnName
		var searchText = RegExp("FieldName=\"" + columnName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + "\"", "gi");
		// Loop through all of the ms-formbody table cells
		$("td.ms-formbody, td.ms-formbodysurvey").each(function() {
			// Check for the right comment
			if(searchText.test($(this).html())) {
				thisFormBody = $(this);
				// Found it, so we're done
				return false;
			}
		});
		return thisFormBody;
	} // End of function findFormField
	
	// The SiteData operations have the same names as other Web Service operations. To make them easy to call and unique, I'm using
	// the SiteData prefix on their names. This function replaces that name with the right name in the SOAPEnvelope.
	function siteDataFixSOAPEnvelope(SOAPEnvelope, siteDataOperation) {
		var siteDataOp = siteDataOperation.substring(8);
		SOAPEnvelope.opheader = SOAPEnvelope.opheader.replace(siteDataOperation, siteDataOp);
		SOAPEnvelope.opfooter = SOAPEnvelope.opfooter.replace(siteDataOperation, siteDataOp);
		return SOAPEnvelope;
	} // End of function siteDataFixSOAPEnvelope

	// Wrap an XML node (n) around a value (v)
	function wrapNode(n, v) {
		var thisValue = v !== undefined ? v : "";
		return "<" + n + ">" + thisValue + "</" + n + ">";
	}

	// Generate a random number for sorting arrays randomly
	function randOrd() {
		return (Math.round(Math.random())-0.5);
	}

	// If a string is a URL, format it as a link, else return the string as-is
	function checkLink(s) {
		return ((s.indexOf("http") === 0) || (s.indexOf(SLASH) === 0)) ? "<a href='" + s + "'>" + s + "</a>" : s;
	}

	// Get the filename from the full URL
	function fileName(s) {
		return s.substring(s.lastIndexOf(SLASH)+1,s.length);
	}

	// Escape string characters
	function escapeHTML(s) {
		return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}

	// Escape column values
	function escapeColumnValue(s) {
		if(typeof s === "string") {
			return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
		} else {
			return s;
		}
	}

	// Escape Url
	function escapeUrl(u) {
		return u.replace(/&/g,'%26');
	}

})(jQuery);