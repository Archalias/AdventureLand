import { getRandomInt } from './randomInt';

export function sortInventory() {
  const priorityList = [/mpot[0-9]/i, /hpot[0-9]/i, 'tracker', /stand[0-9]/i, /scroll[0-9]/i, /fiery.*/i, 'handofmidas'];
  const { character } = parent;
  let totalSwaps = 0;
  Object.values(character.items)
    .map((item, index) => ({
      id: item ? item.name : undefined,
      ...item,
      ...(item ? G.items[item.name] : []),
      index,
    }))
    .filter(item => item.name)
    .sort((itemA, itemB) => {
      const listA = priorityList.findIndex(match => match.test ? match.test(itemA.id) : itemA.id === match);
      const listB = priorityList.findIndex(match => match.test ? match.test(itemB.id) : itemB.id === match);
      if (listA >= 0) {
        if (listB >= 0) {
          if (listA < listB) return -1;
          if (listA > listB) return 1;
          return 0;
        }
        return -1;
      }
      if (listB >= 0 && listA === -1) return 1;
      if (itemA.set) {
        if (itemB.set) {
          if (itemA.set < itemB.set) return -1;
          if (itemA.set > itemB.set) return 1;
        } else return -1;
      }
      if (itemB.set && !itemA.set) return 1;
      if (itemA.name < itemB.name) return -1;
      if (itemA.name > itemB.name) return 1;
      if (itemA.level) {
        if (itemB.level) {
          if (itemA.level > itemB.level) return -1;
          if (itemA.level < itemB.level) return 1;
        } else return -1;
      }
      if (itemA.q && itemB.q) {
        if (itemA.q < itemB.q) return -1;
        if (itemA.q > itemB.q) return 1;
      }
      return 0;
    })
    .forEach((item, index, items) => {
      if (item.index !== index) {
        setTimeout((a, b) => {
          parent.socket.emit('imove', { a, b });
        }, 25 * totalSwaps, item.index, index);
        const oldIndex = items.findIndex(item => item.index === index);
        if (oldIndex >= 0) items[oldIndex].index = item.index;
        item.index = index;
        totalSwaps += 1;
      }
    });

  return totalSwaps;
}

export function scrambleInventory() {
  let totalSwaps = 0;
  Object.values(character.items)
    .map((item, index) => ({
      ...item,
      index,
    }))
    .filter(item => item.name)
    .forEach((item, index) => {
      setTimeout((a, b) => {
        parent.socket.emit('imove', { a, b });
      }, 25 * totalSwaps, index, getRandomInt(0, character.items.length - 1));
      totalSwaps += 1;
    });
  return totalSwaps;
}