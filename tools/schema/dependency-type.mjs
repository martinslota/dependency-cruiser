export default {
  definitions: {
    DependencyTypeType: {
      type: "string",
      enum: [
        "aliased",
        "aliased-subpath-import",
        "aliased-tsconfig",
        "aliased-webpack",
        "aliased-workspace",
        "core",
        "deprecated",
        "local",
        "localmodule",
        "npm",
        "npm-bundled",
        "npm-dev",
        "npm-no-pkg",
        "npm-optional",
        "npm-peer",
        "npm-unknown",
        "undetermined",
        "unknown",
        "type-only",
      ],
    },
  },
};
