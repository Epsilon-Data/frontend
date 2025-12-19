type UrlParts = {
  type?: string;
  host?: string;
  port?: string;
  username?: string;
  password?: string;
  name?: string;
};

export const buildDatabaseUrl = ({ type, host, port, username, password, name }: UrlParts): string | null => {
  if (!type || !host) {
    return null;
  }

  const auth =
    username && password
      ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
      : username
        ? `${encodeURIComponent(username)}@`
        : '';

  const portPart = port ? `:${port}` : '';
  const dbPart = name ? `/${encodeURIComponent(name)}` : '';

  return `${type}://${auth}${host}${portPart}${dbPart}`;
};
