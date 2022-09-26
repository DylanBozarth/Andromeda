export const systemNameGenerator = (count: number) => {
  const components = {
    beginsWithCEndsWithV: [
      'tania',
      'hiri',
      'gawa',
      'carro',
      'rilia',
      'stea',
      'lia',
      'lea',
      'ria',
      'mia',
      'wei',
      'ruta',
      'zuno',
      'lara',
      'nia',
      'tera',
      'gantu',
      'yama',
      'tune',
      'cury',
      'pra',
      'thea',
      'clite',
    ],
    beginsWithCEndsWithC: [
      'b',
      'c',
      'd',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'p',
      'q',
      'r',
      's',
      't',
      'v',
      'w',
      'x',
      'y',
      'z',
      'br',
      'cr',
      'dr',
      'fr',
      'gr',
      'pr',
      'str',
      'tr',
      'bl',
      'cl',
      'fl',
      'gl',
      'pl',
      'sl',
      'sc',
      'sk',
      'sm',
      'sn',
      'sp',
      'ss',
      'st',
      'sw',
      'ch',
      'sh',
      'th',
      'wh',
      'turn',
      'ter',
      'nus',
      'rus',
      'hines',
      'nides',
      'nov',
      'phus',
      'nerth',
      'vis',
      'liv',
      'ter',
      'nus',
      'bos',
      'tis',
    ],
    beginsWithVEndsWithC: [
      'una',
      'ion',
      'iea',
      'iri',
      'illes',
      'eshan',
      'erth',
      'arth',
      'orth',
      'oth',
      'illon',
      'ov',
      'arvis',
      'ars',
      'illes',
      'ides',
      'adus',
      'urn',
      'iuq',
      'orix',
      'apus',
      'ion',
      'eon',
      'eron',
    ],
    beginsWithVEndsWithV: [
      'a',
      'e',
      'o',
      'u',
      'y',
      'ae',
      'ai',
      'ao',
      'au',
      'a',
      'ay',
      'ea',
      'ei',
      'eo',
      'eu',
      'e',
      'ey',
      'ua',
      'ue',
      'ui',
      'uo',
      'u',
      'uy',
      'ia',
      'ie',
      'iu',
      'io',
      'iy',
      'oa',
      'oe',
      'ou',
      'oi',
      'o',
      'oy',
      'agua',
      'olla',
      'inda',
      'oria',
      'ilia',
      'ichi',
      'ara',
      'yria',
      'onoe',
      'ippe',
      'osie',
      'one',
      'ore',
      'ade',
      'ypso',
      'ora',
      'ao',
      'omia',
    ],
  };

  const numbers = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VII',
    'IX',
    'X',
    'XI',
    'XII',
    'XIII',
    'XIV',
    'XV',
  ];

  const buildName = () => {
    const maxLength = 3;
    const minLength = 2;
    const nameLength = Math.floor(Math.random() * (maxLength - minLength + 1) + minLength);

    const name: string[] = [];

    const compsKeys = Object.keys(components);
    let randomComp = compsKeys[Math.floor(Math.random() * compsKeys.length)];
    let lastComp =
      components[randomComp][Math.floor(Math.random() * components[randomComp].length)];

    name.push(lastComp);

    for (let i = 1; i < nameLength; i++) {
      if (lastComp.indexOf('EndsWithV') >= 0) {
        randomComp = compsKeys[Math.floor(Math.random() * compsKeys.length)];
        lastComp =
          components[randomComp][Math.floor(Math.random() * components[randomComp].length)];
        name.push(lastComp);
      } else {
        const filteredComps = compsKeys.filter((key) => key.indexOf('beginsWithV') >= 0);
        randomComp = filteredComps[Math.floor(Math.random() * filteredComps.length)];
        lastComp =
          components[randomComp][Math.floor(Math.random() * components[randomComp].length)];
        name.push(lastComp);
      }
    }

    return name.join('');
  };

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
