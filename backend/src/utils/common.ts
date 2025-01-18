import { readContent } from '../lib/file';
import yaml from 'js-yaml';
import { documentType } from '../modules/types/document.type';

/**
 * Retrieves the document type (GQL / OpenAPI) based on its filename.
 * @param {string} filename - The filename of the document.
 * @returns {Promise<string>} A promise that resolves to the document type.
 */
export const getDocumentType = async (filename: string) => {
  const content = await readContent(filename);
  let parsedYaml: any = yaml.load(content);

  if (parsedYaml.gqlapi) {
    return documentType.GQL;
  } else if (parsedYaml.openapi) {
    return documentType.OPENAPI;
  } else {
    throw new Error('Invalid docuement type');
  }
};
