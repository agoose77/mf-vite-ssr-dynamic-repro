import { loadRemote, registerRemotes } from "@module-federation/runtime";
import { remotes } from "./remotes";

// One promise per module id, shared by the route loader, React.lazy and the
// client entry, so the server and the hydrating client resolve the same module.
const cache = new Map();
let clientRemotesRegistered = false;

async function load(id) {
  let bodule;
  if (import.meta.env.SSR) {
    // Server: no plugin-created instance exists, use our own.
    const { getServerInstance } = await import("./server");
    const inst = getServerInstance();

    bodule = await inst.loadRemote(id);
  } else {
    // Client: the Vite plugin initialised the global instance before this entry
    // ran (hostInitInjectLocation: "entry"), so the global API is usable here.
    // Registering at module top level would run before that initialisation.
    if (!clientRemotesRegistered) {
      registerRemotes(remotes);
      clientRemotesRegistered = true;
    }
    bodule = await loadRemote(id);
  }
  if (!bodule) throw new Error(`Remote module "${id}" could not be loaded`);
  return bodule;
}

export function loadRemoteModule(id) {
  let promise = cache.get(id);
  if (!promise) {
    promise = load(id);
    promise.catch(() => cache.delete(id));
    cache.set(id, promise);
  }
  return promise;
}
