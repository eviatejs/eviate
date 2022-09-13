'use strict';

export class Node {
  static DEFAULT: number;
  path: string;
  fullPath: string;
  data: any;
  priority: number;
  type: number;
  children: any;
  static CATCHALL: number;
  static PARAM: number;
  constructor(path: string, fullPath: string, data: any) {
    this.path = path;
    this.fullPath = fullPath;
    this.data = data;
    this.priority = 1;
    this.type = Node.DEFAULT;
    this.children = [];
  }

  append(node: any) {
    this.children.push(node);
    this.sort();
  }

  remove(node: any) {
    let position = this.children.indexOf(node);

    if (position === -1) {
      return;
    }

    this.children.splice(position, 1);
  }

  sort() {
    this.children.sort(
      (a: { priority: number }, b: { priority: number }) =>
        b.priority - a.priority
    );
  }
}

Node.DEFAULT = 0;
Node.PARAM = 1;
Node.CATCHALL = 2;
