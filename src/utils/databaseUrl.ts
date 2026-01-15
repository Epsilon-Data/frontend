type UrlParts = {
  type?: string;
  host?: string;
  port?: string;
  username?: string;
  password?: string;
  name?: string;
  ssl?: boolean;
};

export const buildDatabaseUrl = ({ type, host, port, username, password, name, ssl }: UrlParts): string | null => {
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

  const base = `${type}://${auth}${host}${portPart}${dbPart}`;

  try {
    const url = new URL(base);
    const dbType = type.toLowerCase();

    if (dbType === 'postgres') {
      url.searchParams.set('sslmode', ssl ? 'require' : 'disable');
    } else if (ssl === true) {
      url.searchParams.set('ssl', 'true');
    } else if (ssl === false) {
      url.searchParams.set('ssl', 'false');
    }

    return url.toString();
  } catch {
    if (ssl === undefined) return base;

    if (type === 'postgres') {
      return `${base}?sslmode=${ssl ? 'require' : 'disable'}`;
    }

    return `${base}?ssl=${ssl ? 'true' : 'false'}`;
  }
};
