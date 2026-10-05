const rootParentIds = new Set(['', '0']);

interface HierarchicalMenu {
  id: string;
  upline: string;
  urut: number;
}

const compareMenuOrder = <T extends HierarchicalMenu>(left: T, right: T): number =>
  Number(left.urut) - Number(right.urut) || left.id.localeCompare(right.id);

export const sortMenusByHierarchy = <T extends HierarchicalMenu>(menus: T[]): T[] => {
  const menuById = new Map(menus.map((menu) => [menu.id, menu]));
  const childrenByParent = new Map<string, T[]>();
  const roots: T[] = [];

  for (const menu of menus) {
    const parentId = menu.upline || '';
    if (rootParentIds.has(parentId) || !menuById.has(parentId) || parentId === menu.id) {
      roots.push(menu);
      continue;
    }

    const siblings = childrenByParent.get(parentId) || [];
    siblings.push(menu);
    childrenByParent.set(parentId, siblings);
  }

  const sortedMenus: T[] = [];
  const visited = new Set<string>();

  const appendBranch = (menu: T) => {
    if (visited.has(menu.id)) return;
    visited.add(menu.id);
    sortedMenus.push(menu);

    const children = (childrenByParent.get(menu.id) || []).sort(compareMenuOrder);
    children.forEach(appendBranch);
  };

  roots.sort(compareMenuOrder).forEach(appendBranch);

  // Preserve records in malformed cycles by placing unvisited branches last.
  menus.slice().sort(compareMenuOrder).forEach(appendBranch);
  return sortedMenus;
};
