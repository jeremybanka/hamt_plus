/* eslint-disable */
"use strict";
import hamt from "hamt_plus"
import { assert } from "chai"

describe('set', () => {
    it('should add entry to empty map', () => {
        assert.strictEqual(3, hamt.set('a', 3, hamt.make()).get('a'));
        assert.strictEqual(3, hamt.make().set('a', 3).get('a'));
    });

    it('should add entry to existing map', () => {
        const h = hamt.make().set('a', 3);
        const h1 = h.set('b', 5);

        assert.strictEqual(3, hamt.get('a', h1));
        assert.strictEqual(5, hamt.get('b', h1));

        assert.strictEqual(3, hamt.get('a', h));
        assert.strictEqual(undefined, hamt.get('b', h));
    });


    it('should overwrite entry in existing map', () => {
        const h1 = hamt.make()
            .set('a', 3)
            .set('b', 5)
            .set('c', 10);
        const h2 = h1.set('b', 4);

        assert.strictEqual(3, hamt.get('a', h2));
        assert.strictEqual(4, hamt.get('b', h2));
        assert.strictEqual(10, hamt.get('c', h2));

        assert.strictEqual(3, hamt.get('a', h1));
        assert.strictEqual(5, hamt.get('b', h1));
        assert.strictEqual(10, hamt.get('c', h1));
    });

    it('should handle collisions correctly', () => {
        const h1 = hamt.make().setHash(0, 'a', 3);
        const h2 = h1.setHash(0, 'b', 5);

        assert.strictEqual(3, h2.getHash(0, 'a'));
        assert.strictEqual(5, h2.getHash(0, 'b'));
    });

    it('should add to collisions correctly', () => {
        const h1 = hamt.make().setHash(0, 'a', 3);
        const h2 = h1.setHash(0, 'b', 5);
        const h3 = h2.setHash(1, 'c', 7);

        assert.strictEqual(3, h3.getHash(0, 'a'));
        assert.strictEqual(5, h3.getHash(0, 'b'));
        assert.strictEqual(7, h3.getHash(1, 'c'));
    });

    it('should use custom hash function', () => {
        const hash = () => 0;
        const h = hamt.make({ hash: hash })
            .set('a', 3)
            .set('b', 5);

        assert.strictEqual(3, h.getHash(0, 'a'));
        assert.strictEqual(5, h.getHash(0, 'b'));
    });

    it('should use custom key function', () => {
        const keyEq = (
            x: { value: string }, 
            y: { value: string }
        ) => x.value === y.value;
        const h = hamt.make({ keyEq: keyEq })
            .set({ value: 'a' }, 3)
            .set({ value: 'b' }, 5)
            .set({ value: 'a' }, 7);

        assert.strictEqual(2, h.count());
        assert.strictEqual(7, h.get({ value: 'a' }));
        // @ts-expect-error - this is a test
        assert.strictEqual(undefined, h.get('a'));
        assert.strictEqual(5, h.get({ value: 'b' }));
        // @ts-expect-error - this is a test
        assert.strictEqual(undefined, h.get('b'));
    });

    it('should set values correctly from list with no order', () => {
        const arr = [
            "n", "U", "p", "^", "h", "w", "W", "x", "S", "f", "H", "m", "g",
            "l", "b", "_", "V", "Z", "G", "o", "F", "Q", "a", "k", "j", "r",
            "B", "A", "y", "\\", "R", "D", "i", "c", "]", "C", "[", "e", "s",
            "t", "J", "E", "q", "v", "M", "T", "N", "L", "K", "Y", "d", "P",
            "u", "I", "O", "`", "X"];

        let h = hamt.make();
        arr.forEach(function(x) {
            h = h.set(x, x);
        });

        arr.forEach(function(x) {
            assert.strictEqual(x, hamt.get(x, h));
        });
    });

    it('should set values correctly from an ordered list', () => {
        let h = hamt.make();
        for (let i = 'A'.charCodeAt(0); i < 'z'.charCodeAt(0); ++i) {
            h = h.set(String.fromCharCode(i), i);
        }

        for (let i = 'A'.charCodeAt(0); i < 'z'.charCodeAt(0); ++i) {
            assert.strictEqual(i, hamt.get(String.fromCharCode(i), h));
        }
    });

    it('should not mutate map if value is same as stored', () => {
        {
            const h = hamt.make().set('a', 3);
            const h1 = h.set('a', 3);
            assert.strictEqual(h1, h);
        }
        {
            const h = hamt.make()
                .set('a', 3)
                .set('b', 5)
                .set('c', 10);
            const h1 = h
                .set('a', 3)
                .set('b', 5)
                .set('c', 10);
            assert.strictEqual(h1, h);
        }
    });

    it('should not mutate map if value in collision is same as stored', () => {
        const h = hamt.make().setHash(0, 'a', 3).setHash(0, 'b', 3);
        const h1 = h.setHash(0, 'a', 3);
        assert.strictEqual(h1, h);
    });
});
