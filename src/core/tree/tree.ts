import { Node } from './node';

import type { Data } from '../../interfaces/data';

export class Tree {
  root: null | Node;

  constructor() {
    this.root = null;
  }

  public add(path: string, data: Data) {
    if (this.isEmpty()) {
      this.root = new Node('', '', null);
    }

    const fullPath = path;

    let node = this.root!;
    node.priority++;

    node_loop: while (node) {
      path = path.slice(node.path.length);

      if (path.length === 0) {
        if (node.data) {
          throw new Error('Node already defined');
        }

        node.data = data;

        return this;
      }

      if (node.children.length) {
        for (let nodeIndex = 0; nodeIndex < node.children.length; nodeIndex++) {
          if (node.children[nodeIndex].path[0] === path[0]) {
            let selectedNode = node.children[nodeIndex];

            let pathCompareIndex;
            for (
              pathCompareIndex = 0;
              pathCompareIndex <
              Math.min(selectedNode.path.length, path.length);
              pathCompareIndex++
            ) {
              if (
                path[pathCompareIndex] !== selectedNode.path[pathCompareIndex]
              ) {
                break;
              }
            }

            // go further down the tree
            if (pathCompareIndex >= selectedNode.path.length) {
              node.children[nodeIndex].priority++;
              node.sort();

              node = selectedNode;

              continue node_loop;
              // we inject a new node, cause the new path is part of this one
            } else if (pathCompareIndex >= path.length) {
              let newChild = new Node(path, fullPath, data);

              selectedNode.path = selectedNode.path.replace(path, '');

              node.remove(selectedNode);

              newChild.priority = selectedNode.priority + 1;
              newChild.append(selectedNode);

              node.append(newChild);

              return this;
              // we match partly, generate a new edge
            } else if (pathCompareIndex > 0) {
              let newEdge = new Node(
                path.substr(0, pathCompareIndex),
                '',
                null
              );

              selectedNode.path = selectedNode.path.substr(pathCompareIndex);

              newEdge.priority = selectedNode.priority + 1;

              node.remove(selectedNode);
              node.append(newEdge);

              newEdge.append(selectedNode);

              node = newEdge;

              continue node_loop;
            }
          }
        }
      }

      this.appendNode(node, path, fullPath, data);

      return this;
    }

    return this;
  }

  public appendNode(node: Node, path: string, fullPath: string, data: Data) {
    let offset = 0;

    let child: Node = new Node('', '', {});

    for (let index = 0; index < path.length; index++) {
      let character = path[index];

      if (character !== ':' && character !== '*') {
        continue;
      }

      if (character === ':') {
        if (node.children.length !== 0 && index === 0) {
          throw new Error(
            'Param node can not be appended to an already existing path'
          );
        }

        if (offset < index - offset) {
          child.path = path.substr(offset, index - offset);

          offset = index;
          node.append(child);
          node = child;
        }

        child = new Node('', '', {});
        child.type = Node.PARAM;
      } else if (character === '*') {
        if (node.children.length !== 0 && index === 0) {
          throw new Error(
            'Param node can not be appended to an already existing path'
          );
        }

        if (offset < index - offset) {
          child.path = path.substr(offset, index - offset);

          offset = index;
          node.append(child);
          node = child;
        }

        child = new Node('', '', {});
        child.type = Node.CATCHALL;
      }
    }

    child.path = path.slice(offset);
    child.fullPath = fullPath;
    child.data = data;

    node.append(child);

    return this;
  }

  public remove(path: string) {
    if (this.isEmpty()) {
      return this;
    }

    let node = this.root;
    let offset = node?.path.length || 1;

    let pathLength = path.length;

    let passedNodes = [];

    node_loop: while (node) {
      passedNodes.push(node);

      if (pathLength === offset) {
        break;
      }

      if (!node.children.length) {
        return this;
      }

      for (let index = 0; index < node.children.length; index++) {
        let child = node.children[index];

        if (child.type === Node.DEFAULT) {
          if (
            path[offset] === child.path[0] &&
            path.indexOf(child.path, offset) === offset
          ) {
            node = child;
            offset += node?.path.length || 0;

            continue node_loop;
          }
        } else if (child.type === Node.PARAM) {
          // break if no parameter
          if (path[offset] !== ':') {
            return this;
          }

          let paramEnd = path.indexOf('/', offset);
          paramEnd = paramEnd !== -1 ? paramEnd : pathLength;

          // are the names not matching, abort
          if (child.path !== path.substr(offset, paramEnd - offset)) {
            return this;
          }

          offset = paramEnd;
          node = child;

          continue node_loop;
        } else if (child.type === Node.CATCHALL) {
          // break if no catchall
          if (path[offset] !== '*') {
            return this;
          }

          // are the names not matching, abort
          if (child.path !== path.substr(offset)) {
            return this;
          }

          offset = path.length;
          node = child;

          continue node_loop;
        }
      }

      break;
    }

    passedNodes.reverse();

    node = passedNodes[0];
    let parentNode = passedNodes[1];

    switch (node.children.length) {
      case 0:
        parentNode.remove(node);
        break;

      case 1:
        let childNode = node.children[0];
        childNode.path = node.path + childNode.path;

        parentNode.remove(node);
        parentNode.append(childNode);
        break;

      default:
        break;
    }

    return this;
  }

  public removeAll() {
    this.root = null;

    return this;
  }

  public countParams(path: string) {
    let matches = path.match(/:|\*/g);

    return matches ? matches.length : 0;
  }

  public find(path: string) {
    if (this.isEmpty()) {
      return undefined;
    }

    let node = this.root;
    let offset = node?.path.length || 0;
    let params = null;

    let pathLength = path.length;

    node_loop: while (node) {
      if (pathLength === offset) {
        let result = {
          path: node.fullPath,
          data: node.data,
          params: params
        };

        if (node.data) {
          result.data = node.data;
        }

        if (params) {
          result.params = params;
        }

        return result;
      }

      if (!node.children.length) {
        break;
      }

      for (let index = 0; index < node.children.length; index++) {
        let child = node.children[index];

        if (child.type === Node.DEFAULT) {
          if (
            path[offset] === child.path[0] &&
            path.indexOf(child.path, offset) === offset
          ) {
            node = child;
            offset += node?.path.length || 0;

            continue node_loop;
          }
        } else if (child.type === Node.PARAM) {
          let paramEnd = path.indexOf('/', offset);

          paramEnd = paramEnd !== -1 ? paramEnd : pathLength;

          if (!params) {
            params = {};
          }
          //@ts-ignore
          params[child.path.substr(1)] = path.substr(offset, paramEnd - offset);

          offset = paramEnd;
          node = child;

          continue node_loop;
        } else if (child.type === Node.CATCHALL) {
          if (!params) {
            params = {};
          }
          //@ts-ignore
          params[child.path.substr(1)] = path.substr(offset);

          offset = path.length;
          node = child;

          continue node_loop;
        }
      }

      break;
    }

    return undefined;
  }

  public isEmpty() {
    return this.root === null;
  }
}
