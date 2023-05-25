import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from './firebase';

let functions;

export function initFunctions() {
  // When cloud functions are not deployed to 'us-default1', the region must be
  // defined in the env var!
  const region = process.env.REACT_APP_FIREBASE_FUNCTIONS_REGION;
  functions = getFunctions(getApp(), region);
}

// Creates a new project
export async function createProject({ id, name }) {
  const createProject = httpsCallable(functions, 'createProject');
  const result = await createProject({ id, name });
  return result.data;
}
