/* eslint-disable security/detect-object-injection */
import uniq from "lodash/uniq.js";

function normalizeManifestKeys(pManifest) {
  let lReturnValue = pManifest;

  if (pManifest.bundleDependencies) {
    pManifest.bundledDependencies = structuredClone(
      pManifest.bundleDependencies,
    );
    Reflect.deleteProperty(pManifest, "bundleDependencies");
  }
  return lReturnValue;
}

function mergeDependencyKey(pClosestDependencyKey, pFurtherDependencyKey) {
  return {
    ...pFurtherDependencyKey,
    ...pClosestDependencyKey,
  };
}

function mergeDependencyArray(pClosestDependencyKey, pFurtherDependencyKey) {
  return uniq(pClosestDependencyKey.concat(pFurtherDependencyKey));
}

function isDependencyKey(pKey) {
  return pKey.endsWith("ependencies");
}

function getDependencyKeys(pPackage) {
  return Object.keys(pPackage).filter(isDependencyKey);
}

function getJointUniqueDependencyKeys(pClosestPackage, pFurtherPackage) {
  return uniq(
    getDependencyKeys(pClosestPackage).concat(
      getDependencyKeys(pFurtherPackage),
    ),
  );
}

/**
 * returns an object with
 * - the *dependencies keys from both passed packages
 * - in each dependency key the merged dependencies of both packages
 *   in case of conflicts the dependency in the closest package 'wins'
 *
 * It takes into account each key ending in 'ependencies' - so dev, optional,
 * bundle, peer and regular dependencies are included.
 *
 * (This function exists for mono repos that use 'collective' dependencies)
 * @param  {any} pClosestManifest the contents of the package.json closer to the
 *                               source being perused (e.g. ./packages/sub/package.json)
 * @param  {any} pFurtherManifest the contents of a package.json further away
 *                               (e.g. ./package.json)
 * @return {any}                 the combined dependency-keys within those manifests
 */
export default function mergeManifests(pClosestManifest, pFurtherManifest) {
  return getJointUniqueDependencyKeys(
    normalizeManifestKeys(pClosestManifest),
    normalizeManifestKeys(pFurtherManifest),
  )
    .map((pKey) => ({
      key: pKey,
      value: pKey.startsWith("bundle")
        ? mergeDependencyArray(
            pClosestManifest?.[pKey] ?? [],
            pFurtherManifest?.[pKey] ?? [],
          )
        : mergeDependencyKey(
            pClosestManifest?.[pKey] ?? {},
            pFurtherManifest?.[pKey] ?? {},
          ),
    }))
    .reduce((pJoinedObject, pJoinedKey) => {
      pJoinedObject[pJoinedKey.key] = pJoinedKey.value;
      return pJoinedObject;
    }, {});
}
