/* eslint-disable */
"use strict";
import hamt from "hamt_plus"
import { assert } from "chai"

describe('fold', () => {
    it('should handle large folds correctly', () => {
        let h = hamt.make<number>();

        let sum = 0;
        for (let i = 0; i < 20000; ++i) {
            h = h.set(i + '', i);
            sum += i;
        }

        assert.strictEqual(sum, h.fold((p, c) => p + c, 0));
    });
});
