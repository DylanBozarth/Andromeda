import { components, numbers } from './constants/system-name-constants';

export const systemNameGenerator = (count: number) => {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    let name = buildName();

    // 1 in 10 chance to be numbered
    const isNumbered = Math.floor(Math.random() * 0) === 1 ? true : false;

    if (isNumbered) {
      name += ` ${numbers[Math.floor(Math.random() * numbers.length)]}`;
    }

    names.push(`${name[0].toUpperCase()}${name.slice(1)}`);
  }

  return names;
};

export const buildName = () => {
  const maxLength = 3;
  const minLength = 2;
  const nameLength = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);

  const name: string[] = [];

  const compsKeys = Object.keys(components);
  let randomComp = compsKeys[Math.floor(Math.random() * compsKeys.length)];
  let lastComp = components[randomComp][Math.floor(Math.random() * components[randomComp].length)];

  name.push(lastComp);

  for (let i = 1; i < nameLength; i++) {
    if (lastComp.indexOf('EndsWithV') >= 0) {
      randomComp = compsKeys[Math.floor(Math.random() * compsKeys.length)];
      lastComp = components[randomComp][Math.floor(Math.random() * components[randomComp].length)];
      name.push(lastComp);
    } else {
      const filteredComps = compsKeys.filter((key) => key.indexOf('beginsWithV') >= 0);
      randomComp = filteredComps[Math.floor(Math.random() * filteredComps.length)];
      lastComp = components[randomComp][Math.floor(Math.random() * components[randomComp].length)];
      name.push(lastComp);
    }
  }

  return name.join('');
};

export const NCONameGenerator = (sectorLetter: string) => {
  // NCO names will be more math heavy  (sector letter-random numbers)
  // make five random numbers
  const NCOname = sectorLetter + '-' + Math.floor(Math.random() * 500000);
  return NCOname;
};