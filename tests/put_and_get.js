var hamt = require('../dist_node/hamt');


exports.single = function(test) {
    var h = hamt.set('a', 3, hamt.make());
    test.equal(hamt.get('a', h), 3);
    
    test.done();
};

exports.get_non_existant_empty = function(test) {
    test.equal(hamt.get('a', hamt.make()), null);
    
    test.done();
};

exports.multiple = function(test) {
    var h1 = hamt.set('a', 3, hamt.make());
    var h2 = hamt.set('b', 5, h1);
    
    test.equal(hamt.get('a', h2), 3);
    test.equal(hamt.get('b', h2), 5);
    
    test.done();
};

exports.set_does_not_alter_original = function(test) {
    var h1 = hamt.set('a', 3, hamt.make());
    var h2 = hamt.set('b', 5, h1);
    
    test.equal(hamt.get('a', h1), 3);
    test.equal(hamt.get('b', h1), null);
    
    test.equal(hamt.get('a', h2), 3);
    test.equal(hamt.get('b', h2), 5)
    ;
    test.done();
};

exports.custom_keys = function(test) {
    var h = hamt.make({
        keyEq: function(x, y) {
            if (x.length !== y.length)
                return false;
            for (var i = 0, len = x.length; i < len; ++i)
                if (x[i] !== y[i])
                    return false;
            return true;
        },
        hash: function(x) {
            return hamt.hash(x.join(','));
        }
    })
    var h1 = hamt.set([1], 3, h);
    var h2 = hamt.set([1, 2, 3], 5, h1);
    var h3 = hamt.set([4, 5, 6], 7, h2);

    test.equal(hamt.get([1], h2), 3);
    test.equal(hamt.get([1, 2, 3], h2), 5);
    test.equal(hamt.get([4, 5, 6], h3), 7);

    test.done();
};


exports.collision = function(test) {
    var h = hamt.make({'hash': function() { return 0; }})
    var h1 = hamt.set('a', 3, h);
    var h2 = hamt.set('b', 5, h1);
    
    test.equal(hamt.get('a', h2), 3);
    test.equal(hamt.get('b', h2), 5);
    
    test.done();
};

exports.collision_expansion = function(test) {
    var h1 = hamt.set('a', 3, hamt.make({'hash': function(x) { return x === 'a' || x === 'b' ? 0 : 1; }}))
    var h2 = hamt.set('b', 5, h1);
    var h3 = hamt.set('c', 7, h2);

    test.equal(hamt.get('a', h3), 3);
    test.equal(hamt.get('b', h3), 5);
    test.equal(hamt.get('c', h3), 7);

    test.done();
};

exports.many_unorder = function(test) {
    var arr = ["n", "U", "p", "^", "h", "w", "W", "x", "S", "f", "H", "m", "g",
               "l", "b", "_", "V", "Z", "G", "o", "F", "Q", "a", "k", "j", "r",
               "B", "A", "y", "\\", "R", "D", "i", "c", "]", "C", "[", "e", "s",
               "t", "J", "E", "q", "v", "M", "T", "N", "L", "K", "Y", "d", "P",
               "u", "I", "O", "`", "X"];
    
    var h = hamt.make();
    arr.forEach(function(x) {
        h = hamt.set(x, x, h);
    });
    
    arr.forEach(function(x) {
        test.equal(
            hamt.get(x, h),
            x);
    });

    
    test.done();
};

exports.many_ordered = function(test) {
    var h = hamt.make();
    for (var i = 'A'.charCodeAt(0); i < 'z'.charCodeAt(0); ++i) {
        h = hamt.set(String.fromCharCode(i), i, h);
    }

    for (var i = 'A'.charCodeAt(0); i < 'z'.charCodeAt(0); ++i) {
        test.equal(
            hamt.get(String.fromCharCode(i), h),
            i);
    }
    
    test.done();
};