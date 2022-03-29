import { createComponentInstance, setupComponent } from "./component"
import { isObject } from '../shared/index';

export function render(vnode, container) {
  // patch
  patch(vnode, container)
};

// patch 函数
function patch(vnode, container) {
  // 处理组件

  // 判断 是 Element 还是 Component 
  if (typeof vnode.type === "string") {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

// 处理 Element 类型
function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

// 创建 element 类型
function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type))
  console.log("mountElement");

  // children => string | Array [h(), h()] | "xxx"

  const { children } = vnode
  // console.log(typeof children); // typeof Array -> Object

  if (typeof children === "string") {
    el.textContent = children
  } else if (children instanceof Array) {
    // 遍历 children 的每一个节点
    children.forEach(v => {
      // 递归的 h
      patch(v, el)
    });
  }

  const { props } = vnode

  for (const key in props) {
    // 属性名
    const attrName = key
    // 属性值
    const attrValue = props[key]

    el.setAttribute(attrName, attrValue)
  }

  container.append(el)
}

// 处理 Component 类型
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

// 组件初始化
function mountComponent(initialVNode: any, container: any) {
  // 创建 Component instance 对象
  const instance = createComponentInstance(initialVNode)

  // 设置 instance 的属性
  setupComponent(instance)

  // 生命周期钩子
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode: any, container: any) {

  const { proxy } = instance
  console.log(instance.render);


  // 获取 vnode (子组件)
  const subTree = instance.render.call(proxy)


  // vnode 树
  // vnode -> path
  // vnode -> element -> mountElement

  patch(subTree, container)

  // element -> mount
  initialVNode.el = subTree.el

}


