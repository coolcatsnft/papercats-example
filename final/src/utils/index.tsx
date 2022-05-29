import { TPaperCatAttribute } from "../hooks/usePaperCat";

/**
 * Get an env variable or return a default
 *
 * @param name         Name of env
 * @param defaultValue Default value
 *
 * @returns mixed
 */
export function envDefault(name: string, defaultValue: any): any {
  try {
    return env(name);
  } catch(e: any) {
    return defaultValue;
  }
}

/**
 * Get an env variable
 *
 * @param name Name of env variable
 *
 * @returns string
 *
 * @throws Error
 */
 export function env(name: string): any {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
}

/**
 * Output the current papercat attributes
 * 
 * @param {TPaperCat} paperCat 
 * 
 * @returns {TPaperCatAttributes}
 */
export function getPaperCatAttributes(paperCat: any) {
  return (paperCat.attributes || []).reduce((object: any, currentAttribute: TPaperCatAttribute) => {
    const key = currentAttribute.trait_type.replace(/\s/g, '_').toLowerCase();
    const lbl = currentAttribute.trait_type.replace(/_/g, ' ').toLowerCase()
    const o = {} as any;
    o[key] = {
      trait_type: lbl,
      value: currentAttribute.value
    };
    return {...object, ...o};
  }, {});
}
