import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from './firebase';

let functions;

export function initFunctions() {
  // When cloud functions are not deployed to 'us-default1', the region must be
  // defined in the env var!
  const region = process.env.REACT_APP_FIREBASE_FUNCTIONS_REGION;
  functions = getFunctions(getApp(), region);
}

async function makeCall(name, params) {
  const func = httpsCallable(functions, name);
  const result = await func(params);
  return result.data;
}

// Accepts slot requests
export async function acceptSlotRequests(params) {
  const data = await makeCall('acceptSlotRequests', params);
  return data;
}

// Creates a new project
export async function createProject(params) {
  const data = await makeCall('createProject', params);
  return data;
}
