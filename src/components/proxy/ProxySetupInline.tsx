import { generateProxyToken, GenerateTokenResponse, getProxyStatus, listProxyTokens } from '@app/api/proxy.api';
import { retryCrawl } from '@app/api/projects.api';
import { Button, message, Spin, Steps, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { FiCopy, FiRefreshCw } from 'react-icons/fi';
import { IoReload } from 'react-icons/io5';
import { HiOutlineServerStack } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const { Text } = Typography;

type Props = {
  projectId: string;
  projectStatus: string;
};

export const ProxySetupInline = ({ projectId, projectStatus }: Props) => {
  const [token, setToken] = useState<GenerateTokenResponse | null>(null);
  const [generating, setGenerating] = useState(false);
  const [hasExistingTokens, setHasExistingTokens] = useState(false);
  const [proxyStatus, setProxyStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const [tokens, status] = await Promise.all([
        listProxyTokens(projectId),
        getProxyStatus(projectId).catch(() => null),
      ]);
      setHasExistingTokens(tokens.length > 0);
      setProxyStatus(status?.status ?? null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await generateProxyToken(projectId, 'default');
      setToken(result);
      setHasExistingTokens(true);
    } catch {
      message.error('Failed to generate setup token');
    } finally {
      setGenerating(false);
    }
  };

  const setupCommand = token
    ? `curl -fsSL https://raw.githubusercontent.com/Epsilon-Data/epsilon-proxy/main/scripts/install.sh | sh && \\
epsilon-proxy register --token ${token.installToken} && \\
epsilon-proxy start`
    : '';

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await retryCrawl(projectId);
      message.success('Retry triggered — proxy will re-crawl on next heartbeat');
      fetchStatus();
    } catch {
      message.error('Failed to retry crawl');
    } finally {
      setRetrying(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(setupCommand);
    setCopied(true);
    message.success('Command copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin />
      </div>
    );
  }

  const isCrawling = projectStatus === 'CRAWLING';
  const isError = projectStatus === 'ERROR';
  const isOnline = proxyStatus === 'ONLINE';

  // Proxy is connected and crawling
  if (isCrawling) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Spin size="large" className="mb-6" />
        <Tag color="processing" className="mb-4 text-sm px-3 py-0.5">
          Crawling schema...
        </Tag>
        <div className="text-2xl font-semibold text-grey-9">Schema crawl in progress</div>
        <div className="mt-2 text-sm text-grey-7 font-light max-w-md">
          The proxy is crawling your database schema. This may take a few minutes.
        </div>
      </div>
    );
  }

  // Token generated — show the command
  if (token) {
    const currentStep = isOnline ? 2 : proxyStatus === 'OFFLINE' ? 1 : 0;

    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <HiOutlineServerStack className="text-blueDark/60 mx-auto mb-4" size={64} />
          <div className="text-2xl font-semibold text-grey-9">Set up your proxy</div>
          <div className="mt-1 text-sm text-grey-7 font-light">
            Run this command on the machine where your database is hosted
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <Text strong className="text-yellow-800 text-xs">
            Copy this command now — the token won&apos;t be shown again.
          </Text>
        </div>

        <div className="relative group">
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {setupCommand}
          </pre>
          <Button
            icon={<FiCopy />}
            onClick={handleCopy}
            type={copied ? 'primary' : 'default'}
            size="small"
            className="absolute top-3 right-3"
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <div className="mt-2 text-xs text-grey-7 text-center">
          Credentials are entered on your machine and never sent to the platform.
        </div>

        <Steps
          className="mt-8"
          size="small"
          current={currentStep}
          items={[
            { title: 'Install & register', description: 'Run the command above' },
            { title: 'Proxy connects', description: isOnline ? 'Connected' : 'Waiting...' },
            { title: 'Schema crawled', description: 'Auto-starts on connect' },
          ]}
        />

        <div className="flex justify-between items-center mt-8">
          <Button icon={<FiRefreshCw />} size="small" onClick={fetchStatus}>
            Refresh status
          </Button>
          <Link to={`/project/settings?id=${projectId}`}>
            <Button type="link" size="small">
              Advanced token management
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // No token yet — show generate button
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <HiOutlineServerStack className="text-blueDark/60 mb-5" size={90} />
      {isError && (
        <Tag color="error" className="mb-4 text-sm px-3 py-0.5">
          Crawl failed
        </Tag>
      )}
      <div className="text-2xl md:text-3xl font-semibold text-grey-9">
        {isError ? 'Schema crawl failed' : 'Connect your database'}
      </div>
      <div className="mt-2 text-sm md:text-base text-grey-7 font-light max-w-md">
        {isError
          ? 'Something went wrong during the schema crawl. Make sure the proxy is running and try again.'
          : 'Generate a setup command to install the Epsilon Proxy on your database server. Your credentials never leave your machine.'}
      </div>

      {isError && isOnline ? (
        <Button
          type="primary"
          size="large"
          icon={<IoReload />}
          onClick={handleRetry}
          loading={retrying}
          className="mt-6 font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo h-11 px-8"
        >
          Retry crawl
        </Button>
      ) : isError && !isOnline ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          <Tag color="red" className="text-sm px-3 py-0.5">
            Proxy is offline
          </Tag>
          <div className="text-xs text-grey-7">Start the proxy first, then retry</div>
          <div className="flex gap-3">
            <Button icon={<IoReload />} onClick={handleRetry} loading={retrying}>
              Retry crawl
            </Button>
            <Button icon={<HiOutlineServerStack />} onClick={handleGenerate} loading={generating}>
              Re-generate setup command
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="primary"
          size="large"
          icon={<HiOutlineServerStack />}
          onClick={handleGenerate}
          loading={generating}
          className="mt-6 font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo h-11 px-8"
        >
          {hasExistingTokens ? 'Generate new setup command' : 'Generate setup command'}
        </Button>
      )}

      {!isError && hasExistingTokens && (
        <Link to={`/project/settings?id=${projectId}`} className="mt-3">
          <Button type="link" size="small">
            Manage existing tokens
          </Button>
        </Link>
      )}

      <Button icon={<FiRefreshCw />} size="small" onClick={fetchStatus} className="mt-4">
        Refresh status
      </Button>
    </div>
  );
};
