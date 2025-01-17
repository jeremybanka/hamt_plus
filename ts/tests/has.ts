/* eslint-disable */
"use strict";
import hamt from "hamt_plus"
import { assert } from "chai"

describe('has', () => {
    it('should return false for empty map', () => {
        assert.strictEqual(false, hamt.has('a', hamt.make()));
        assert.strictEqual(false, hamt.has('b', hamt.make()));
    });
    
    it('should return if entry exists for single map', () => {
        var h1 = hamt.make().set('a', 3);
    
        assert.strictEqual(true, h1.has('a'));
        assert.strictEqual(false, h1.has('b'));
    });
    
     it('should not depend on stored value', () => {    
        assert.strictEqual(true, hamt.has('a', hamt.make().set('a', 3)));
        assert.strictEqual(true, hamt.has('a', hamt.make().set('a', false)));
        assert.strictEqual(true, hamt.has('a', hamt.make().set('a', null)));
        assert.strictEqual(true, hamt.has('a', hamt.make().set('a', undefined)));
    });
    
    it('should return if entry exists in map', () => {
        var h = hamt.make();
        for (let i = 'A'.charCodeAt(0); i < 'z'.charCodeAt(0); i += 2) {
            h = h.set(String.fromCharCode(i), i);
        }
    
        for (let i = 'A'.charCodeAt(0); i < 'z'.charCodeAt(0);) {
            assert.strictEqual(true, hamt.has(String.fromCharCode(i++), h));
            assert.strictEqual(false, hamt.has(String.fromCharCode(i++), h));
        }
    });
});
