export class NoPublicAccess extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export const ErrorEnums = {
  no_role_access: "NO_ROLE_ACCESS",
};
