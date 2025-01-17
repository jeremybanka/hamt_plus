/* eslint-disable */
"use strict";
import hamt from "hamt_plus"
import { assert } from "chai"

describe('count', () => {
    it('should return zero for empty map', () => {
        assert.strictEqual(0, hamt.count(hamt.make()));
        assert.strictEqual(0, hamt.make().count());
        assert.strictEqual(0, hamt.make().size);
    });
    
    it('should return 1 for single element map', () => {
        assert.strictEqual(1, hamt.count(hamt.make().set('a', 5)));
        assert.strictEqual(1, hamt.make().set('b', 5).count());
        assert.strictEqual(1, hamt.make().set('b', 5).size);
    });
    
    it('should handle counts on collisions correctly', () => {
        const h1 = hamt.make()
            .setHash(0, 'a', 3)
            .setHash(0, 'b', 5);
        
        assert.strictEqual(2, hamt.count(h1));
    });
    
    it('return correct counts while items are added and removed', () => {
        const insert = [
            "n", "U", "p", "^", "h", "w", "W", "x", "S", "f", "H", "m", "g",
            "l", "b", "_", "V", "Z", "G", "o", "F", "Q", "a", "k", "j", "r",
            "B", "A", "y", "\\", "R", "D", "i", "c", "]", "C", "[", "e", "s",
            "t", "J", "E", "q", "v", "M", "T", "N", "L", "K", "Y", "d", "P",
            "u", "I", "O", "`", "X"];
    
        const remove = [
            "w", "m", "Q", "R", "i", "K", "P", "Y", "D", "g", "y", "L",
            "b", "[", "a", "t", "j", "W", "J", "G", "q", "r", "p", "U",
            "v", "h", "S", "_", "d", "x", "I", "F", "f", "n", "B", "\\",
            "k", "V", "N", "l", "X", "A", "]", "s", "Z", "O", "^", "o",
            "`", "H", "E", "e", "M", "u", "T", "c", "C"];
    
        let h = hamt.make();
    
        for (let i = 0; i < insert.length; ++i) {
            const x = insert[i];
            h = h.set(x, x);
            assert.strictEqual(i + 1, hamt.count(h));
        }

        for (let i = 0; i < remove.length; ++i) {
            h = h.remove(remove[i]);
            assert.strictEqual(remove.length - i - 1, hamt.count(h));
        }
    });
    
      it('should work on array nodes correctly', () => {
        const insert = [
            "n", "U", "p", "^", "h", "w", "W", "x", "S", "f", "H", "m", "g",
            "l", "b", "_", "V", "Z", "G", "o", "F", "Q", "a", "k", "j", "r",
            "B", "A", "y", "\\", "R", "D", "i", "c", "]", "C", "[", "e", "s",
            "t", "J", "E", "q", "v", "M", "T", "N", "L", "K", "Y", "d", "P",
            "u", "I", "O", "`", "X"];
    
        let h = hamt.make();
        for (let i = 0; i < insert.length; ++i) {
            h = h.setHash(i, insert[i], insert[i]);
        }
        
        assert.strictEqual(insert.length, h.count());
        
        for (let i = 0; i < insert.length; ++i) {
            h = h.removeHash(i, insert[i]);
            assert.strictEqual(insert.length - i - 1, h.count());
        }
    });
});

