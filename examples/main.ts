import { Tree } from '../src/core/tree';

const tree: Tree = new Tree();

tree.add('/api/hello/:user', {});

console.log(tree.find('/api/hello/sunrit'));

//Implement logic
