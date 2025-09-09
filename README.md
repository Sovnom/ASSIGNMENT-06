1. var, let, and const
​var: A function-scoped variable that can be re-declared and re-assigned. Modern JavaScript generally avoids using it.
​let: A block-scoped variable that can be re-assigned but not re-declared within the same scope. It's used for values that will change.
​const: A block-scoped variable that cannot be re-assigned or re-declared. It's used for values that should remain constant.
​2. map(), forEach(), and filter()
​forEach(): Iterates through each item of an array to perform an action. It does not return a new array.
​map(): Creates a new array by transforming each item from the original array.
​filter(): Creates a new array containing only the items that pass a specific condition.
​3. Arrow Functions
​Arrow functions are a shorter way to write functions. They are different from traditional functions because they don't have their own this context; instead, they inherit this from the surrounding code.
​4. Destructuring Assignment
​This is a convenient syntax that allows you to unpack values directly from arrays or properties from objects into separate variables. It makes your code cleaner and easier to read.
​5. Template Literals vs. String Concatenation
​Template literals use backticks (``) to create strings and let you embed variables or expressions directly inside them. This is a much cleaner and more modern approach than string concatenation, which uses the + operator to join strings and variables together.
